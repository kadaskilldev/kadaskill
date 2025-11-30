-- ============================================
-- DROP EXISTING TABLES - RUN THIS FIRST
-- ============================================
-- WARNING: This will delete ALL data in these tables!
-- Only run this if you're sure you want to start fresh.

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS public.xp_transactions CASCADE;
DROP TABLE IF EXISTS public.user_course_progress CASCADE;
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.quiz_attempts CASCADE;
DROP TABLE IF EXISTS public.quizzes CASCADE;
DROP TABLE IF EXISTS public.course_materials CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.learning_streaks CASCADE;
DROP TABLE IF EXISTS public.course_categories CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Note: Don't drop auth.users - that's managed by Supabase Auth

-- Success message
SELECT 'All old tables dropped successfully. Now run database-schema.sql' as status;
