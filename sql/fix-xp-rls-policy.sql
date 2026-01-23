-- Fix XP System: Add RLS Policy to Allow Users to Award Themselves XP
-- Run this SQL in your Supabase SQL Editor

-- Add policy to allow users to insert their own XP transactions
-- This allows automatic XP awards from lessons, quizzes, and practice exercises
CREATE POLICY "Users can earn automatic XP" ON xp_transactions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id 
        AND awarded_by IS NULL 
        AND source_type IN ('lesson_complete', 'quiz_pass', 'practice_complete', 'bonus')
    );

-- Verify the policy was created
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'xp_transactions';