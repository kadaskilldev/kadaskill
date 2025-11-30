-- ============================================
-- Seed Data: Badges
-- ============================================
-- Populates badges for the gamification system

INSERT INTO badges (slug, name, description, category, tier, criteria_type, criteria_value, criteria_config, icon_url, color, rarity_score, is_active) VALUES

-- Achievement Badges - Early Progress
('first-steps', 'First Steps', 'Complete your first lesson', 'achievement', 'Bronze', 'lessons_completed', 1,
 '{"min_lessons": 1}'::jsonb,
 '/images/home/badges/Untitled design (19) 1.png', '#CD7F32', 10, true),

('getting-started', 'Getting Started', 'Complete your first course', 'achievement', 'Bronze', 'courses_completed', 1,
 '{"min_courses": 1}'::jsonb,
 '/images/home/badges/Untitled design (19) 2.png', '#CD7F32', 15, true),

('practice-makes-perfect', 'Practice Makes Perfect', 'Complete your first practice exercise', 'achievement', 'Bronze', 'exercises_completed', 1,
 '{"min_exercises": 1}'::jsonb,
 '/images/home/badges/Untitled design (19) 3.png', '#CD7F32', 12, true),

-- Achievement Badges - Intermediate Progress
('fast-learner', 'Fast Learner', 'Complete 10 lessons in one day', 'achievement', 'Silver', 'daily_lessons', 10,
 '{"min_daily_lessons": 10}'::jsonb,
 '/images/home/badges/Untitled design (19) 4.png', '#C0C0C0', 40, true),

('dedicated-student', 'Dedicated Student', 'Complete 5 courses', 'achievement', 'Silver', 'courses_completed', 5,
 '{"min_courses": 5}'::jsonb,
 '/images/home/badges/Untitled design (19) 5.png', '#C0C0C0', 35, true),

('practice-pro', 'Practice Pro', 'Complete 50 practice exercises', 'achievement', 'Silver', 'exercises_completed', 50,
 '{"min_exercises": 50}'::jsonb,
 '/images/home/badges/Untitled design (19) 6.png', '#C0C0C0', 45, true),

-- Achievement Badges - Advanced Progress
('course-crusher', 'Course Crusher', 'Complete 10 courses', 'achievement', 'Gold', 'courses_completed', 10,
 '{"min_courses": 10}'::jsonb,
 '/images/badges/course-crusher.png', '#FFD700', 50, true),

('lesson-master', 'Lesson Master', 'Complete 100 lessons', 'achievement', 'Gold', 'lessons_completed', 100,
 '{"min_lessons": 100}'::jsonb,
 '/images/badges/lesson-master.png', '#FFD700', 55, true),

('exercise-expert', 'Exercise Expert', 'Complete 100 practice exercises', 'achievement', 'Gold', 'exercises_completed', 100,
 '{"min_exercises": 100}'::jsonb,
 '/images/badges/exercise-expert.png', '#FFD700', 60, true),

-- Milestone Badges - XP
('xp-milestone-100', '100 XP', 'Earn your first 100 XP', 'milestone', 'Bronze', 'xp_threshold', 100,
 '{"min_xp": 100}'::jsonb,
 '/images/badges/xp-100.png', '#CD7F32', 10, true),

('xp-milestone-1000', '1K XP', 'Earn 1,000 total XP', 'milestone', 'Bronze', 'xp_threshold', 1000,
 '{"min_xp": 1000}'::jsonb,
 '/images/badges/xp-1k.png', '#CD7F32', 20, true),

('xp-milestone-5000', '5K XP', 'Earn 5,000 total XP', 'milestone', 'Silver', 'xp_threshold', 5000,
 '{"min_xp": 5000}'::jsonb,
 '/images/badges/xp-5k.png', '#C0C0C0', 30, true),

('xp-milestone-10000', '10K XP', 'Earn 10,000 total XP', 'milestone', 'Gold', 'xp_threshold', 10000,
 '{"min_xp": 10000}'::jsonb,
 '/images/badges/xp-10k.png', '#FFD700', 60, true),

('xp-milestone-50000', '50K XP', 'Earn 50,000 total XP', 'milestone', 'Platinum', 'xp_threshold', 50000,
 '{"min_xp": 50000}'::jsonb,
 '/images/badges/xp-50k.png', '#E5E4E2', 80, true),

('xp-milestone-100000', '100K XP', 'Earn 100,000 total XP', 'milestone', 'Diamond', 'xp_threshold', 100000,
 '{"min_xp": 100000}'::jsonb,
 '/images/badges/xp-100k.png', '#B9F2FF', 95, true),

-- Streak Badges
('day-one', 'Day One', 'Start your learning streak', 'achievement', 'Bronze', 'streak', 1,
 '{"min_streak": 1}'::jsonb,
 '/images/badges/day-one.png', '#CD7F32', 8, true),

('week-warrior', 'Week Warrior', 'Maintain a 7-day streak', 'achievement', 'Silver', 'streak', 7,
 '{"min_streak": 7}'::jsonb,
 '/images/badges/week-warrior.png', '#C0C0C0', 30, true),

('two-week-triumph', 'Two Week Triumph', 'Maintain a 14-day streak', 'achievement', 'Silver', 'streak', 14,
 '{"min_streak": 14}'::jsonb,
 '/images/badges/two-week.png', '#C0C0C0', 40, true),

('month-master', 'Month Master', 'Maintain a 30-day streak', 'achievement', 'Gold', 'streak', 30,
 '{"min_streak": 30}'::jsonb,
 '/images/badges/month-master.png', '#FFD700', 70, true),

('hundred-day-hero', '100 Day Hero', 'Maintain a 100-day streak', 'achievement', 'Platinum', 'streak', 100,
 '{"min_streak": 100}'::jsonb,
 '/images/badges/hundred-day.png', '#E5E4E2', 85, true),

('year-legend', 'Year Legend', 'Maintain a 365-day streak', 'achievement', 'Diamond', 'streak', 365,
 '{"min_streak": 365}'::jsonb,
 '/images/badges/year-legend.png', '#B9F2FF', 99, true),

-- Category-Specific Badges
('ai-pioneer', 'AI Pioneer', 'Complete 3 AI courses', 'achievement', 'Gold', 'custom', 3,
 '{"category": "AI", "min_courses": 3}'::jsonb,
 '/images/badges/ai-pioneer.png', '#FFD700', 50, true),

('cloud-architect', 'Cloud Architect', 'Complete 3 Cloud courses', 'achievement', 'Gold', 'custom', 3,
 '{"category": "Cloud", "min_courses": 3}'::jsonb,
 '/images/badges/cloud-architect.png', '#FFD700', 50, true),

('security-specialist', 'Security Specialist', 'Complete 3 Cybersecurity courses', 'achievement', 'Gold', 'custom', 3,
 '{"category": "Cybersecurity", "min_courses": 3}'::jsonb,
 '/images/badges/security-specialist.png', '#FFD700', 50, true),

-- Certification Badges
('certified-professional', 'Certified Professional', 'Earn your first certification', 'achievement', 'Gold', 'certifications_earned', 1,
 '{"min_certifications": 1}'::jsonb,
 '/images/badges/certified-pro.png', '#FFD700', 65, true),

('multi-certified', 'Multi-Certified', 'Earn 3 certifications', 'achievement', 'Platinum', 'certifications_earned', 3,
 '{"min_certifications": 3}'::jsonb,
 '/images/badges/multi-certified.png', '#E5E4E2', 85, true),

-- Speed Badges
('speed-runner', 'Speed Runner', 'Complete a course in under 2 weeks', 'special', 'Silver', 'custom', 14,
 '{"max_days_to_complete": 14}'::jsonb,
 '/images/badges/speed-runner.png', '#C0C0C0', 40, true),

('perfect-score', 'Perfect Score', 'Score 100% on a quiz', 'special', 'Gold', 'custom', 100,
 '{"min_quiz_score": 100}'::jsonb,
 '/images/badges/perfect-score.png', '#FFD700', 45, true),

-- Social Badges
('helpful-contributor', 'Helpful Contributor', 'Get 10 upvotes on comments (future feature)', 'special', 'Silver', 'custom', 10,
 '{"min_upvotes": 10}'::jsonb,
 '/images/badges/helpful.png', '#C0C0C0', 35, false),

-- Special/Seasonal Badges
('early-adopter', 'Early Adopter', 'Join KadaSkill in 2025', 'special', 'Platinum', 'custom', 0,
 '{"join_year": 2025}'::jsonb,
 '/images/badges/early-adopter.png', '#E5E4E2', 90, true),

('founder', 'Founder', 'One of the first 100 users', 'special', 'Diamond', 'custom', 0,
 '{"max_user_number": 100}'::jsonb,
 '/images/badges/founder.png', '#B9F2FF', 100, true);

-- Verify insertion
SELECT slug, name, tier, category, rarity_score FROM badges ORDER BY rarity_score DESC, tier;
