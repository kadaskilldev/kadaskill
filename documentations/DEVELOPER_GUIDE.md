# KadaSkill Developer Guide

## Welcome! 👋

This guide will help you get started contributing to KadaSkill, understand our development workflow, and learn our coding conventions.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Environment Setup](#development-environment-setup)
3. [Project Structure](#project-structure)
4. [Coding Standards](#coding-standards)
5. [Development Workflow](#development-workflow)
6. [Common Development Tasks](#common-development-tasks)
7. [Debugging Tips](#debugging-tips)
8. [Testing](#testing)
9. [Git Workflow](#git-workflow)
10. [Code Review Guidelines](#code-review-guidelines)

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Bun** (v1.0+) - [Install Bun](https://bun.sh/)
- **Node.js** (v18+) - Optional fallback
- **Git** (v2.0+)
- **Code Editor** - VSCode recommended
- **Modern Browser** - Chrome, Firefox, or Edge

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/kadaskill.git
cd kadaskill

# Install dependencies
bun install

# Start development server
bun run dev

# Open browser to http://localhost:3000
```

---

## Development Environment Setup

### 1. Install Bun

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# Verify installation
bun --version
```

### 2. Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

**Dependencies**:
- `express` - Web server
- `path` - Path utilities

**Dev Dependencies**:
- `bun-types` - TypeScript definitions for Bun

### 3. Configure Supabase

The project uses Supabase as the backend. The configuration is already in `public/js/script.js`:

```javascript
const SUPABASE_URL = 'https://kbpbubsnadnhebgdggdy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGci...'; // Public anon key
```

**For local development**, you can:
1. Use the existing Supabase instance (default)
2. Create your own Supabase project and update the keys

**To create your own Supabase project**:
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Run database migrations from `sql/database-schema.sql`
4. Update `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `script.js`

### 4. Set Up Database (Optional)

If using your own Supabase instance:

```bash
# Navigate to sql folder
cd sql/

# Run these SQL files in order in Supabase SQL Editor:
# 1. database-schema.sql       (creates tables)
# 2. seed-courses.sql          (seeds courses)
# 3. seed-certifications.sql   (seeds certifications)
# 4. seed-badges.sql           (seeds badges)
# 5. seed-practice.sql         (seeds practice exercises)
# 6. seed-lessons.sql          (seeds lessons)
```

### 5. VSCode Setup (Recommended)

**Recommended Extensions**:
- ESLint
- Prettier
- Live Server
- JavaScript (ES6) code snippets
- Path Intellisense

**Workspace Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.tabSize": 4,
  "editor.insertSpaces": true,
  "files.eol": "\n",
  "javascript.suggestionActions.enabled": true
}
```

---

## Project Structure

```
kadaskill/
├── package.json              # Dependencies and scripts
├── server.js                 # Express server entry point
├── README.md                 # Project overview
├── API_DOCUMENTATION.md      # API reference
├── ARCHITECTURE.md           # System architecture
├── DEVELOPER_GUIDE.md        # This file
├── public/                   # Frontend assets (served statically)
│   ├── index.html            # Landing/login page
│   ├── home.html             # User dashboard
│   ├── learn.html            # Course catalog
│   ├── learning.html         # Course player
│   ├── practice.html         # Practice exercises
│   ├── certification.html    # Certification catalog
│   ├── profile.html          # User profile
│   ├── admin.html            # Admin panel
│   ├── css/                  # Stylesheets
│   │   ├── style.css         # Global styles
│   │   ├── home.css          # Dashboard styles
│   │   ├── admin.css         # Admin panel styles
│   │   └── ...               # Page-specific styles
│   ├── js/                   # JavaScript modules
│   │   ├── script.js         # Core initialization & auth
│   │   ├── home.js           # Dashboard logic
│   │   ├── admin.js          # Admin panel logic
│   │   └── ...               # Page-specific logic
│   └── images/               # Static images
│       ├── home/             # Homepage assets
│       ├── loading/          # Loading screens
│       ├── profile/          # Profile page assets
│       └── ...
└── sql/                      # Database schemas and seeds
    ├── database-schema.sql   # Full schema definition
    ├── seed-*.sql            # Data seeding scripts
    └── DATABASE_README.md    # Database documentation
```

### File Naming Conventions

- **HTML files**: `kebab-case.html` (e.g., `edit-profile.html`)
- **CSS files**: `kebab-case.css` (e.g., `admin-course-edit.css`)
- **JavaScript files**: `kebab-case.js` (e.g., `practice-session.js`)
- **Image folders**: `lowercase` (e.g., `images/home/`)

---

## Coding Standards

### HTML Conventions

```html
<!-- Use semantic HTML5 elements -->
<header class="site-header">
    <nav class="navigation">
        <ul class="nav-list">
            <li class="nav-item">
                <a href="home.html" class="nav-link">Dashboard</a>
            </li>
        </ul>
    </nav>
</header>

<!-- Use BEM-like naming for classes -->
<div class="course-card">
    <div class="course-card__header">
        <h3 class="course-card__title">Python Fundamentals</h3>
    </div>
    <div class="course-card__body">
        <p class="course-card__description">Learn Python basics</p>
    </div>
</div>

<!-- Include accessibility attributes -->
<button
    aria-label="Open user menu"
    aria-expanded="false"
    aria-haspopup="true">
    Menu
</button>
```

### CSS Conventions

```css
/* Use BEM methodology */
.block {}
.block__element {}
.block__element--modifier {}

/* Example */
.course-card {}
.course-card__title {}
.course-card__title--featured {}

/* Use CSS variables for theming */
:root {
    --color-primary: #4169E1;
    --color-secondary: #FF6B35;
    --spacing-unit: 8px;
    --font-size-base: 16px;
}

/* Mobile-first responsive design */
.container {
    padding: 1rem;
}

@media (min-width: 768px) {
    .container {
        padding: 2rem;
    }
}

/* Use meaningful names */
/* ❌ Bad */
.btn1 { }
.box { }

/* ✅ Good */
.button-primary { }
.course-card { }
```

### JavaScript Conventions

```javascript
// Use const/let, never var
const API_URL = 'https://api.example.com';
let currentUser = null;

// Use camelCase for variables and functions
function loadUserProfile() { }
const userProfile = {};

// Use PascalCase for classes (if any)
class UserManager { }

// Use async/await over promises
async function fetchCourses() {
    try {
        const { data, error } = await supabase.from('courses').select('*');

        if (error) {
            console.error('Error:', error);
            return;
        }

        return data;
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

// Always check for errors first
const { data, error } = await supabaseOperation();
if (error) {
    // Handle error
    return;
}
// Proceed with success

// Use descriptive variable names
// ❌ Bad
const d = new Date();
const u = await getUser();

// ✅ Good
const currentDate = new Date();
const currentUser = await getUser();

// Use early returns to reduce nesting
// ❌ Bad
function validateUser(user) {
    if (user) {
        if (user.email) {
            if (user.password) {
                return true;
            }
        }
    }
    return false;
}

// ✅ Good
function validateUser(user) {
    if (!user) return false;
    if (!user.email) return false;
    if (!user.password) return false;
    return true;
}

// Document complex functions
/**
 * Calculates user level based on total XP
 * Formula: level = floor(sqrt(total_xp / 100))
 *
 * @param {number} totalXp - User's total XP
 * @returns {number} Calculated level (minimum 1)
 */
function calculateLevel(totalXp) {
    return Math.max(1, Math.floor(Math.sqrt(totalXp / 100)));
}
```

### Code Organization

```javascript
// 1. Constants at the top
const MAX_ITEMS = 10;
const API_ENDPOINT = '/api/courses';

// 2. State variables
let currentUser = null;
let courses = [];

// 3. Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
    await initializePage();
});

// 4. Initialization functions
async function initializePage() {
    await loadUser();
    await loadData();
    setupEventListeners();
}

// 5. Data loading functions
async function loadUser() { }
async function loadData() { }

// 6. UI update functions
function updateUI(data) { }
function renderList(items) { }

// 7. Event handlers
function handleButtonClick(event) { }
function handleFormSubmit(event) { }

// 8. Helper/utility functions
function formatDate(date) { }
function validateInput(input) { }
```

---

## Development Workflow

### Daily Development Cycle

```bash
# 1. Pull latest changes
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Start dev server
bun run dev

# 4. Make changes to code

# 5. Test changes in browser
open http://localhost:3000

# 6. Commit changes
git add .
git commit -m "feat: add user profile editing"

# 7. Push to remote
git push origin feature/your-feature-name

# 8. Create pull request on GitHub
```

### Hot Reload

The development server automatically serves updated files. Simply refresh your browser to see changes.

**Pro Tip**: Use browser DevTools to disable cache during development:
- Chrome: Open DevTools → Network tab → Check "Disable cache"
- Firefox: Open DevTools → Settings → Check "Disable HTTP Cache"

---

## Common Development Tasks

### Task 1: Add a New Page

```bash
# 1. Create HTML file
touch public/new-page.html

# 2. Create CSS file
touch public/css/new-page.css

# 3. Create JS file
touch public/js/new-page.js
```

**HTML Template**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Page - KadaSkill</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/new-page.css">
</head>
<body>
    <div id="nav-container"></div>

    <main class="main-content">
        <!-- Your content here -->
    </main>

    <div id="footer-container"></div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="js/script.js"></script>
    <script src="js/new-page.js"></script>
</body>
</html>
```

**JavaScript Template**:
```javascript
// new-page.js

// State
let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await loadPageData();
});

// Authentication check
async function checkAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        window.location.href = 'index.html';
        return;
    }

    currentUser = user;
}

// Load data
async function loadPageData() {
    try {
        const { data, error } = await supabase
            .from('your_table')
            .select('*');

        if (error) throw error;

        renderData(data);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Render UI
function renderData(data) {
    // Update DOM with data
}
```

### Task 2: Add a New Database Table

```sql
-- 1. Create table in Supabase SQL Editor
CREATE TABLE your_table (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
CREATE POLICY "Users can view their own data"
    ON your_table FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data"
    ON your_table FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 4. Create indexes (if needed)
CREATE INDEX idx_your_table_user_id ON your_table(user_id);
```

### Task 3: Add a New API Endpoint (Supabase Function)

```javascript
// Frontend: Call the API
const { data, error } = await supabase
    .from('your_table')
    .select('*')
    .eq('user_id', userId);
```

### Task 4: Implement a New Feature

**Example: Add "Favorite Courses" Feature**

1. **Database Schema**:
```sql
CREATE TABLE favorite_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    favorited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);
```

2. **Frontend Function** (`learn.js`):
```javascript
async function toggleFavorite(courseId) {
    const { data: existing } = await supabase
        .from('favorite_courses')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('course_id', courseId)
        .single();

    if (existing) {
        // Remove favorite
        await supabase
            .from('favorite_courses')
            .delete()
            .eq('id', existing.id);
    } else {
        // Add favorite
        await supabase
            .from('favorite_courses')
            .insert({
                user_id: currentUser.id,
                course_id: courseId
            });
    }

    await refreshCourseList();
}
```

3. **UI Component** (HTML):
```html
<button
    class="favorite-button"
    onclick="toggleFavorite('course-uuid')"
    aria-label="Add to favorites">
    <i class="fa fa-heart-o"></i>
</button>
```

### Task 5: Debugging Database Queries

```javascript
// Enable verbose logging
const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true);

console.log('Query result:', { data, error });

// Check in Supabase Dashboard:
// 1. Go to Logs → API Logs
// 2. View query execution and errors
// 3. Check RLS policy evaluations
```

---

## Debugging Tips

### Browser DevTools

**Console Debugging**:
```javascript
// Log user state
console.log('Current user:', currentUser);

// Log API responses
const { data, error } = await supabase.from('courses').select('*');
console.log('Courses:', data);
console.error('Error:', error);

// Breakpoints
debugger; // Pauses execution
```

**Network Tab**:
- View all API requests to Supabase
- Check request/response headers
- Verify authentication tokens
- Monitor load times

**Application Tab**:
- View sessionStorage data
- Check cookies
- Inspect local storage

### Common Issues & Solutions

#### Issue: "Supabase client library not found"

**Solution**:
```html
<!-- Ensure CDN script is included -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/script.js"></script> <!-- Must load after Supabase -->
```

#### Issue: "User redirected to login page"

**Cause**: No active session

**Solution**:
```javascript
// Check session in console
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);

// If null, user needs to log in again
```

#### Issue: "Row Level Security policy violation"

**Cause**: User doesn't have permission

**Solution**:
1. Check RLS policies in Supabase dashboard
2. Verify user is authenticated
3. Ensure user owns the data they're trying to access

```sql
-- View policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';
```

#### Issue: "CORS error when calling API"

**Cause**: Supabase project URL mismatch

**Solution**:
- Verify `SUPABASE_URL` is correct in `script.js`
- Check Supabase project settings → API → URL

---

## Testing

### Manual Testing Checklist

Before submitting a pull request:

- [ ] Test on Chrome, Firefox, and Safari
- [ ] Test on mobile (responsive design)
- [ ] Test all user flows (signup, login, logout)
- [ ] Test with different user roles (admin, regular user)
- [ ] Test error cases (network errors, invalid input)
- [ ] Check console for errors
- [ ] Verify no browser console warnings

### Testing User Flows

**Example: Test Course Enrollment**

```javascript
// 1. Login as test user
// 2. Navigate to learn.html
// 3. Click "Enroll" on a course
// 4. Verify enrollment in database:

const { data } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', 'test-user-id')
    .eq('course_id', 'course-id');

console.log('Enrollment:', data);

// 5. Check home.html shows enrolled course
// 6. Verify XP was awarded (if applicable)
```

### Browser Testing

**Recommended Test Browsers**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Responsive Testing**:
- Mobile (320px - 767px)
- Tablet (768px - 1199px)
- Desktop (1200px+)

---

## Git Workflow

### Branch Naming

```bash
# Feature branches
feature/add-user-profile-editing
feature/implement-certification-system

# Bug fixes
fix/course-enrollment-error
fix/profile-avatar-upload

# Hotfixes (production)
hotfix/security-patch-auth

# Documentation
docs/update-api-documentation
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <subject>

# Types
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style changes (formatting)
refactor: Code refactoring
test:     Adding/updating tests
chore:    Build process or auxiliary tool changes

# Examples
git commit -m "feat(profile): add profile picture upload"
git commit -m "fix(auth): resolve OAuth redirect issue"
git commit -m "docs(api): update authentication endpoints"
git commit -m "refactor(home): improve dashboard loading performance"
```

### Pull Request Process

1. **Create PR** on GitHub
2. **Fill out PR template**:
   - What: What does this PR do?
   - Why: Why is this change needed?
   - How: How was it implemented?
   - Testing: What testing was done?
3. **Request review** from team members
4. **Address feedback**
5. **Merge** after approval

**PR Title Format**:
```
feat: Add user profile editing feature
fix: Resolve course enrollment duplicate issue
```

---

## Code Review Guidelines

### As a Reviewer

**What to Check**:
- ✅ Code follows style guide
- ✅ No console.log statements left in code
- ✅ Error handling is implemented
- ✅ Functions are well-named and documented
- ✅ No security vulnerabilities
- ✅ Changes are tested
- ✅ Responsive design works
- ✅ Accessibility attributes present

**Review Comments**:
```
// Good feedback
"Consider using a more descriptive variable name here,
like `userEnrollments` instead of `data`"

"This function could benefit from error handling.
What happens if the API call fails?"

// Not helpful
"This is bad"
"Change this"
```

### As a Reviewee

- **Respond to all comments**
- **Ask questions if unclear**
- **Be open to feedback**
- **Make requested changes promptly**
- **Thank reviewers**

---

## Development Tools

### Useful Browser Extensions

- **React DevTools** (if we migrate to React)
- **Redux DevTools** (if we add Redux)
- **Lighthouse** - Performance auditing
- **JSON Viewer** - Format JSON responses
- **Wappalyzer** - Detect technologies

### Recommended VSCode Extensions

- **ESLint** - Linting
- **Prettier** - Code formatting
- **Live Server** - Local development server
- **Path Intellisense** - Autocomplete paths
- **GitLens** - Git blame and history
- **Better Comments** - Highlight TODOs

### Command Line Tools

```bash
# Format JSON
echo '{"name":"KadaSkill"}' | jq

# Search codebase
grep -r "function loadUser" public/js/

# Count lines of code
find public/js -name "*.js" | xargs wc -l

# Check Git status
git status
```

---

## Resources

### Internal Documentation

- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DATABASE_README.md](./sql/DATABASE_README.md) - Database guide
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment steps

### External Resources

- [Supabase Docs](https://supabase.com/docs) - Backend documentation
- [MDN Web Docs](https://developer.mozilla.org/) - Web standards
- [JavaScript.info](https://javascript.info/) - JavaScript tutorials
- [CSS Tricks](https://css-tricks.com/) - CSS guides

---

## Getting Help

### Where to Ask

1. **GitHub Issues** - Bug reports and feature requests
2. **Team Chat** - Quick questions (Slack/Discord)
3. **Code Reviews** - Implementation questions
4. **Documentation** - Check docs first

### How to Ask

**Good Question**:
```
I'm trying to implement user profile editing, but I'm getting
a 403 error when updating the profile. I've checked the RLS
policies and the user is authenticated. Here's the code I'm using:

[code snippet]

What am I missing?
```

**Not Helpful**:
```
It doesn't work. Help!
```

---

## Next Steps

Now that you're set up:

1. ✅ **Read** [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system
2. ✅ **Review** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API patterns
3. ✅ **Pick** a GitHub issue labeled "good first issue"
4. ✅ **Code** and submit your first PR!

---

**Last Updated**: 2025-12-18
**Version**: 1.0.0

**Questions?** Open an issue or reach out to the team!
