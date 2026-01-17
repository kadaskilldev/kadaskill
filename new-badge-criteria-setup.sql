-- ============================================
-- New Badge Criteria - Based on Your List
-- Run this to create the specific badges you requested
-- ============================================

-- Insert the new badge types you specified
INSERT INTO badges (name, description, icon_url, color, xp_reward, rarity, criteria, is_active, created_at, updated_at) VALUES

-- Practice Exercise Badges
(
    'Practice Champion',
    'Complete 50 practice exercises',
    NULL,
    '#f59e0b',
    150,
    'rare',
    '{"type": "practice_exercises_count", "exercises_count": 50}'::jsonb,
    true,
    NOW(),
    NOW()
),
(
    'Practice Master',
    'Complete 100 practice exercises',
    NULL,
    '#8b5cf6',
    300,
    'epic',
    '{"type": "practice_exercises_count", "exercises_count": 100}'::jsonb,
    true,
    NOW(),
    NOW()
),

-- Lesson Count Badge  
(
    'Knowledge Seeker',
    'Complete 100 lessons',
    NULL,
    '#3b82f6',
    250,
    'rare',
    '{"type": "lessons_count", "lessons_count": 100}'::jsonb,
    true,
    NOW(),
    NOW()
),

-- Learning Streak Badge
(
    'Streak Starter',
    'Start your learning streak',
    NULL,
    '#10b981',
    25,
    'common',
    '{"type": "streak_days", "days": 1}'::jsonb,
    true,
    NOW(),
    NOW()
),

-- Course Speed Badge
(
    'Speed Learner', 
    'Complete a course in under 2 weeks',
    NULL,
    '#f59e0b',
    100,
    'rare',
    '{"type": "course_speed", "speed_days": 14}'::jsonb,
    true,
    NOW(),
    NOW()
),

-- Early User Badge
(
    'Pioneer',
    'One of the first 100 users',
    NULL,
    '#fbbf24',
    500,
    'legendary',
    '{"type": "early_user", "user_number": 100}'::jsonb,
    true,
    NOW(),
    NOW()
),

-- Future Community Badge (placeholder)
(
    'Community Star',
    'Get 10 upvotes on comments (future feature)',
    NULL,
    '#8b5cf6',
    150,
    'rare',
    '{"type": "community_engagement", "upvotes": 10}'::jsonb,
    false, -- Set as inactive since feature doesn't exist yet
    NOW(),
    NOW()
);

-- Add some additional useful badges
INSERT INTO badges (name, description, icon_url, color, xp_reward, rarity, criteria, is_active, created_at, updated_at) VALUES

-- More practice milestones
(
    'Practice Beginner',
    'Complete your first 10 practice exercises',
    NULL,
    '#6b7280',
    50,
    'common',
    '{"type": "practice_exercises_count", "exercises_count": 10}'::jsonb,
    true,
    NOW(),
    NOW()
),
(
    'Practice Enthusiast', 
    'Complete 25 practice exercises',
    NULL,
    '#3b82f6',
    75,
    'common',
    '{"type": "practice_exercises_count", "exercises_count": 25}'::jsonb,
    true,
    NOW(),
    NOW()
),

-- Lesson milestones
(
    'Lesson Explorer',
    'Complete 25 lessons',
    NULL,
    '#10b981',
    75,
    'common',
    '{"type": "lessons_count", "lessons_count": 25}'::jsonb,
    true,
    NOW(),
    NOW()
),
(
    'Lesson Collector',
    'Complete 50 lessons', 
    NULL,
    '#f59e0b',
    125,
    'rare',
    '{"type": "lessons_count", "lessons_count": 50}'::jsonb,
    true,
    NOW(),
    NOW()
),

-- Speed learning variations
(
    'Quick Learner',
    'Complete a course in under 1 week',
    NULL,
    '#ef4444',
    200,
    'epic',
    '{"type": "course_speed", "speed_days": 7}'::jsonb,
    true,
    NOW(),
    NOW()
),

-- Early user variations
(
    'Founding Member',
    'One of the first 50 users',
    NULL,
    '#fbbf24',
    750,
    'legendary',
    '{"type": "early_user", "user_number": 50}'::jsonb,
    true,
    NOW(),
    NOW()
),
(
    'Beta Tester',
    'One of the first 10 users',
    NULL,
    '#f59e0b',
    1000,
    'legendary',
    '{"type": "early_user", "user_number": 10}'::jsonb,
    true,
    NOW(),
    NOW()
);

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'Successfully created % new badges with your requested criteria!', 
        (SELECT COUNT(*) FROM badges WHERE created_at >= NOW() - INTERVAL '1 minute');
END $$;