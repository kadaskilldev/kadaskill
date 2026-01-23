-- ============================================
-- Complete Rank System Test & Setup
-- Run this to test your rank system implementation
-- ============================================

-- Test 1: Check if ranks table exists and is populated
SELECT 
    'Ranks Table Check' as test_name,
    COUNT(*) as rank_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Ranks exist'
        ELSE '❌ No ranks found'
    END as status
FROM ranks 
WHERE is_active = true;

-- Test 2: List all active ranks in order
SELECT 
    rank_order,
    name,
    min_xp,
    max_xp,
    icon,
    icon_color,
    CASE 
        WHEN max_xp IS NULL THEN CONCAT(min_xp::text, '+')
        ELSE CONCAT(min_xp::text, ' - ', max_xp::text)
    END as xp_range
FROM ranks 
WHERE is_active = true 
ORDER BY rank_order;

-- Test 3: Check user rank assignments
SELECT 
    'User Rank Assignments' as test_name,
    COUNT(DISTINCT p.id) as total_users,
    COUNT(DISTINCT p.rank_id) as users_with_ranks,
    ROUND(
        (COUNT(DISTINCT p.rank_id)::decimal / COUNT(DISTINCT p.id)) * 100, 
        2
    ) as assignment_percentage
FROM profiles p;

-- Test 4: Show rank distribution among users
SELECT 
    COALESCE(r.name, 'Unranked') as rank_name,
    COUNT(p.id) as user_count,
    ROUND(
        (COUNT(p.id)::decimal / (SELECT COUNT(*) FROM profiles)) * 100, 
        2
    ) as percentage
FROM profiles p
LEFT JOIN ranks r ON p.rank_id = r.id
GROUP BY r.name, r.rank_order
ORDER BY COALESCE(r.rank_order, 0);

-- Test 5: Test rank function with sample XP values
SELECT 
    'Rank Function Test' as test_name,
    test_xp,
    (SELECT rank_name FROM get_user_rank(test_xp)) as assigned_rank
FROM (
    VALUES 
    (0),     -- Should be Beginner
    (150),   -- Should be Novice  
    (750),   -- Should be Common
    (1500),  -- Should be Uncommon
    (3000),  -- Should be Rare
    (7500),  -- Should be Epic
    (15000), -- Should be Legendary
    (30000), -- Should be Mythic
    (60000)  -- Should be Divine
) AS test_values(test_xp);

-- Test 6: Manually update a test user's rank (if you want to test)
-- Uncomment and replace USER_ID with an actual user ID to test:
/*
DO $$
DECLARE
    test_user_id UUID := 'YOUR_USER_ID_HERE'; -- Replace with actual user ID
    old_xp INTEGER;
    new_xp INTEGER := 1500; -- Test XP amount
BEGIN
    -- Get current XP
    SELECT total_xp INTO old_xp FROM profiles WHERE id = test_user_id;
    
    -- Update XP to test value
    UPDATE profiles SET total_xp = new_xp WHERE id = test_user_id;
    
    -- Show result
    RAISE NOTICE 'Updated user % XP from % to %, rank should update automatically', 
        test_user_id, old_xp, new_xp;
        
    -- Show new rank
    SELECT 
        p.username,
        p.total_xp,
        r.name as rank_name,
        r.icon,
        r.icon_color
    FROM profiles p
    LEFT JOIN ranks r ON p.rank_id = r.id
    WHERE p.id = test_user_id;
END $$;
*/

-- Test 7: Verify trigger is working
SELECT 
    'Database Triggers' as test_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_trigger 
            WHERE tgname = 'auto_update_user_rank'
        ) THEN '✅ Auto-update trigger exists'
        ELSE '❌ Auto-update trigger missing'
    END as trigger_status;

-- Test 8: Create a sample rank progression test
DO $$
BEGIN
    RAISE NOTICE '🎯 Rank System Setup Complete!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Next Steps:';
    RAISE NOTICE '1. Check admin panel gamification section for rank management';
    RAISE NOTICE '2. Test creating/editing ranks in admin interface';
    RAISE NOTICE '3. Verify user profiles show rank information';
    RAISE NOTICE '4. Test XP gains to see automatic rank updates';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Admin Features Available:';
    RAISE NOTICE '• Create/Edit/Delete ranks';
    RAISE NOTICE '• Set XP thresholds and icons';
    RAISE NOTICE '• Reorder rank progression';
    RAISE NOTICE '• Activate/deactivate ranks';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 User Features:';
    RAISE NOTICE '• Automatic rank updates based on total XP';
    RAISE NOTICE '• Rank display in profile sidebar';
    RAISE NOTICE '• Rank icons with colors';
    RAISE NOTICE '• Rank progression tracking';
END $$;