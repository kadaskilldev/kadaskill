-- ============================================
-- Fix Rank Auto-Assignment for New Users
-- ============================================

-- Update all existing users without a rank to have appropriate rank based on XP
DO $$
DECLARE
    user_record RECORD;
    updated_count INTEGER := 0;
BEGIN
    FOR user_record IN
        SELECT id, COALESCE(total_xp, 0) as xp
        FROM profiles
        WHERE rank_id IS NULL
    LOOP
        PERFORM update_user_rank(user_record.id);
        updated_count := updated_count + 1;
    END LOOP;

    RAISE NOTICE 'Assigned ranks to % users', updated_count;
END $$;

-- Create trigger to auto-assign rank on new profile creation
CREATE OR REPLACE FUNCTION trigger_assign_initial_rank()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    -- Assign rank immediately when profile is created
    PERFORM update_user_rank(NEW.id);
    RETURN NEW;
END;
$$;

-- Create trigger on INSERT for profiles
DROP TRIGGER IF EXISTS auto_assign_initial_rank ON profiles;
CREATE TRIGGER auto_assign_initial_rank
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_assign_initial_rank();

-- Verify ranks are assigned
DO $$
DECLARE
    unranked_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO unranked_count
    FROM profiles
    WHERE rank_id IS NULL;

    IF unranked_count > 0 THEN
        RAISE WARNING 'Still have % users without ranks', unranked_count;
    ELSE
        RAISE NOTICE 'All users now have ranks assigned!';
    END IF;
END $$;
