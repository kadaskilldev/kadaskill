-- ============================================
-- Rank System Database Setup
-- Creates user ranks based on total XP
-- ============================================

-- Create ranks table
CREATE TABLE IF NOT EXISTS ranks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT NOT NULL, -- CSS class or icon name (e.g., 'fas fa-bolt')
    icon_color TEXT DEFAULT '#6b7280',
    min_xp INTEGER NOT NULL,
    max_xp INTEGER, -- NULL for highest rank
    rank_order INTEGER NOT NULL UNIQUE, -- 1 = lowest rank
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add rank_id to profiles table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'rank_id') THEN
        ALTER TABLE profiles ADD COLUMN rank_id UUID REFERENCES ranks(id);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE ranks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ranks
DROP POLICY IF EXISTS "Anyone can view active ranks" ON ranks;
CREATE POLICY "Anyone can view active ranks" ON ranks
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage ranks" ON ranks;
CREATE POLICY "Admins can manage ranks" ON ranks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Insert default ranks
INSERT INTO ranks (name, description, icon, icon_color, min_xp, max_xp, rank_order, is_active) VALUES
('Beginner', 'Just starting your learning journey', 'fas fa-seedling', '#10b981', 0, 99, 1, true),
('Novice', 'Learning the basics', 'fas fa-user', '#6b7280', 100, 499, 2, true),
('Common', 'Making steady progress', 'fas fa-star', '#3b82f6', 500, 999, 3, true),
('Uncommon', 'Standing out from the crowd', 'fas fa-bolt', '#f59e0b', 1000, 2499, 4, true),
('Rare', 'Exceptional learning dedication', 'fas fa-gem', '#8b5cf6', 2500, 4999, 5, true),
('Epic', 'Extraordinary knowledge seeker', 'fas fa-crown', '#ef4444', 5000, 9999, 6, true),
('Legendary', 'Master of learning', 'fas fa-trophy', '#fbbf24', 10000, 24999, 7, true),
('Mythic', 'Learning legend', 'fas fa-fire', '#f97316', 25000, 49999, 8, true),
('Divine', 'Ultimate knowledge master', 'fas fa-infinity', '#a855f7', 50000, NULL, 9, true)
ON CONFLICT (name) DO NOTHING;

-- Function to get user rank based on XP
CREATE OR REPLACE FUNCTION get_user_rank(user_xp INTEGER)
RETURNS TABLE(
    rank_id UUID,
    rank_name TEXT,
    rank_description TEXT,
    rank_icon TEXT,
    rank_icon_color TEXT,
    rank_min_xp INTEGER,
    rank_max_xp INTEGER,
    rank_order INTEGER
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.name,
        r.description,
        r.icon,
        r.icon_color,
        r.min_xp,
        r.max_xp,
        r.rank_order
    FROM ranks r
    WHERE r.is_active = true 
      AND r.min_xp <= user_xp 
      AND (r.max_xp IS NULL OR user_xp <= r.max_xp)
    ORDER BY r.rank_order DESC
    LIMIT 1;
END;
$$;

-- Function to automatically update user rank
CREATE OR REPLACE FUNCTION update_user_rank(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_total_xp INTEGER;
    new_rank_id UUID;
BEGIN
    -- Get user's current total XP
    SELECT COALESCE(total_xp, 0) INTO user_total_xp
    FROM profiles 
    WHERE id = user_id;
    
    -- Get the appropriate rank for this XP level
    SELECT rank_id INTO new_rank_id
    FROM get_user_rank(user_total_xp);
    
    -- Update user's rank if it changed
    UPDATE profiles 
    SET rank_id = new_rank_id,
        updated_at = NOW()
    WHERE id = user_id 
      AND (rank_id IS NULL OR rank_id != new_rank_id);
      
    -- Log rank update
    IF FOUND THEN
        RAISE NOTICE 'Updated rank for user % to rank %', user_id, new_rank_id;
    END IF;
END;
$$;

-- Trigger to auto-update rank when XP changes
CREATE OR REPLACE FUNCTION trigger_update_user_rank()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only update rank if total_xp actually changed
    IF OLD.total_xp IS DISTINCT FROM NEW.total_xp THEN
        PERFORM update_user_rank(NEW.id);
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS auto_update_user_rank ON profiles;
CREATE TRIGGER auto_update_user_rank
    AFTER UPDATE OF total_xp ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_user_rank();

-- Update all existing users' ranks based on their current XP
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT id FROM profiles WHERE total_xp > 0 LOOP
        PERFORM update_user_rank(user_record.id);
    END LOOP;
END $$;

-- Function to update all users' ranks (for admin use)
CREATE OR REPLACE FUNCTION update_all_user_ranks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record RECORD;
    updated_count INTEGER := 0;
BEGIN
    FOR user_record IN SELECT id FROM profiles WHERE total_xp >= 0 LOOP
        PERFORM update_user_rank(user_record.id);
        updated_count := updated_count + 1;
    END LOOP;
    
    RAISE NOTICE 'Updated ranks for % users', updated_count;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ranks_active ON ranks(is_active);
CREATE INDEX IF NOT EXISTS idx_ranks_order ON ranks(rank_order);
CREATE INDEX IF NOT EXISTS idx_ranks_xp_range ON ranks(min_xp, max_xp);
CREATE INDEX IF NOT EXISTS idx_profiles_rank_id ON profiles(rank_id);

-- Display setup completion
DO $$
BEGIN
    RAISE NOTICE 'Rank system setup complete! Created % ranks', 
        (SELECT COUNT(*) FROM ranks WHERE is_active = true);
END $$;