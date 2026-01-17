-- ============================================
-- Badge Icons Storage Bucket Setup
-- IMPORTANT: Follow these steps in order!
-- ============================================

-- STEP 1: Create the bucket in Supabase Dashboard FIRST:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "Create bucket" 
-- 3. Name: badge-icons
-- 4. Public: YES (THIS IS CRITICAL - must be checked!)
-- 5. File size limit: 5MB
-- 6. Allowed MIME types: image/*

-- STEP 2: Run this SQL to set up storage policies
-- First, enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "badge-icons-upload" ON storage.objects;
DROP POLICY IF EXISTS "badge-icons-read" ON storage.objects;
DROP POLICY IF EXISTS "badge-icons-delete" ON storage.objects;

-- Allow authenticated users to upload badge icons
CREATE POLICY "badge-icons-upload" ON storage.objects
    FOR INSERT 
    WITH CHECK (
        bucket_id = 'badge-icons' 
        AND auth.role() = 'authenticated'
    );

-- Allow ANYONE to read/view badge icons (CRITICAL for public display)
CREATE POLICY "badge-icons-read" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'badge-icons');

-- Allow badge owners and admins to delete
CREATE POLICY "badge-icons-delete" ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'badge-icons'
        AND (
            auth.uid() = owner
            OR EXISTS (
                SELECT 1 FROM profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.role = 'admin'
            )
        )
    );

-- STEP 3: Test the setup
-- After running this, test by uploading a badge icon and checking if this URL works:
-- https://[your-project].supabase.co/storage/v1/object/public/badge-icons/[filename]

-- STEP 4: If images still don't render, check:
-- 1. Browser console for CORS errors
-- 2. Network tab to see if image requests are failing
-- 3. Ensure the bucket is marked as "public" in the Supabase dashboard
-- 4. Verify the storage URL format matches your Supabase project

-- Common URL format that should work:
-- https://kbpbubsnadnhebgdggdy.supabase.co/storage/v1/object/public/badge-icons/badge-icon-1738042123456.png