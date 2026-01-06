# KadaSkill System Architecture v1.1.0

**Document Version:** 1.1.0  
**Last Updated:** January 6, 2026  
**System Version:** 1.1.0 (Enhanced Performance & Security Release)

## Overview

KadaSkill is a modern learning management platform built with a **Frontend-centric architecture** using vanilla web technologies and Supabase as the Backend-as-a-Service (BaaS) provider. This document describes the enhanced system architecture following comprehensive performance optimization, security enhancements, and systematic debugging improvements implemented in version 1.1.0.

## ✨ Version 1.1.0 Architecture Enhancements

### Performance Architecture Improvements
- **Singleton Pattern**: Supabase client management optimized for performance
- **Lazy Loading**: Multimedia content loading optimization 
- **Database Optimization**: Comprehensive indexing and query performance enhancement
- **Memory Management**: Enhanced cleanup mechanisms for video players and API resources

### Security Architecture Enhancements  
- **Environment-based Configuration**: Secure API key management through build-time injection
- **Enhanced Session Management**: Improved authentication security with timeout mechanisms
- **Input Validation Framework**: Comprehensive data sanitization across all endpoints

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Technology Stack](#technology-stack)
3. [System Components](#system-components)
4. [Data Architecture](#data-architecture)
5. [Security Architecture](#security-architecture)
6. [Frontend Architecture](#frontend-architecture)
7. [State Management](#state-management)
8. [Design Patterns](#design-patterns)
9. [Deployment Architecture](#deployment-architecture)
10. [Scalability Considerations](#scalability-considerations)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Browser (Chrome, Firefox, Safari, Edge)                     │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐            │  │
│  │  │   HTML5    │  │   CSS3     │  │ Vanilla JS │            │  │
│  │  └────────────┘  └────────────┘  └────────────┘            │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                ↕ HTTPS
┌─────────────────────────────────────────────────────────────────────┐
│                        WEB SERVER LAYER                             │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Express.js (Node.js / Bun)                                  │  │
│  │  • Static file serving (public/)                             │  │
│  │  • Single route handler (/)                                  │  │
│  │  • Port 3000                                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                ↕ HTTPS
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND-AS-A-SERVICE LAYER                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Supabase (PostgreSQL + APIs)                                │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │  │
│  │  │ Auth API    │  │ Database API │  │ Storage API  │       │  │
│  │  │ • OAuth     │  │ • RESTful    │  │ • S3-like    │       │  │
│  │  │ • Email/PW  │  │ • Real-time  │  │ • Public CDN │       │  │
│  │  │ • JWT       │  │ • RLS        │  │              │       │  │
│  │  └─────────────┘  └──────────────┘  └──────────────┘       │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                ↕
┌─────────────────────────────────────────────────────────────────────┐
│                         DATABASE LAYER                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL 15                                               │  │
│  │  • 18 tables                                                 │  │
│  │  • Row Level Security (RLS)                                  │  │
│  │  • Triggers & Functions                                      │  │
│  │  • Materialized Views                                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **HTML5** | - | Structure and semantic markup |
| **CSS3** | - | Styling, animations, responsive design |
| **JavaScript (ES6+)** | - | Client-side logic and interactivity |
| **Supabase JS Client** | v2 | BaaS client library |
| **Chart.js** | 4.4.0 | Data visualization (admin analytics) |
| **SortableJS** | 1.15.0 | Drag-and-drop functionality |
| **Font Awesome** | 6.4.0 | Icon library |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Express.js** | 4.18.2 | Web server framework |
| **Bun** | Latest | JavaScript runtime (primary) |
| **Node.js** | 18+ | JavaScript runtime (fallback) |
| **Supabase** | Hosted | Backend-as-a-Service |
| **PostgreSQL** | 15 | Relational database |

### Development Tools

- **Git** - Version control
- **Bun** - Package management & runtime
- **VSCode** - Code editor (recommended)

---

## System Components

### 1. Web Server (Express.js)

**File**: `server.js`
**Responsibility**: Serve static files and handle routing

```javascript
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public/
app.use(express.static('public'));

// Route handler for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT);
```

**Design Rationale**:
- Simple, stateless server
- No business logic on server (all in client + Supabase)
- Easy to deploy to any hosting platform
- Can be replaced with static hosting (Vercel, Netlify)

---

### 2. Frontend Application

**Structure**:
```
public/
├── *.html              # 16 page files
├── css/                # Modular stylesheets
│   ├── style.css       # Global styles
│   ├── home.css        # Dashboard styles
│   ├── admin.css       # Admin panel styles
│   └── ...             # Page-specific styles
├── js/                 # Modular JavaScript
│   ├── script.js       # Core initialization
│   ├── home.js         # Dashboard logic
│   ├── admin.js        # Admin panel logic
│   └── ...             # Page-specific logic
└── images/             # Static assets
```

**Key Pages**:
- `index.html` - Landing/Login page
- `home.html` - User dashboard
- `learn.html` - Course catalog
- `learning.html` - Course player
- `practice.html` - Practice exercises
- `certification.html` - Certification catalog
- `profile.html` - User profile
- `admin.html` - Admin panel

---

### 3. Supabase Backend

**Components**:

#### Authentication Service
- Email/password authentication
- OAuth providers (Google, Microsoft, Facebook, LinkedIn)
- JWT-based session management
- Automatic profile creation via trigger

#### Database Service
- PostgreSQL 15 with 18 tables
- Row Level Security (RLS) for data access control
- Automatic triggers for XP calculation, streak tracking
- Materialized views for leaderboard performance

#### Storage Service
- S3-compatible object storage
- Public CDN for profile pictures
- Bucket: `profile-pictures`

---

## Data Architecture

### Database Schema Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     USER DOMAIN                             │
├─────────────────────────────────────────────────────────────┤
│ auth.users (Supabase managed)                               │
│     ↓ (trigger: on_auth_user_created)                       │
│ profiles          - User profiles and stats                 │
│ daily_activities  - Activity tracking                       │
│ notifications     - User notifications                      │
│ xp_transactions   - XP history                              │
└─────────────────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────────┐
│                   LEARNING DOMAIN                           │
├─────────────────────────────────────────────────────────────┤
│ courses           - Course catalog                          │
│     ↓ (1:N)                                                 │
│ lessons           - Course lessons                          │
│     ↓ (1:N)                                                 │
│ quizzes           - Lesson assessments                      │
│     ↓ (1:N)                                                 │
│ quiz_questions    - Quiz question bank                      │
│                                                             │
│ enrollments       - User ↔ Course relationships             │
│ lesson_progress   - User ↔ Lesson completion                │
│ quiz_attempts     - User ↔ Quiz submissions                 │
└─────────────────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────────┐
│                CERTIFICATION DOMAIN                         │
├─────────────────────────────────────────────────────────────┤
│ certifications        - Certification catalog               │
│ user_certifications   - User cert progress                  │
└─────────────────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────────┐
│                   PRACTICE DOMAIN                           │
├─────────────────────────────────────────────────────────────┤
│ practice_exercises    - Exercise bank                       │
│ practice_submissions  - User solutions                      │
└─────────────────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────────┐
│                GAMIFICATION DOMAIN                          │
├─────────────────────────────────────────────────────────────┤
│ badges            - Badge definitions                       │
│ user_badges       - User earned badges                      │
│ leaderboard       - Global rankings (materialized view)     │
└─────────────────────────────────────────────────────────────┘
```

### Key Database Features

#### 1. Automatic Profile Creation

```sql
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
```

When user signs up → Profile automatically created

#### 2. XP Auto-Calculation

```sql
CREATE TRIGGER xp_transaction_update_user
    AFTER INSERT ON xp_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_xp();
```

Insert XP transaction → User's total XP and level auto-updated

#### 3. Streak Tracking

```sql
CREATE TRIGGER daily_activity_update_streak
    AFTER INSERT ON daily_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_user_streak();
```

Log daily activity → Streak automatically maintained

#### 4. Leaderboard Performance

```sql
CREATE MATERIALIZED VIEW leaderboard AS
SELECT
    p.id,
    p.username,
    p.total_xp,
    ROW_NUMBER() OVER (ORDER BY p.total_xp DESC) as rank
FROM profiles p;
```

Refresh periodically for fast leaderboard queries

---

## Security Architecture

### 1. Row Level Security (RLS)

**All tables have RLS enabled** with policies:

```sql
-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Public content visible to all authenticated users
CREATE POLICY "Courses visible to authenticated users"
    ON courses FOR SELECT
    USING (auth.role() = 'authenticated');
```

**Security Layers**:
1. **Database RLS** - Primary security (enforced by PostgreSQL)
2. **Authentication** - JWT tokens validate user identity
3. **Frontend checks** - UX only (not security boundary)

### 2. Authentication Flow

```
User Login
    ↓
Supabase Auth API
    ↓ (validates credentials)
JWT Token Generated
    ↓
Token stored in browser
    ↓
Subsequent requests include JWT
    ↓
Supabase validates JWT
    ↓
RLS policies applied based on user
```

### 3. Admin Access Control

**Admin flag in profiles table**:
```sql
profiles.is_admin = true
```

Frontend checks admin status before showing admin UI, but **database RLS policies enforce actual permissions**.

### 4. API Keys

- **Anon Key** - Safe for client-side use (public)
- **Service Role Key** - Server-only (never exposed to client)

---

## Frontend Architecture

### Module Organization

**Pattern**: Page-specific JavaScript files with shared utilities

```
script.js        → Core initialization, auth, shared components
home.js          → Dashboard page logic
learn.js         → Course catalog logic
learning.js      → Course player logic
practice.js      → Practice exercises logic
certification.js → Certification catalog logic
profile.js       → Profile page logic
admin.js         → Admin panel logic
components.js    → Reusable UI components
```

### Initialization Flow

```
1. Browser loads HTML
    ↓
2. Load script.js (core)
    ↓
3. DOMContentLoaded event fires
    ↓
4. Load shared components (nav, footer)
    ↓
5. Initialize page-specific functionality
    ↓
6. Check authentication state
    ↓
7. Load user data from Supabase
    ↓
8. Render UI with user data
```

**Code** (`script.js:24-95`):
```javascript
document.addEventListener('DOMContentLoaded', function () {
    // Load shared components first
    loadSharedComponents();

    setTimeout(() => {
        // Hide loading screen
        hideLoadingScreen();

        // Initialize core interactions
        initializeFormHandling();
        initializePasswordToggle();
        initializeLoginToggle();

        // Initialize page-specific functionality
        initializeCertificationPage();
        initializeCalendar();
        initializeLearnPage();
        // ... more initializers

        // Load user data if cached
        const hasStoredProfile = !!sessionStorage.getItem('userProfile');
        const hasStoredUser = !!sessionStorage.getItem('authUser');

        if (hasStoredProfile && hasStoredUser) {
            loadDashboardData();
        }

        // Initialize scroll animations
        initializeHeaderScrollAnimation();
    }, 100);
});
```

### Component Architecture

**Shared Components**:
- Navigation bar (dynamically loaded)
- Footer (dynamically loaded)
- User menu dropdown
- Loading screens
- Notification system

**Pattern**:
```javascript
function loadNavigation() {
    fetch('components/navigation.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('nav-container').innerHTML = html;
            initializeUserMenu();
        });
}
```

---

## State Management

### SessionStorage Strategy

**Why SessionStorage?**
- Simple, no external dependencies
- Persists within browser tab session
- Automatically cleared on tab close
- Fast access to user data

**Stored Data**:
```javascript
// On successful login/load
sessionStorage.setItem('userProfile', JSON.stringify({
    id: user.id,
    username: 'johndoe',
    full_name: 'John Doe',
    avatar_url: 'https://...',
    total_xp: 5000,
    current_streak: 15,
    // ... other profile fields
}));

sessionStorage.setItem('authUser', JSON.stringify({
    id: user.id,
    email: 'user@example.com',
    // ... auth fields
}));
```

**Usage**:
```javascript
// Retrieve cached data
const cachedProfile = sessionStorage.getItem('userProfile');
if (cachedProfile) {
    const profile = JSON.parse(cachedProfile);
    updateUI(profile);
} else {
    await loadUserProfile(); // Fetch from Supabase
}
```

**Cache Invalidation**:
- On logout: Clear sessionStorage
- On profile update: Refresh cache
- On tab close: Automatic clear

---

## Design Patterns

### 1. Async/Await for Database Operations

```javascript
async function loadUserProfile() {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            handleAuthError();
            return;
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) {
            handleProfileError(profileError);
            return;
        }

        updateUI(profile);

    } catch (error) {
        handleUnexpectedError(error);
    }
}
```

### 2. Error-First Pattern

```javascript
const { data, error } = await supabaseOperation();

if (error) {
    // Handle error first
    console.error('Error:', error);
    showNotification('Operation failed', 'error');
    return;
}

// Proceed with success case
processData(data);
```

### 3. Progressive Enhancement

```javascript
// Check for browser features
if ('IntersectionObserver' in window) {
    // Use modern API
    setupIntersectionObserver();
} else {
    // Fallback for older browsers
    setupScrollListener();
}
```

### 4. Module Pattern

```javascript
// Each page has isolated scope
(function() {
    let currentUser = null;
    let userProfile = null;

    // Private functions
    function updateUI(profile) { ... }

    // Public initialization
    document.addEventListener('DOMContentLoaded', async () => {
        await loadPageData();
    });
})();
```

---

## Deployment Architecture

### Development Environment

```
Developer Machine
    ↓ (bun run dev)
Local Express Server (port 3000)
    ↓ (serves public/)
Browser (localhost:3000)
    ↓ (HTTPS)
Supabase Cloud (production instance)
```

### Production Environment Options

#### Option 1: Traditional Hosting

```
Users → CDN/Web Server → Static Files
              ↓
        Supabase Cloud
```

**Platforms**: DigitalOcean, AWS EC2, Heroku

#### Option 2: Serverless (Recommended)

```
Users → Vercel/Netlify Edge → Static Files
                ↓
          Supabase Cloud
```

**Platforms**: Vercel, Netlify, Cloudflare Pages

**Advantages**:
- Auto-scaling
- Global CDN
- Zero config deployments
- SSL included
- Git integration

#### Option 3: JAMstack

```
Users → Static Hosting (S3 + CloudFront) → HTML/CSS/JS
                           ↓
                     Supabase Cloud
```

**Platforms**: AWS S3 + CloudFront, Google Cloud Storage

---

## Scalability Considerations

### Current Architecture Strengths

1. **Stateless Frontend**
   - No server-side sessions
   - Easy horizontal scaling
   - Can serve from CDN

2. **Managed Backend (Supabase)**
   - Auto-scaling database
   - Connection pooling
   - Automatic backups
   - Built-in caching

3. **Materialized Views**
   - Pre-computed leaderboard
   - Fast complex queries
   - Refresh on schedule

### Potential Bottlenecks

1. **Database Queries**
   - Solution: Add indexes, optimize queries
   - Implement query result caching

2. **File Storage**
   - Solution: Use CDN for profile pictures
   - Implement lazy loading for images

3. **Real-time Features** (Future)
   - Solution: Supabase real-time subscriptions
   - WebSocket connections for live updates

### Scaling Strategy

#### Phase 1: Current (1-10K users)
- Single Supabase instance
- Static file hosting
- SessionStorage state management

#### Phase 2: Growth (10K-100K users)
- Add Redis for caching
- Implement CDN for static assets
- Database read replicas
- Optimize queries with indexes

#### Phase 3: Scale (100K+ users)
- Multi-region deployment
- Microservices for heavy operations
- Message queue (Redis/RabbitMQ)
- Advanced caching strategy
- Database sharding if needed

---

## Technology Decisions

### Why Vanilla JavaScript?

**Pros**:
- ✅ No build step required
- ✅ Smaller bundle size
- ✅ Faster initial load
- ✅ Direct browser APIs
- ✅ Easy to understand and maintain
- ✅ No framework lock-in

**Cons**:
- ❌ More boilerplate code
- ❌ Manual DOM manipulation
- ❌ No reactive state management
- ❌ Harder to manage complex UIs

**Rationale**: For this learning platform with relatively simple UI interactions, vanilla JS provides excellent performance and maintainability without framework overhead.

### Why Supabase over Custom Backend?

**Pros**:
- ✅ Rapid development
- ✅ Built-in authentication
- ✅ Row Level Security
- ✅ Real-time capabilities
- ✅ Auto-generated REST API
- ✅ Automatic backups
- ✅ Managed infrastructure

**Cons**:
- ❌ Vendor lock-in
- ❌ Less control over backend
- ❌ Pricing at scale

**Rationale**: Supabase significantly accelerates development and provides enterprise-grade features without managing infrastructure.

### Why Bun over Node.js?

**Pros**:
- ✅ 3x faster package installation
- ✅ Built-in TypeScript support
- ✅ Better performance
- ✅ Modern JavaScript runtime

**Fallback**: Node.js still supported via `package.json`

---

## Future Architecture Enhancements

### Planned Improvements

1. **Real-time Collaboration**
   - Live coding for practice exercises
   - Real-time chat/forums
   - Collaborative learning features

2. **Advanced Caching**
   - Redis for session management
   - CDN for API responses
   - Service workers for offline support

3. **Microservices** (if needed)
   - Code execution service (sandboxed)
   - AI tutoring service
   - Analytics service

4. **Progressive Web App (PWA)**
   - Offline course access
   - Push notifications
   - Install to home screen

5. **Mobile Apps**
   - React Native or Flutter
   - Shared API with web app
   - Native performance

---

## Monitoring and Observability

### Current Monitoring

- **Supabase Dashboard**: Database performance, query logs
- **Browser Console**: Client-side errors
- **Server Logs**: Express.js request logs

### Recommended Additions

1. **Error Tracking**: Sentry or Rollbar
2. **Analytics**: Google Analytics or Plausible
3. **Performance Monitoring**: Lighthouse, Web Vitals
4. **Uptime Monitoring**: UptimeRobot or Pingdom

---

## Related Documentation

- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- [DATABASE_README.md](./sql/DATABASE_README.md) - Database schema
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Development setup
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment instructions

---

**Last Updated**: 2025-12-18
**Version**: 1.0.0
**Architecture Status**: Stable, Production-Ready
