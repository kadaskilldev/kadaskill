# KadaSkill API Documentation v1.1.0

**Document Version:** 1.1.0  
**Last Updated:** January 6, 2026  
**System Version:** 1.1.0 (Enhanced Performance & Security Release)

## Overview

KadaSkill uses **Supabase** as its Backend-as-a-Service (BaaS) platform, providing authentication, database, and storage capabilities. This document describes all API interactions, patterns, and usage examples throughout the application, including new performance optimizations and security enhancements implemented in version 1.1.0.

**Supabase Instance**: `https://kbpbubsnadnhebgdggdy.supabase.co`

## 🚀 Version 1.1.0 API Enhancements

### Performance Improvements
- **Singleton Client Pattern**: Optimized Supabase client initialization for better performance
- **Database Query Optimization**: Enhanced indexing and query performance patterns  
- **Atomic Transactions**: Improved quiz submission handling with race condition prevention
- **Caching Strategies**: Implemented efficient data caching for frequently accessed resources

### Security Enhancements
- **Environment-based Configuration**: API keys managed through secure environment variables
- **Enhanced Session Management**: Improved authentication security with timeout mechanisms
- **Input Validation**: Comprehensive data sanitization across all API endpoints

### Error Handling Improvements
- **Standardized Error Responses**: Consistent error messaging across all API interactions
- **Enhanced Error Logging**: Improved debugging and monitoring capabilities
- **Graceful Fallback Mechanisms**: Better handling of network failures and API timeouts

---

## Table of Contents

1. [Authentication API](#authentication-api)
2. [Database API](#database-api)
3. [Storage API](#storage-api)
4. [Error Handling](#error-handling)
5. [Best Practices](#best-practices)
6. [Common Patterns](#common-patterns)

---

## Authentication API

### Initialize Supabase Client

**File**: `public/js/script.js:1-22`

```javascript
const SUPABASE_URL = 'https://kbpbubsnadnhebgdggdy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGci...'; // Anon/public key

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

**Note**: The Supabase client is initialized globally in `script.js` and available throughout the application.

---

### Sign Up (Email/Password)

**Endpoint**: `supabase.auth.signUp()`
**Used in**: `public/js/script.js:505-520`

```javascript
const { data, error } = await supabase.auth.signUp({
    email: 'user@example.com',
    password: 'securePassword123',
    options: {
        data: {
            full_name: 'John Doe',
            username: 'johndoe'
        }
    }
});
```

**Parameters**:
- `email` (string, required): User's email address
- `password` (string, required): Password (min 6 characters recommended)
- `options.data` (object, optional): Additional user metadata

**Response**:
```javascript
{
    data: {
        user: {
            id: 'uuid',
            email: 'user@example.com',
            user_metadata: {
                full_name: 'John Doe',
                username: 'johndoe'
            }
        },
        session: {
            access_token: 'jwt_token',
            refresh_token: 'refresh_token'
        }
    },
    error: null
}
```

**Triggers**:
- Automatically creates a profile in the `profiles` table via database trigger
- Sends confirmation email (if enabled in Supabase settings)

---

### Sign In (Email/Password)

**Endpoint**: `supabase.auth.signInWithPassword()`
**Used in**: `public/js/script.js:499-502`

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
    email: 'user@example.com',
    password: 'securePassword123'
});
```

**Parameters**:
- `email` (string, required): User's email address
- `password` (string, required): User's password

**Response**:
```javascript
{
    data: {
        user: { id: 'uuid', email: 'user@example.com', ... },
        session: { access_token: 'jwt', refresh_token: 'token', ... }
    },
    error: null
}
```

**Error Responses**:
- `Invalid login credentials` - Wrong email or password
- `Email not confirmed` - User hasn't verified email

---

### Sign In (OAuth)

**Endpoint**: `supabase.auth.signInWithOAuth()`
**Used in**: `public/js/script.js:606-612`

**Supported Providers**: Google, Microsoft, Facebook, LinkedIn

```javascript
const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',  // or 'microsoft', 'facebook', 'linkedin'
    options: {
        redirectTo: 'https://yourdomain.com/home.html',
        scopes: 'email profile'
    }
});
```

**Parameters**:
- `provider` (string, required): OAuth provider name
- `options.redirectTo` (string): Redirect URL after authentication
- `options.scopes` (string): OAuth scopes to request

**Flow**:
1. User clicks OAuth button
2. Redirects to provider's auth page
3. User authorizes app
4. Provider redirects back with tokens
5. Supabase creates/updates user profile

---

### Get Current User

**Endpoint**: `supabase.auth.getUser()`
**Used in**: Multiple files (home.js:30, profile.js:29, learn.js:28, etc.)

```javascript
const { data: { user }, error } = await supabase.auth.getUser();
```

**Response**:
```javascript
{
    data: {
        user: {
            id: 'uuid',
            email: 'user@example.com',
            user_metadata: { full_name: 'John Doe', username: 'johndoe' },
            created_at: '2025-01-01T00:00:00Z'
        }
    },
    error: null
}
```

**Returns**:
- `user` object if authenticated
- `null` if no active session

**Common Pattern**:
```javascript
const { data: { user }, error: userError } = await supabase.auth.getUser();

if (userError || !user) {
    console.log('No user logged in, redirecting to login');
    window.location.href = 'index.html';
    return;
}

// User is authenticated, proceed with operations
```

---

### Sign Out

**Endpoint**: `supabase.auth.signOut()`
**Used in**: `public/js/script.js:209`, `public/js/admin.js:3492`

```javascript
await supabase.auth.signOut();

// Clear local storage
sessionStorage.removeItem('userProfile');
sessionStorage.removeItem('authUser');

// Redirect to login page
window.location.href = 'index.html';
```

**Response**:
```javascript
{ error: null }
```

**Side Effects**:
- Invalidates current session
- Clears auth tokens
- Application should clear cached user data

---

## Database API

### Query Patterns

#### 1. Get User Profile

**Table**: `profiles`
**Used in**: `public/js/home.js:40-44`, `public/js/profile.js:39-43`

```javascript
const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
```

**Response**:
```javascript
{
    data: {
        id: 'uuid',
        username: 'johndoe',
        full_name: 'John Doe',
        avatar_url: 'https://...',
        bio: 'Software developer',
        total_xp: 5000,
        current_streak: 15,
        longest_streak: 30,
        last_activity_date: '2025-12-18',
        skills: ['Python', 'JavaScript', 'Cloud'],
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-12-18T00:00:00Z'
    },
    error: null
}
```

---

#### 2. Get All Courses

**Table**: `courses`
**Used in**: `public/js/learn.js`

```javascript
const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });
```

**Response**:
```javascript
{
    data: [
        {
            id: 'uuid',
            slug: 'python-fundamentals',
            title: 'Python Fundamentals',
            description: 'Learn Python from scratch',
            short_description: 'Python basics',
            category: 'AI',  // 'AI', 'Cybersecurity', or 'Cloud'
            level: 'Beginner',
            thumbnail_url: 'https://...',
            duration_hours: 20,
            xp_reward: 500,
            enrolled_count: 1250,
            completion_count: 850,
            is_published: true,
            created_at: '2025-01-01T00:00:00Z'
        },
        // ... more courses
    ],
    error: null
}
```

**Filters**:
```javascript
// Filter by category
.eq('category', 'AI')

// Filter by level
.eq('level', 'Beginner')

// Search by title
.ilike('title', '%python%')
```

---

#### 3. Get User Enrollments with Course Details

**Tables**: `enrollments`, `courses` (joined)
**Used in**: `public/js/home.js:119-135`

```javascript
const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select(`
        id,
        progress_percentage,
        last_accessed_at,
        status,
        courses (
            id,
            title,
            slug,
            thumbnail_url,
            category
        )
    `)
    .eq('user_id', currentUser.id)
    .eq('status', 'active')
    .order('last_accessed_at', { ascending: false })
    .limit(2);
```

**Response**:
```javascript
{
    data: [
        {
            id: 'uuid',
            progress_percentage: 65,
            last_accessed_at: '2025-12-18T10:30:00Z',
            status: 'active',
            courses: {
                id: 'course-uuid',
                title: 'Python Fundamentals',
                slug: 'python-fundamentals',
                thumbnail_url: 'https://...',
                category: 'AI'
            }
        }
    ],
    error: null
}
```

---

#### 4. Enroll in Course

**Table**: `enrollments`
**Used in**: `public/js/learn.js:215-246`

```javascript
const { data: enrollment, error } = await supabase
    .from('enrollments')
    .insert({
        user_id: user.id,
        course_id: courseId,
        status: 'active',
        progress_percentage: 0,
        enrolled_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString()
    })
    .select()
    .single();
```

**Validation**:
```javascript
// Check if already enrolled
const { data: existing } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single();

if (existing) {
    console.log('Already enrolled in this course');
    return;
}
```

---

#### 5. Get Practice Exercises

**Table**: `practice_exercises`
**Used in**: `public/js/practice.js`

```javascript
const { data: exercises, error } = await supabase
    .from('practice_exercises')
    .select('*')
    .eq('is_active', true)
    .order('difficulty', { ascending: true });
```

**Response**:
```javascript
{
    data: [
        {
            id: 'uuid',
            slug: 'python-loops-basics',
            title: 'Python Loops Practice',
            description: 'Master for and while loops',
            category: 'AI',
            difficulty: 'Easy',  // 'Easy', 'Medium', 'Hard'
            skill_tags: ['Python', 'Loops', 'Fundamentals'],
            xp_reward: 50,
            time_estimate_minutes: 15,
            question_text: 'Write a loop that prints 1 to 10',
            starter_code: 'for i in range(??):',
            test_cases: [...],
            is_active: true
        }
    ],
    error: null
}
```

---

#### 6. Submit Practice Exercise

**Table**: `practice_submissions`
**Used in**: Practice submission flow

```javascript
const { data: submission, error } = await supabase
    .from('practice_submissions')
    .insert({
        user_id: user.id,
        exercise_id: exerciseId,
        submitted_code: userCode,
        status: 'passed',  // or 'failed'
        tests_passed: 8,
        tests_total: 10,
        submitted_at: new Date().toISOString()
    })
    .select()
    .single();
```

---

#### 7. Get Certifications

**Table**: `certifications`
**Used in**: `public/js/certification.js`

```javascript
const { data: certifications, error } = await supabase
    .from('certifications')
    .select('*')
    .eq('is_active', true)
    .order('title', { ascending: true });
```

**Response**:
```javascript
{
    data: [
        {
            id: 'uuid',
            slug: 'aws-cloud-practitioner',
            title: 'AWS Certified Cloud Practitioner',
            subtitle: 'Foundation level AWS certification',
            description: 'Validate cloud knowledge',
            category: 'Cloud',
            level: 'Foundation',
            provider: 'AWS',
            estimated_duration_hours: 40,
            prerequisites: ['Basic IT knowledge'],
            icon_url: 'https://...',
            official_url: 'https://aws.amazon.com/...',
            exam_code: 'CLF-C02',
            study_resources: [...],
            is_active: true
        }
    ],
    error: null
}
```

---

#### 8. Start Certification

**Table**: `user_certifications`
**Used in**: `public/js/certification.js:185-218`

```javascript
const { data: userCert, error } = await supabase
    .from('user_certifications')
    .insert({
        user_id: user.id,
        certification_id: certId,
        status: 'in_progress',
        progress_percentage: 0,
        started_at: new Date().toISOString()
    })
    .select()
    .single();
```

**Status Values**:
- `not_started` - User hasn't begun
- `in_progress` - Currently studying
- `ready_for_exam` - Completed study materials
- `passed` - Certification achieved
- `failed` - Did not pass (can retry)

---

#### 9. Get User Badges

**Tables**: `user_badges`, `badges` (joined)
**Used in**: `public/js/home.js`

```javascript
const { data: userBadges, error } = await supabase
    .from('user_badges')
    .select(`
        id,
        earned_at,
        badges (
            name,
            description,
            icon_url,
            tier,
            category
        )
    `)
    .eq('user_id', user.id)
    .order('earned_at', { ascending: false });
```

**Badge Tiers**: Bronze, Silver, Gold, Platinum, Diamond

---

#### 10. Award XP to User

**Table**: `xp_transactions`
**Auto-updates**: `profiles.total_xp` via trigger

```javascript
const { data: xpTransaction, error } = await supabase
    .from('xp_transactions')
    .insert({
        user_id: user.id,
        amount: 50,
        source_type: 'lesson_complete',  // or 'exercise_complete', 'course_complete', 'badge_earned'
        source_id: lessonId,
        description: 'Completed: Introduction to Python'
    })
    .select()
    .single();
```

**Source Types**:
- `lesson_complete` - Finished a lesson
- `exercise_complete` - Solved a practice exercise
- `course_complete` - Completed entire course
- `badge_earned` - Unlocked a badge
- `streak_bonus` - Daily streak reward
- `manual_award` - Admin manual grant

**Auto-Calculation**:
- Trigger automatically updates `profiles.total_xp`
- Level recalculated: `level = floor(sqrt(total_xp / 100))`

---

#### 11. Get Leaderboard

**Table**: `leaderboard` (materialized view)
**Used in**: `public/js/home.js`

```javascript
// Top 10 users
const { data: topUsers, error } = await supabase
    .from('leaderboard')
    .select('*')
    .limit(10);

// User's personal rank
const { data: myRank, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('id', user.id)
    .single();
```

**Response**:
```javascript
{
    data: [
        {
            id: 'uuid',
            username: 'toplearner',
            full_name: 'Jane Doe',
            avatar_url: 'https://...',
            total_xp: 15000,
            level: 12,
            courses_completed: 25,
            badges_earned: 18,
            rank: 1
        }
    ],
    error: null
}
```

---

#### 12. Update User Profile

**Table**: `profiles`
**Used in**: Profile editing flow

```javascript
const { data: updatedProfile, error } = await supabase
    .from('profiles')
    .update({
        full_name: 'Jane Smith',
        bio: 'Full-stack developer passionate about AI',
        skills: ['Python', 'JavaScript', 'React', 'Machine Learning'],
        updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()
    .single();
```

**Updatable Fields**:
- `full_name`, `bio`, `avatar_url`, `skills`

**Protected Fields** (auto-managed):
- `total_xp`, `current_streak`, `longest_streak`, `last_activity_date`

---

#### 13. Track Daily Activity

**Table**: `daily_activities`
**Auto-updates**: User streak via trigger

```javascript
const { data: activity, error } = await supabase
    .from('daily_activities')
    .insert({
        user_id: user.id,
        activity_date: new Date().toISOString().split('T')[0],
        activity_type: 'lesson_view',
        activity_count: 1
    });
```

**Activity Types**:
- `lesson_view` - Viewed a lesson
- `exercise_attempt` - Attempted practice
- `login` - Daily login
- `course_start` - Started new course

**Streak Logic** (handled by trigger):
- Updates `profiles.current_streak`
- Updates `profiles.longest_streak` if new record
- Resets streak if day missed

---

## Storage API

### Upload Profile Picture

**Bucket**: `profile-pictures`
**Used in**: Profile upload flow

```javascript
const file = event.target.files[0];
const fileExt = file.name.split('.').pop();
const fileName = `${user.id}_${Date.now()}.${fileExt}`;

// Upload file
const { data: uploadData, error: uploadError } = await supabase.storage
    .from('profile-pictures')
    .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
    });

if (uploadError) {
    console.error('Upload error:', uploadError);
    return;
}

// Get public URL
const { data: { publicUrl } } = supabase.storage
    .from('profile-pictures')
    .getPublicUrl(fileName);

// Update profile with new avatar URL
const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id);
```

---

### Delete File from Storage

```javascript
const { error } = await supabase.storage
    .from('profile-pictures')
    .remove([fileName]);
```

---

## Error Handling

### Standard Error Response

All Supabase operations return an error object if something goes wrong:

```javascript
{
    data: null,
    error: {
        message: 'Error message',
        details: 'Detailed error info',
        hint: 'Suggestion to fix',
        code: 'ERROR_CODE'
    }
}
```

### Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| `PGRST116` | Row not found | Check query filters, ensure data exists |
| `23505` | Unique constraint violation | Username/email already exists |
| `23503` | Foreign key violation | Referenced record doesn't exist |
| `42501` | Insufficient privileges | Check RLS policies, user permissions |
| `Invalid login credentials` | Wrong email/password | Verify credentials |
| `Email not confirmed` | Email verification pending | User must verify email |

### Error Handling Pattern

```javascript
async function loadUserProfile() {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
            console.error('Auth error:', userError);
            window.location.href = 'index.html';
            return;
        }

        if (!user) {
            console.log('No user logged in');
            window.location.href = 'index.html';
            return;
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('Error loading profile:', profileError);
            showNotification('Failed to load profile. Please try again.', 'error');
            return;
        }

        // Success - use profile data
        updateUI(profile);

    } catch (error) {
        console.error('Unexpected error:', error);
        showNotification('An unexpected error occurred.', 'error');
    }
}
```

---

## Best Practices

### 1. Always Check for Errors

```javascript
// ❌ Bad - No error handling
const { data } = await supabase.from('courses').select('*');
console.log(data[0].title); // May crash if error

// ✅ Good - Check for errors
const { data, error } = await supabase.from('courses').select('*');
if (error) {
    console.error('Error:', error);
    return;
}
if (data && data.length > 0) {
    console.log(data[0].title);
}
```

---

### 2. Use `.single()` for One Result

```javascript
// ❌ Bad - Returns array even for one result
const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId);
const profile = data[0]; // Can be undefined

// ✅ Good - Returns single object
const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
```

---

### 3. Use Select to Limit Fields

```javascript
// ❌ Bad - Fetches all columns (slow)
const { data } = await supabase.from('courses').select('*');

// ✅ Good - Only fetch needed fields
const { data } = await supabase
    .from('courses')
    .select('id, title, slug, category');
```

---

### 4. Use Joins Instead of Multiple Queries

```javascript
// ❌ Bad - Multiple queries
const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId);

for (const enrollment of enrollments) {
    const { data: course } = await supabase
        .from('courses')
        .select('*')
        .eq('id', enrollment.course_id)
        .single();
    // Use course data
}

// ✅ Good - Single query with join
const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
        *,
        courses (
            id,
            title,
            slug,
            thumbnail_url
        )
    `)
    .eq('user_id', userId);
```

---

### 5. Cache User Data in Session Storage

```javascript
// On successful login
sessionStorage.setItem('userProfile', JSON.stringify(profile));
sessionStorage.setItem('authUser', JSON.stringify(user));

// On page load (if data exists)
const cachedProfile = sessionStorage.getItem('userProfile');
if (cachedProfile) {
    const profile = JSON.parse(cachedProfile);
    updateUI(profile);
}

// On logout - clear cache
sessionStorage.removeItem('userProfile');
sessionStorage.removeItem('authUser');
```

---

### 6. Use Row Level Security (RLS)

All tables have RLS policies enabled. Users can only:
- Read their own profile data
- Update their own profile
- View public content (courses, badges, certifications)
- Admin operations require `is_admin = true` in profile

**Database ensures security** - Frontend restrictions are UX only.

---

## Common Patterns

### Pattern 1: Protected Page Check

**Every authenticated page should include:**

```javascript
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        window.location.href = 'index.html';
        return;
    }

    // User is authenticated, load page data
    await loadPageData(user);
});
```

---

### Pattern 2: Admin Access Check

**Admin pages should verify admin status:**

```javascript
async function checkAdminAccess() {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        window.location.href = 'index.html';
        return false;
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

    if (profileError || !profile?.is_admin) {
        console.error('Access denied: Not an admin');
        window.location.href = 'home.html';
        return false;
    }

    return true;
}
```

---

### Pattern 3: Pagination

```javascript
const PAGE_SIZE = 20;
let currentPage = 1;

async function loadCoursesPage(page = 1) {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;

    const { data: courses, error, count } = await supabase
        .from('courses')
        .select('*', { count: 'exact' })
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .range(start, end);

    if (error) {
        console.error('Error loading courses:', error);
        return;
    }

    const totalPages = Math.ceil(count / PAGE_SIZE);
    renderCourses(courses);
    renderPagination(page, totalPages);
}
```

---

### Pattern 4: Search with Debounce

```javascript
let searchTimeout;

function setupSearchInput() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(async () => {
            const query = e.target.value.trim();

            if (query.length < 2) {
                await loadAllCourses();
                return;
            }

            const { data: courses, error } = await supabase
                .from('courses')
                .select('*')
                .ilike('title', `%${query}%`)
                .eq('is_published', true);

            if (error) {
                console.error('Search error:', error);
                return;
            }

            renderCourses(courses);
        }, 300); // Debounce 300ms
    });
}
```

---

### Pattern 5: Real-time Updates (Future Enhancement)

```javascript
// Subscribe to changes on a table
const subscription = supabase
    .channel('public:courses')
    .on('postgres_changes',
        { event: '*', schema: 'public', table: 'courses' },
        (payload) => {
            console.log('Change received!', payload);
            refreshCoursesList();
        }
    )
    .subscribe();

// Unsubscribe when leaving page
window.addEventListener('beforeunload', () => {
    subscription.unsubscribe();
});
```

---

## API Rate Limits

Supabase has the following rate limits (varies by plan):

- **Free Tier**: 500 requests/minute
- **Pro Tier**: Unlimited (fair use policy)

**Best Practices**:
- Implement pagination for large datasets
- Use debouncing for search inputs
- Cache data when appropriate
- Batch operations when possible

---

## Security Considerations

### 1. Never Expose Service Role Key

- ✅ Use `SUPABASE_ANON_KEY` in frontend
- ❌ Never use `service_role` key in client-side code

### 2. Trust Row Level Security

- All security enforced at database level
- Frontend restrictions are UX only
- RLS policies prevent unauthorized access

### 3. Validate User Input

```javascript
// Sanitize and validate before inserting
function validateUsername(username) {
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        return false;
    }
    return true;
}
```

### 4. Use Prepared Statements

Supabase automatically uses parameterized queries - no SQL injection risk.

---

## Testing API Calls

### Using Browser Console

```javascript
// Test authentication
const { data, error } = await supabase.auth.getUser();
console.log('User:', data);

// Test database query
const { data: courses } = await supabase.from('courses').select('*').limit(5);
console.log('Courses:', courses);
```

### Using Supabase Dashboard

1. Go to **SQL Editor** in dashboard
2. Write and test queries directly
3. View table data in **Table Editor**
4. Check logs in **Logs** section

---

## Related Documentation

- [DATABASE_README.md](./sql/DATABASE_README.md) - Database schema and queries
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [Supabase Official Docs](https://supabase.com/docs) - Supabase API reference

---

**Last Updated**: 2025-12-18
**Version**: 1.0.0
