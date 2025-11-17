-- ============================================
-- DATABASE VERIFICATION TESTS
-- Run these queries to verify your setup
-- ============================================

-- ============================================
-- TEST 1: Verify All Tables Exist
-- ============================================

SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Expected: 16 tables
-- badges, certifications, courses, daily_activities, enrollments,
-- lesson_progress, lessons, notifications, practice_attempts,
-- practice_exercises, profiles, quiz_attempts, quizzes,
-- user_badges, user_certifications, xp_transactions

-- ============================================
-- TEST 2: Verify Materialized View
-- ============================================

SELECT
    schemaname,
    matviewname,
    hasindexes
FROM pg_matviews
WHERE schemaname = 'public';

-- Expected: leaderboard view with hasindexes = true

-- ============================================
-- TEST 3: Verify Triggers Exist
-- ============================================

SELECT
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Expected triggers:
-- - on_auth_user_created (on auth.users)
-- - xp_transaction_update_user (on xp_transactions)
-- - daily_activity_update_streak (on daily_activities)
-- - lesson_progress_update_enrollment (on lesson_progress)
-- - update_*_updated_at (on multiple tables)

-- ============================================
-- TEST 4: Verify RLS is Enabled
-- ============================================

SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Expected: All tables should have rowsecurity = true

-- ============================================
-- TEST 5: Check RLS Policies
-- ============================================

SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Expected: Multiple policies per table for SELECT, INSERT, UPDATE, DELETE

-- ============================================
-- TEST 6: Verify Functions Exist
-- ============================================

SELECT
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- Expected functions:
-- - handle_new_user
-- - refresh_leaderboard
-- - update_enrollment_progress
-- - update_updated_at_column
-- - update_user_streak
-- - update_user_xp

-- ============================================
-- TEST 7: Count Existing Data
-- ============================================

SELECT 'profiles' as table_name, COUNT(*) as row_count FROM profiles
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'lessons', COUNT(*) FROM lessons
UNION ALL
SELECT 'quizzes', COUNT(*) FROM quizzes
UNION ALL
SELECT 'certifications', COUNT(*) FROM certifications
UNION ALL
SELECT 'practice_exercises', COUNT(*) FROM practice_exercises
UNION ALL
SELECT 'badges', COUNT(*) FROM badges
UNION ALL
SELECT 'enrollments', COUNT(*) FROM enrollments
UNION ALL
SELECT 'xp_transactions', COUNT(*) FROM xp_transactions;

-- Expected: All 0 if fresh database, or actual counts if data exists

-- ============================================
-- TEST 8: Test Profile Auto-Creation
-- (This will be tested when you sign up)
-- ============================================

-- After signing up a user, run this to check if profile was auto-created:
-- SELECT id, email, username, role, total_xp, level FROM profiles LIMIT 5;

-- ============================================
-- TEST 9: Test XP System
-- (Run after creating a profile)
-- ============================================

-- Insert test XP transaction (replace 'YOUR_USER_ID' with actual user ID):
/*
INSERT INTO xp_transactions (user_id, amount, source_type, description)
VALUES ('YOUR_USER_ID', 50, 'manual', 'Test XP');

-- Check if profile was updated:
SELECT id, username, total_xp, level FROM profiles WHERE id = 'YOUR_USER_ID';

-- Expected: total_xp = 50, level should be calculated automatically
*/

-- ============================================
-- TEST 10: Verify Indexes
-- ============================================

SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Expected: Multiple indexes for performance optimization

-- ============================================
-- SUMMARY QUERY - Run this for quick overview
-- ============================================

SELECT
    'Tables' as type,
    COUNT(*)::text as count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'

UNION ALL

SELECT
    'Views',
    COUNT(*)::text
FROM pg_matviews
WHERE schemaname = 'public'

UNION ALL

SELECT
    'Functions',
    COUNT(*)::text
FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'

UNION ALL

SELECT
    'Triggers',
    COUNT(DISTINCT trigger_name)::text
FROM information_schema.triggers
WHERE trigger_schema = 'public'

UNION ALL

SELECT
    'RLS Policies',
    COUNT(*)::text
FROM pg_policies
WHERE schemaname = 'public';

-- Expected:
-- Tables: 16
-- Views: 1 (leaderboard)
-- Functions: ~6
-- Triggers: ~10+
-- RLS Policies: ~40+
