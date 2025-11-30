# KadaSkill Database Documentation

## Overview

This document provides comprehensive information about the KadaSkill database schema, setup instructions, and usage guidelines.

## Quick Start

### 1. Apply the Schema

Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/kbpbubsnadnhebgdggdy) → SQL Editor and run:

```sql
-- Execute the main schema file
-- Copy and paste the contents of database-schema.sql
```

### 2. Seed Initial Data

After schema is applied, seed the database with initial content:

```sql
-- 1. Seed courses
-- Copy and paste contents of seed-courses.sql

-- 2. Seed certifications
-- Copy and paste contents of seed-certifications.sql

-- 3. Seed badges
-- Copy and paste contents of seed-badges.sql

-- 4. Seed practice exercises
-- Copy and paste contents of seed-practice.sql
```

### 3. Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Create bucket named: `profile-pictures`
3. Make it **Public**
4. Apply storage policies (see MIGRATION_GUIDE.md)

### 4. Verify Installation

Run this query to verify all tables:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

Expected tables: 18 total (see list in MIGRATION_GUIDE.md)

## Database Schema Overview

### Core Entities

```
┌─────────────────────────────────────────────────────┐
│                  USER MANAGEMENT                     │
├─────────────────────────────────────────────────────┤
│ • profiles           - User profile and stats        │
│ • daily_activities   - Daily activity tracking       │
│ • notifications      - User notifications            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                 LEARNING CONTENT                     │
├─────────────────────────────────────────────────────┤
│ • courses            - Course catalog                │
│ • lessons            - Individual lessons            │
│ • quizzes            - Course assessments            │
│ • quiz_questions     - Quiz question bank            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  USER PROGRESS                       │
├─────────────────────────────────────────────────────┤
│ • enrollments        - Course enrollments            │
│ • lesson_progress    - Lesson completion tracking    │
│ • quiz_attempts      - Quiz submission history       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                 CERTIFICATIONS                       │
├─────────────────────────────────────────────────────┤
│ • certifications     - Certification catalog         │
│ • user_certifications- User cert progress            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  PRACTICE SYSTEM                     │
├─────────────────────────────────────────────────────┤
│ • practice_exercises - Exercise bank                 │
│ • practice_submissions- User submissions             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  GAMIFICATION                        │
├─────────────────────────────────────────────────────┤
│ • badges             - Badge definitions             │
│ • user_badges        - User earned badges            │
│ • xp_transactions    - XP history and logs           │
│ • leaderboard        - Global rankings (view)        │
└─────────────────────────────────────────────────────┘
```

## Key Features

### 1. Automatic Profile Creation

When a user signs up through Supabase Auth, a profile is automatically created via trigger:

```sql
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 2. Automatic XP Calculation

When XP transactions are inserted, user's total XP and level are automatically updated:

```sql
CREATE TRIGGER xp_transaction_update_user
    AFTER INSERT ON xp_transactions
    FOR EACH ROW EXECUTE FUNCTION update_user_xp();
```

Level formula: `level = floor(sqrt(total_xp / 100))`

### 3. Streak Tracking

Daily activities automatically update user streaks:

```sql
CREATE TRIGGER daily_activity_update_streak
    AFTER INSERT ON daily_activities
    FOR EACH ROW EXECUTE FUNCTION update_user_streak();
```

### 4. Leaderboard Performance

Uses materialized view for fast queries:

```sql
-- Refresh leaderboard (run periodically)
SELECT refresh_leaderboard();
```

### 5. Row Level Security (RLS)

All tables have RLS enabled with policies to ensure data privacy:

- Users can only see/edit their own data
- Public content (courses, badges) visible to all
- Proper authentication required for all operations

## Common Queries

### Get User Profile with Stats

```sql
SELECT
    p.*,
    COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'completed') as courses_completed,
    COUNT(DISTINCT ub.id) as badges_earned,
    ROW_NUMBER() OVER (ORDER BY p.total_xp DESC) as global_rank
FROM profiles p
LEFT JOIN enrollments e ON p.id = e.user_id
LEFT JOIN user_badges ub ON p.id = ub.user_id
WHERE p.id = auth.uid()
GROUP BY p.id;
```

### Get User's Active Courses

```sql
SELECT
    c.*,
    e.progress_percentage,
    e.last_accessed_at,
    e.current_lesson_id,
    l.title as current_lesson_title
FROM enrollments e
JOIN courses c ON e.course_id = c.id
LEFT JOIN lessons l ON e.current_lesson_id = l.id
WHERE e.user_id = auth.uid()
  AND e.status = 'active'
ORDER BY e.last_accessed_at DESC;
```

### Award XP to User

```sql
-- Insert XP transaction (automatic update via trigger)
INSERT INTO xp_transactions (user_id, amount, source_type, source_id, description)
VALUES (
    auth.uid(),
    25,
    'lesson_complete',
    'lesson-uuid-here',
    'Completed: Introduction to Python'
);
```

### Check Badge Eligibility

```sql
-- Example: Check if user earned "1K XP" badge
SELECT
    p.total_xp,
    b.criteria_value,
    p.total_xp >= b.criteria_value as earned
FROM profiles p, badges b
WHERE p.id = auth.uid()
  AND b.slug = 'xp-milestone-1000';
```

### Track Course Progress

```sql
-- Calculate overall course progress
SELECT
    e.course_id,
    c.title,
    COUNT(l.id) as total_lessons,
    COUNT(lp.id) FILTER (WHERE lp.status = 'completed') as completed_lessons,
    ROUND(
        (COUNT(lp.id) FILTER (WHERE lp.status = 'completed')::numeric / COUNT(l.id) * 100),
        2
    ) as progress_percentage
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN lessons l ON c.id = l.course_id
LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = e.user_id
WHERE e.user_id = auth.uid()
GROUP BY e.course_id, c.title;
```

### Get Leaderboard

```sql
-- Top 10 users
SELECT * FROM leaderboard LIMIT 10;

-- User's rank
SELECT * FROM leaderboard WHERE id = auth.uid();

-- Users around me
WITH my_rank AS (
    SELECT rank FROM leaderboard WHERE id = auth.uid()
)
SELECT * FROM leaderboard
WHERE rank BETWEEN (SELECT rank - 5 FROM my_rank) AND (SELECT rank + 5 FROM my_rank)
ORDER BY rank;
```

## Maintenance Tasks

### Daily Tasks

```sql
-- Refresh leaderboard
SELECT refresh_leaderboard();

-- Clean up old notifications (older than 30 days)
DELETE FROM notifications
WHERE created_at < NOW() - INTERVAL '30 days'
  AND is_read = true;
```

### Weekly Tasks

```sql
-- Analyze table statistics for query optimization
ANALYZE profiles;
ANALYZE enrollments;
ANALYZE lesson_progress;
ANALYZE xp_transactions;

-- Vacuum tables to reclaim space
VACUUM ANALYZE profiles;
VACUUM ANALYZE enrollments;
```

### Monthly Tasks

```sql
-- Backup important data
-- (Done automatically by Supabase, verify backups exist)

-- Review slow queries
-- Check Supabase Dashboard → Performance → Slow Queries

-- Update course enrollment counts
UPDATE courses c
SET enrolled_count = (
    SELECT COUNT(*) FROM enrollments WHERE course_id = c.id
),
completion_count = (
    SELECT COUNT(*) FROM enrollments WHERE course_id = c.id AND status = 'completed'
);
```

## Performance Optimization

### Indexes

All critical indexes are created automatically by the schema:

- User lookups: `idx_profiles_username`, `idx_profiles_total_xp`
- Course queries: `idx_courses_category`, `idx_courses_slug`
- Progress tracking: `idx_lesson_progress_user_id`
- Leaderboard: `idx_leaderboard_rank`

### Query Optimization Tips

1. **Always filter by user_id first** when querying user-specific data
2. **Use the leaderboard materialized view** instead of aggregating profiles
3. **Batch insert XP transactions** for better performance
4. **Limit result sets** - use LIMIT and pagination
5. **Use covering indexes** for frequently queried columns

### Monitoring

Check these in Supabase Dashboard:

1. **Database Size** - Monitor growth
2. **Connection Pool** - Watch for connection limits
3. **Slow Queries** - Optimize queries taking >100ms
4. **Index Usage** - Ensure indexes are being used

## Security Best Practices

### ✅ DO

- Use RLS policies (already enabled)
- Validate data at application layer
- Use prepared statements/parameterized queries
- Limit API key scope
- Enable MFA for admin accounts
- Regular security audits
- Monitor auth logs

### ❌ DON'T

- Disable RLS policies
- Store sensitive data in plain text
- Use service role key in frontend
- Grant unnecessary permissions
- Ignore security updates
- Share credentials

## Troubleshooting

### Issue: Cannot insert into table

**Cause:** RLS policy blocking request

**Solution:**
```sql
-- Check if user is authenticated
SELECT auth.uid(); -- Should return user ID

-- Review policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Test policy
SET ROLE authenticated;
SELECT * FROM your_table; -- Should work for own data
```

### Issue: Trigger not firing

**Cause:** Function error or missing permissions

**Solution:**
```sql
-- Check trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'your_trigger';

-- Test function manually
SELECT your_function_name();

-- Check error logs
SELECT * FROM postgres_log ORDER BY event_time DESC LIMIT 10;
```

### Issue: Slow queries

**Cause:** Missing indexes or large dataset

**Solution:**
```sql
-- Analyze query
EXPLAIN ANALYZE
SELECT * FROM your_query;

-- Add index if needed
CREATE INDEX idx_custom ON table_name(column_name);

-- Update statistics
ANALYZE table_name;
```

## Data Migration

### From Hardcoded Data to Database

Your frontend currently uses hardcoded data. Here's how to migrate:

1. **Courses** - Already seeded via `seed-courses.sql`
2. **Certifications** - Already seeded via `seed-certifications.sql`
3. **Practice Exercises** - Already seeded via `seed-practice.sql`
4. **Badges** - Already seeded via `seed-badges.sql`

### Update Frontend Queries

Example migration:

**Before (Hardcoded):**
```javascript
const courses = [
  { id: 1, title: 'Python Basics', ... },
  // ... more hardcoded courses
];
```

**After (Database):**
```javascript
const { data: courses, error } = await supabase
  .from('courses')
  .select('*')
  .eq('is_published', true)
  .order('created_at', { ascending: false });
```

## Backup and Recovery

### Automatic Backups

Supabase provides automatic daily backups (retention depends on plan).

### Manual Backup

```bash
# Export specific table
pg_dump -h db.kbpbubsnadnhebgdggdy.supabase.co \
  -U postgres -t profiles > profiles_backup.sql

# Export entire database
pg_dump -h db.kbpbubsnadnhebgdggdy.supabase.co \
  -U postgres kadaskill > full_backup.sql
```

### Restore

```bash
psql -h db.kbpbubsnadnhebgdggdy.supabase.co \
  -U postgres kadaskill < backup.sql
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## Support

For issues or questions:
1. Check Supabase Dashboard logs
2. Review RLS policies
3. Test queries in SQL Editor
4. Consult documentation

---

**Last Updated:** 2025-11-17
**Schema Version:** 1.0.0
**Database:** PostgreSQL 15 (Supabase)
