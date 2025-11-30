-- ============================================
-- KadaSkill Database Schema v2.0
-- Updated based on requirements clarification
-- Supabase PostgreSQL Implementation
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. USERS & PROFILES
-- ============================================

-- Note: Supabase auth.users table is managed automatically
-- We extend it with a profiles table

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    cover_image_url TEXT,

    -- User Role (ADDED)
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),

    -- Gamification fields
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,

    -- Social fields
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,

    -- Profile settings
    is_public BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_total_xp ON profiles(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON profiles(level DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============================================
-- 2. COURSES
-- ============================================

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),

    -- Course metadata
    category VARCHAR(50) NOT NULL CHECK (category IN ('AI', 'Cybersecurity', 'Cloud')),
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    duration_hours INTEGER, -- estimated hours to complete

    -- Media
    thumbnail_url TEXT,
    cover_image_url TEXT,

    -- Course content
    prerequisites TEXT[], -- array of prerequisite skills
    learning_objectives TEXT[],

    -- Engagement
    enrolled_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.0,

    -- Status (ADDED draft support)
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,

    -- Admin
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);

-- ============================================
-- 3. QUIZZES (For course lessons)
-- ============================================
-- Note: Created before lessons because lessons reference quizzes

CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Quiz configuration
    passing_score INTEGER DEFAULT 70, -- Percentage needed to pass
    time_limit_minutes INTEGER,
    max_attempts INTEGER,

    -- Questions stored as JSONB array
    questions JSONB NOT NULL,
    /*
    Format:
    [
      {
        "question": "What is Python?",
        "options": ["Programming language", "Snake", "Tool", "Framework"],
        "correct_answer": 0,
        "explanation": "Python is a programming language..."
      }
    ]
    */

    -- Rewards
    xp_reward INTEGER DEFAULT 20,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. LESSONS
-- ============================================

CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,

    -- Lesson content (SIMPLIFIED)
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('video', 'text', 'quiz')),

    -- Video lessons
    video_url TEXT, -- YouTube, Vimeo, or hosted video URL
    video_duration_minutes INTEGER,

    -- Text lessons
    text_content TEXT, -- Markdown or HTML content

    -- Quiz lessons (reference to quizzes table)
    quiz_id UUID REFERENCES quizzes(id),

    -- Ordering
    order_index INTEGER NOT NULL,
    module_name VARCHAR(100), -- e.g., "Module 1: Introduction"

    -- Learning
    xp_reward INTEGER DEFAULT 10,

    -- Status
    is_published BOOLEAN DEFAULT TRUE,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(course_id, slug),
    UNIQUE(course_id, order_index)
);

CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_content_type ON lessons(content_type);

-- ============================================
-- 5. COURSE ENROLLMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

    -- Progress tracking (SIMPLIFIED)
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped', 'paused')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    current_lesson_id UUID REFERENCES lessons(id),

    -- Completion
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Engagement
    last_accessed_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);

-- ============================================
-- 6. LESSON PROGRESS (SIMPLIFIED)
-- ============================================

CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,

    -- Simple completion tracking
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_enrollment_id ON lesson_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_completed ON lesson_progress(is_completed);

-- ============================================
-- 7. QUIZ ATTEMPTS (For course quizzes)
-- ============================================

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id), -- Which lesson this quiz belongs to

    -- Attempt details
    attempt_number INTEGER DEFAULT 1,
    answers JSONB, -- User's answers: {"0": 2, "1": 0, "2": 3} (question index: answer index)

    -- Scoring
    score INTEGER, -- Percentage (0-100)
    passed BOOLEAN,
    xp_earned INTEGER DEFAULT 0,

    -- Timing
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    time_taken_minutes INTEGER
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_lesson_id ON quiz_attempts(lesson_id);

-- ============================================
-- 8. CERTIFICATIONS (External Study Guides)
-- ============================================

CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(500),
    description TEXT,

    -- Certification details
    category VARCHAR(50) NOT NULL CHECK (category IN ('AI', 'Cybersecurity', 'Cloud')),
    level VARCHAR(20) CHECK (level IN ('Foundation', 'Associate', 'Professional', 'Expert')),
    provider VARCHAR(100), -- e.g., "AWS", "Microsoft", "CompTIA"

    -- Requirements
    estimated_duration_hours INTEGER,
    prerequisites TEXT[],

    -- Content
    icon_url TEXT,
    badge_url TEXT,
    overview TEXT,

    -- Study resources stored as JSONB
    study_resources JSONB,
    /*
    Format:
    [
      {
        "title": "Official AWS Documentation",
        "url": "https://aws.amazon.com/...",
        "type": "documentation",
        "is_completed": false
      },
      {
        "title": "Practice Exam",
        "url": "/practice/aws-saa",
        "type": "practice",
        "is_completed": false
      }
    ]
    */

    -- External resources
    official_url TEXT,
    exam_code VARCHAR(50),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certifications_category ON certifications(category);
CREATE INDEX IF NOT EXISTS idx_certifications_slug ON certifications(slug);
CREATE INDEX IF NOT EXISTS idx_certifications_is_active ON certifications(is_active);

-- ============================================
-- 9. USER CERTIFICATIONS (Study Progress)
-- ============================================

CREATE TABLE IF NOT EXISTS user_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,

    -- Progress (SIMPLIFIED for study guides)
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),

    -- Track which resources they've reviewed
    resources_completed JSONB DEFAULT '[]'::jsonb,
    /*
    Format: Array of resource indices or IDs
    [0, 2, 5] means they completed resources at index 0, 2, and 5
    */

    -- Dates
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,

    -- If they passed the real exam
    passed_real_exam BOOLEAN DEFAULT FALSE,
    exam_passed_date DATE,
    certificate_number VARCHAR(100), -- Their official cert number

    -- Display on profile
    is_pinned BOOLEAN DEFAULT FALSE,

    -- Metadata
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id, certification_id)
);

CREATE INDEX IF NOT EXISTS idx_user_certifications_user_id ON user_certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certifications_status ON user_certifications(status);

-- ============================================
-- 10. PRACTICE EXERCISES (Standalone Multiple Choice)
-- ============================================

CREATE TABLE IF NOT EXISTS practice_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Exercise details
    category VARCHAR(50) NOT NULL CHECK (category IN ('AI', 'Cybersecurity', 'Cloud')),
    difficulty VARCHAR(20) CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),

    -- Multiple choice questions (5-10 questions)
    questions JSONB NOT NULL,
    /*
    Format:
    [
      {
        "question": "What does MFA stand for?",
        "options": ["Multi-Factor Authentication", "Multiple File Access", "Main Frame Application", "Mobile First Architecture"],
        "correct_answer": 0,
        "explanation": "MFA stands for Multi-Factor Authentication, which adds an extra layer of security..."
      }
    ]
    */

    -- Configuration
    passing_score INTEGER DEFAULT 70,
    time_limit_minutes INTEGER,

    -- Rewards (awarded on FIRST completion only)
    xp_reward INTEGER DEFAULT 15,

    -- Media
    thumbnail_url TEXT,

    -- Related content
    related_course_ids UUID[],
    tags TEXT[],

    -- Status
    is_published BOOLEAN DEFAULT TRUE,

    -- Metadata
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_practice_category ON practice_exercises(category);
CREATE INDEX IF NOT EXISTS idx_practice_difficulty ON practice_exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_practice_slug ON practice_exercises(slug);
CREATE INDEX IF NOT EXISTS idx_practice_is_published ON practice_exercises(is_published);

-- ============================================
-- 11. PRACTICE ATTEMPTS (Track completion & best score)
-- ============================================

CREATE TABLE IF NOT EXISTS practice_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES practice_exercises(id) ON DELETE CASCADE,

    -- Attempt details
    attempt_number INTEGER DEFAULT 1,
    answers JSONB, -- User's answers: {"0": 1, "1": 0, "2": 2}

    -- Scoring
    score INTEGER, -- Percentage (0-100)
    passed BOOLEAN,
    xp_earned INTEGER DEFAULT 0, -- Only awarded on first pass

    -- Track best
    is_best_score BOOLEAN DEFAULT FALSE,

    -- Timing
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    time_taken_minutes INTEGER
);

CREATE INDEX IF NOT EXISTS idx_practice_attempts_user_id ON practice_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_attempts_exercise_id ON practice_attempts(exercise_id);
CREATE INDEX IF NOT EXISTS idx_practice_attempts_score ON practice_attempts(score DESC);

-- ============================================
-- 12. BADGES
-- ============================================

CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Badge details
    category VARCHAR(50), -- 'achievement', 'milestone', 'special'
    tier VARCHAR(20) CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond')),

    -- Visual
    icon_url TEXT,
    color VARCHAR(7), -- Hex color code

    -- Earning criteria
    criteria_type VARCHAR(50), -- 'xp_threshold', 'courses_completed', 'streak', 'custom'
    criteria_value INTEGER,
    criteria_config JSONB, -- Flexible configuration

    -- Rarity
    rarity_score INTEGER DEFAULT 1, -- 1-100, higher = more rare

    -- Auto-award vs Manual
    auto_award BOOLEAN DEFAULT TRUE, -- If true, awarded automatically when criteria met

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_badges_category ON badges(category);
CREATE INDEX IF NOT EXISTS idx_badges_slug ON badges(slug);
CREATE INDEX IF NOT EXISTS idx_badges_auto_award ON badges(auto_award);

-- ============================================
-- 13. USER BADGES
-- ============================================

CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,

    -- Award details
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    awarded_by UUID REFERENCES profiles(id), -- NULL if auto-awarded, admin ID if manual
    is_displayed BOOLEAN DEFAULT TRUE, -- Show on profile

    UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_earned_at ON user_badges(earned_at DESC);

-- ============================================
-- 14. XP TRANSACTIONS
-- ============================================

CREATE TABLE IF NOT EXISTS xp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- Transaction details
    amount INTEGER NOT NULL, -- Can be positive or negative
    source_type VARCHAR(50) NOT NULL, -- 'lesson_complete', 'practice_complete', 'quiz_pass', 'bonus', 'manual'
    source_id UUID, -- ID of the lesson, exercise, etc.

    -- Metadata
    description VARCHAR(255),
    awarded_by UUID REFERENCES profiles(id), -- NULL if automatic, admin ID if manual
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_user_id ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_created_at ON xp_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_xp_source_type ON xp_transactions(source_type);

-- ============================================
-- 15. DAILY STREAKS
-- ============================================

CREATE TABLE IF NOT EXISTS daily_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,

    -- Activity tracking
    activities_completed INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    exercises_completed INTEGER DEFAULT 0,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_activities_user_id ON daily_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_date ON daily_activities(activity_date DESC);

-- ============================================
-- 16. LEADERBOARD (Materialized View)
-- ============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard AS
SELECT
    p.id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.total_xp,
    p.level,
    p.current_streak,
    ROW_NUMBER() OVER (ORDER BY p.total_xp DESC, p.level DESC) as rank,
    COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'completed') as courses_completed,
    COUNT(DISTINCT ub.id) as badges_earned
FROM profiles p
LEFT JOIN enrollments e ON p.id = e.user_id
LEFT JOIN user_badges ub ON p.id = ub.user_id
WHERE p.role = 'user' -- Exclude admins from leaderboard
GROUP BY p.id, p.username, p.full_name, p.avatar_url, p.total_xp, p.level, p.current_streak
ORDER BY p.total_xp DESC
LIMIT 100;

-- Create index on the materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_leaderboard_id ON leaderboard(id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard(rank);

-- Function to refresh leaderboard
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 17. NOTIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- Notification content
    type VARCHAR(50) NOT NULL, -- 'badge_earned', 'course_completed', 'streak_milestone', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT,

    -- Link/action
    action_url TEXT,
    action_label VARCHAR(100),

    -- Status
    is_read BOOLEAN DEFAULT FALSE,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practice_exercises_updated_at BEFORE UPDATE ON practice_exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON lesson_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user's total XP when XP transaction is added
CREATE OR REPLACE FUNCTION update_user_xp()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total_xp in profiles
    UPDATE profiles
    SET total_xp = total_xp + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.user_id;

    -- Update level based on XP (level = floor(sqrt(total_xp / 100)))
    UPDATE profiles
    SET level = GREATEST(1, FLOOR(SQRT(total_xp / 100.0)))
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER xp_transaction_update_user AFTER INSERT ON xp_transactions
    FOR EACH ROW EXECUTE FUNCTION update_user_xp();

-- Function to update streak
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
    last_activity DATE;
    new_streak INTEGER;
BEGIN
    -- Get last activity date
    SELECT last_activity_date INTO last_activity
    FROM profiles
    WHERE id = NEW.user_id;

    -- Calculate new streak
    IF last_activity IS NULL THEN
        new_streak := 1;
    ELSIF last_activity = NEW.activity_date - INTERVAL '1 day' THEN
        new_streak := (SELECT current_streak FROM profiles WHERE id = NEW.user_id) + 1;
    ELSIF last_activity = NEW.activity_date THEN
        new_streak := (SELECT current_streak FROM profiles WHERE id = NEW.user_id);
    ELSE
        new_streak := 1;
    END IF;

    -- Update profile
    UPDATE profiles
    SET
        current_streak = new_streak,
        longest_streak = GREATEST(longest_streak, new_streak),
        last_activity_date = NEW.activity_date,
        updated_at = NOW()
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER daily_activity_update_streak AFTER INSERT ON daily_activities
    FOR EACH ROW EXECUTE FUNCTION update_user_streak();

-- Function to create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, username, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        SPLIT_PART(NEW.email, '@', 1), -- Use email prefix as username
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)), -- Use email prefix as fallback
        'user' -- Default role is user
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users (Supabase auth table)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update enrollment progress when lesson is completed
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
    new_progress INTEGER;
BEGIN
    -- Only run if lesson was just completed
    IF NEW.is_completed = TRUE AND (OLD.is_completed = FALSE OR OLD.is_completed IS NULL) THEN
        -- Get total lessons in course
        SELECT COUNT(*) INTO total_lessons
        FROM lessons l
        JOIN enrollments e ON l.course_id = e.course_id
        WHERE e.id = NEW.enrollment_id;

        -- Get completed lessons count
        SELECT COUNT(*) INTO completed_lessons
        FROM lesson_progress
        WHERE enrollment_id = NEW.enrollment_id AND is_completed = TRUE;

        -- Calculate progress percentage
        new_progress := ROUND((completed_lessons::NUMERIC / total_lessons) * 100);

        -- Update enrollment
        UPDATE enrollments
        SET
            progress_percentage = new_progress,
            status = CASE
                WHEN new_progress = 100 THEN 'completed'
                ELSE status
            END,
            completed_at = CASE
                WHEN new_progress = 100 THEN NOW()
                ELSE completed_at
            END,
            last_accessed_at = NOW()
        WHERE id = NEW.enrollment_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lesson_progress_update_enrollment AFTER INSERT OR UPDATE ON lesson_progress
    FOR EACH ROW EXECUTE FUNCTION update_enrollment_progress();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all public profiles, admins can read all, users can only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (is_public = true OR auth.uid() = id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses: Everyone can read published, admins can manage all
CREATE POLICY "Published courses viewable by everyone" ON courses
    FOR SELECT USING (is_published = true OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can insert courses" ON courses
    FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update courses" ON courses
    FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can delete courses" ON courses
    FOR DELETE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Lessons: Everyone can read published, admins can manage
CREATE POLICY "Published lessons viewable by everyone" ON lessons
    FOR SELECT USING (is_published = true OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can manage lessons" ON lessons
    FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Quizzes: Everyone can read, admins can manage
CREATE POLICY "Quizzes viewable by everyone" ON quizzes
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage quizzes" ON quizzes
    FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Enrollments: Users can manage their own
CREATE POLICY "Users can view own enrollments" ON enrollments
    FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can create own enrollments" ON enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments" ON enrollments
    FOR UPDATE USING (auth.uid() = user_id);

-- Lesson Progress: Users can manage their own
CREATE POLICY "Users can view own progress" ON lesson_progress
    FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can create own progress" ON lesson_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON lesson_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Quiz Attempts: Users can manage their own
CREATE POLICY "Users can view own quiz attempts" ON quiz_attempts
    FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can create quiz attempts" ON quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Certifications: Everyone can read active, admins can manage
CREATE POLICY "Active certifications viewable by everyone" ON certifications
    FOR SELECT USING (is_active = true OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can manage certifications" ON certifications
    FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- User Certifications: Users can manage their own
CREATE POLICY "Users can view own certifications" ON user_certifications
    FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can create own cert progress" ON user_certifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cert progress" ON user_certifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Practice Exercises: Everyone can read published, admins can manage
CREATE POLICY "Published exercises viewable by everyone" ON practice_exercises
    FOR SELECT USING (is_published = true OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can manage practice exercises" ON practice_exercises
    FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Practice Attempts: Users can manage their own
CREATE POLICY "Users can view own practice attempts" ON practice_attempts
    FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can create practice attempts" ON practice_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Badges: Everyone can read active, admins can manage
CREATE POLICY "Active badges viewable by everyone" ON badges
    FOR SELECT USING (is_active = true OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can manage badges" ON badges
    FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- User Badges: Users can view their own, admins can manage all
CREATE POLICY "Users can view own badges" ON user_badges
    FOR SELECT USING (auth.uid() = user_id OR is_displayed = true OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update badge display" ON user_badges
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can award badges" ON user_badges
    FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- XP Transactions: Users can view their own, admins can manage
CREATE POLICY "Users can view own XP" ON xp_transactions
    FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can award XP" ON xp_transactions
    FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Daily Activities: Users can manage their own
CREATE POLICY "Users can view own activities" ON daily_activities
    FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can create activities" ON daily_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications: Users can manage their own
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can create notifications" ON notifications
    FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============================================
-- COMMENTS & DOCUMENTATION
-- ============================================
--
-- This schema is designed for KadaSkill learning platform with:
--
-- 1. ADMIN ROLE: Can manage all content (courses, lessons, practice, certifications)
-- 2. SIMPLIFIED PRACTICE: Multiple choice only (5-10 questions)
-- 3. VIDEO LESSONS: Supported via lessons.video_url
-- 4. EXTERNAL CERTIFICATIONS: Study guides for real-world certifications
-- 5. AUTOMATIC XP & STREAKS: Triggers handle gamification
-- 6. FREE NAVIGATION: Users can jump to any lesson
-- 7. UNLIMITED RETAKES: Users can retry practice/quizzes
--
-- Key Design Decisions:
-- - Practice exercises are standalone (not part of courses)
-- - Quiz questions stored as JSONB for flexibility
-- - Simple completion tracking (completed vs not completed)
-- - First admin must be manually set in database
-- - Admins excluded from public leaderboard
--
-- ============================================
