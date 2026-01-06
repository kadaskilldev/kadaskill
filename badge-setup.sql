-- ============================================
-- Badge System Database Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create badges table (if not exists)
CREATE TABLE IF NOT EXISTS badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT,
    color TEXT NOT NULL DEFAULT '#3b82f6',
    xp_reward INTEGER DEFAULT 0,
    rarity TEXT DEFAULT 'common',
    criteria JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create user_badges table (if not exists)
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- 3. Create badge-icons storage bucket
-- Note: Do this in Supabase Dashboard → Storage → Create Bucket
-- Bucket name: badge-icons
-- Public: Yes

-- 4. Enable RLS
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for badges
DROP POLICY IF EXISTS "Anyone can view active badges" ON badges;
CREATE POLICY "Anyone can view active badges" ON badges
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage badges" ON badges;
CREATE POLICY "Admins can manage badges" ON badges
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 6. RLS Policies for user_badges
DROP POLICY IF EXISTS "Users can view their own badges" ON user_badges;
CREATE POLICY "Users can view their own badges" ON user_badges
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "System can award badges" ON user_badges;
CREATE POLICY "System can award badges" ON user_badges
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all user badges" ON user_badges;
CREATE POLICY "Admins can view all user badges" ON user_badges
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 7. Create function to increment user XP
CREATE OR REPLACE FUNCTION increment_user_xp(
    user_id UUID,
    xp_amount INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE profiles
    SET total_xp = COALESCE(total_xp, 0) + xp_amount,
        updated_at = NOW()
    WHERE id = user_id;
END;
$$;

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_badges_active ON badges(is_active);

-- 9. Insert some starter badges (optional)
INSERT INTO badges (name, description, icon_url, color, xp_reward, rarity, criteria, is_active)
VALUES
    (
        'First Steps',
        'Enrolled in your first course',
        NULL,
        '#10b981',
        50,
        'common',
        '{"type": "first_enrollment"}'::jsonb,
        true
    ),
    (
        'Course Conqueror',
        'Completed your first course',
        NULL,
        '#3b82f6',
        100,
        'common',
        '{"type": "course_complete"}'::jsonb,
        true
    ),
    (
        'Learning Enthusiast',
        'Completed 5 courses',
        NULL,
        '#8b5cf6',
        250,
        'rare',
        '{"type": "courses_count", "count": 5}'::jsonb,
        true
    ),
    (
        'Knowledge Seeker',
        'Reached 500 total XP',
        NULL,
        '#f59e0b',
        100,
        'rare',
        '{"type": "xp_threshold", "xp_amount": 500}'::jsonb,
        true
    ),
    (
        'AI Master',
        'Completed all AI courses',
        NULL,
        '#8b5cf6',
        500,
        'epic',
        '{"type": "category_master", "category": "AI"}'::jsonb,
        true
    )
ON CONFLICT DO NOTHING;

-- Done!
-- ✅ Badge system database setup complete!
