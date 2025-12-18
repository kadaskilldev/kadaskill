# KadaSkill Testing Guide

## Overview

This document outlines testing strategies, methodologies, and best practices for the KadaSkill platform.

---

## Testing Strategy

### Current State

KadaSkill currently relies on **manual testing**. This guide provides:
- Manual testing procedures
- Future automated testing recommendations
- Test case templates

---

## Manual Testing

### Test Environment Setup

1. **Local Environment**:
```bash
bun run dev
open http://localhost:3000
```

2. **Test Accounts**:
   - Regular user: `testuser@example.com`
   - Admin user: `admin@example.com`

3. **Test Data**:
   - Use Supabase seed data
   - Create test courses, users, exercises

---

### Manual Test Cases

#### Authentication Tests

**Test 1: Sign Up (Email/Password)**

Steps:
1. Navigate to `/index.html`
2. Click "Sign Up"
3. Enter:
   - Email: `newuser@test.com`
   - Password: `Test123!`
   - Full Name: `Test User`
   - Username: `testuser123`
4. Submit form

Expected Result:
- ✅ User account created
- ✅ Profile automatically created in database
- ✅ Redirected to dashboard (`/home.html`)
- ✅ Welcome message displays user's name

**Test 2: Login (Email/Password)**

Steps:
1. Navigate to `/index.html`
2. Enter credentials
3. Click "Sign In"

Expected Result:
- ✅ User authenticated
- ✅ Redirected to dashboard
- ✅ Session stored in sessionStorage

**Test 3: OAuth Login**

Steps:
1. Click "Sign in with Google"
2. Complete OAuth flow

Expected Result:
- ✅ User authenticated via provider
- ✅ Profile created if new user
- ✅ Redirected to dashboard

**Test 4: Logout**

Steps:
1. Click avatar → "Sign Out"

Expected Result:
- ✅ Session cleared
- ✅ Redirected to login page
- ✅ Cannot access protected pages

---

#### Course Tests

**Test 5: Browse Courses**

Steps:
1. Navigate to `/learn.html`
2. View course catalog

Expected Result:
- ✅ All published courses displayed
- ✅ Filters work (category, level)
- ✅ Search functionality works

**Test 6: Enroll in Course**

Steps:
1. Click course card
2. Click "Enroll Now"

Expected Result:
- ✅ Enrollment record created
- ✅ Course appears on dashboard
- ✅ Cannot enroll twice

**Test 7: Take Course**

Steps:
1. Navigate to enrolled course
2. Click lesson
3. Watch video
4. Complete lesson

Expected Result:
- ✅ Video plays correctly
- ✅ Progress tracked
- ✅ XP awarded
- ✅ Next lesson unlocked

---

#### Practice Exercise Tests

**Test 8: Start Exercise**

Steps:
1. Navigate to `/practice.html`
2. Select exercise
3. Click "Start"

Expected Result:
- ✅ Exercise loads
- ✅ Problem statement displayed
- ✅ Code editor available

**Test 9: Submit Solution**

Steps:
1. Write solution code
2. Click "Submit"

Expected Result:
- ✅ Code executed
- ✅ Test results shown
- ✅ XP awarded if all tests pass

---

#### Profile Tests

**Test 10: View Profile**

Steps:
1. Navigate to `/profile.html`

Expected Result:
- ✅ User info displayed correctly
- ✅ Stats accurate (XP, streak, level)
- ✅ Enrolled courses shown
- ✅ Badges displayed

**Test 11: Edit Profile**

Steps:
1. Click "Edit Profile"
2. Update bio and skills
3. Save changes

Expected Result:
- ✅ Changes saved to database
- ✅ Profile updated immediately
- ✅ Success notification shown

**Test 12: Upload Profile Picture**

Steps:
1. Click "Change Picture"
2. Select image file
3. Upload

Expected Result:
- ✅ Image uploaded to Supabase Storage
- ✅ Avatar URL updated in profile
- ✅ New avatar displayed

---

#### Admin Tests

**Test 13: Access Admin Panel**

Steps:
1. Login as admin user
2. Navigate to `/admin.html`

Expected Result:
- ✅ Admin panel accessible
- ✅ Dashboard loads with metrics
- ✅ Non-admin users cannot access

**Test 14: Create Course**

Steps:
1. Go to Courses section
2. Click "Add New Course"
3. Fill form and submit

Expected Result:
- ✅ Course created in database
- ✅ Appears in course list
- ✅ Can add lessons to course

**Test 15: Manage Users**

Steps:
1. Go to Users section
2. Search for user
3. View user details

Expected Result:
- ✅ User list loads
- ✅ Search works
- ✅ Can view user profile

---

### Cross-Browser Testing

Test on:
- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (latest)
- [ ] **Edge** (latest)

**Check**:
- Page layouts render correctly
- JavaScript executes without errors
- Authentication works
- Forms submit properly

---

### Responsive Design Testing

**Breakpoints**:
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1199px
- **Desktop**: 1200px+

**Test Devices**:
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- iPad (768px)
- Desktop (1920px)

**Check**:
- [ ] Navigation collapses on mobile
- [ ] Course cards stack properly
- [ ] Forms are usable
- [ ] Buttons are tappable (min 44x44px)
- [ ] Text is readable
- [ ] No horizontal scroll

---

### Performance Testing

#### Page Load Speed

**Tool**: Lighthouse (Chrome DevTools)

**Metrics**:
- First Contentful Paint < 1.8s
- Largest Contentful Paint < 2.5s
- Time to Interactive < 3.8s

**Test**:
```bash
# Run Lighthouse
# Chrome DevTools → Lighthouse → Generate report
```

#### Database Query Performance

**Check query execution time in Supabase**:
1. Dashboard → Logs → API Logs
2. Identify slow queries (> 100ms)
3. Add indexes if needed

---

### Accessibility Testing

**WCAG 2.1 Compliance**

**Tools**:
- Axe DevTools (browser extension)
- WAVE (web accessibility evaluation tool)
- Lighthouse accessibility audit

**Manual Checks**:
- [ ] All images have `alt` text
- [ ] Form inputs have `<label>` elements
- [ ] Buttons have descriptive `aria-label`
- [ ] Color contrast meets AA standard (4.5:1)
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Screen reader compatible

**Keyboard Navigation Test**:
1. Tab through all interactive elements
2. Press Enter to activate buttons
3. Use arrow keys in dropdowns
4. Press Esc to close modals

---

### Security Testing

**Manual Security Checks**:

**Test 1: SQL Injection** (should be prevented by Supabase)
- Try injecting SQL in search boxes
- Expected: Parameterized queries prevent injection

**Test 2: XSS** (Cross-Site Scripting)
- Enter `<script>alert('XSS')</script>` in text fields
- Expected: Sanitized, script doesn't execute

**Test 3: Unauthorized Access**
- Try accessing `/admin.html` without admin role
- Try accessing other users' data via direct API calls
- Expected: RLS policies block unauthorized access

**Test 4: Authentication Bypass**
- Access protected pages without login
- Expected: Redirected to login page

---

## Automated Testing (Future Recommendation)

### Unit Testing

**Framework**: Jest or Vitest

**Example Test**:
```javascript
// tests/utils.test.js
import { calculateLevel } from '../public/js/utils';

describe('calculateLevel', () => {
    test('returns level 1 for 0 XP', () => {
        expect(calculateLevel(0)).toBe(1);
    });

    test('returns level 10 for 10,000 XP', () => {
        expect(calculateLevel(10000)).toBe(10);
    });
});
```

---

### Integration Testing

**Framework**: Playwright or Cypress

**Example Test**:
```javascript
// tests/auth.spec.js
import { test, expect } from '@playwright/test';

test('user can sign up and login', async ({ page }) => {
    // Navigate to signup
    await page.goto('http://localhost:3000');
    await page.click('text=Sign Up');

    // Fill signup form
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'Test123!');
    await page.fill('#fullName', 'Test User');
    await page.fill('#username', 'testuser');

    // Submit
    await page.click('button[type=submit]');

    // Verify redirect to dashboard
    await expect(page).toHaveURL(/.*home.html/);
});
```

---

### E2E Testing

**Framework**: Cypress

**Example Test**:
```javascript
// cypress/e2e/course-enrollment.cy.js
describe('Course Enrollment Flow', () => {
    beforeEach(() => {
        // Login
        cy.visit('/index.html');
        cy.login('test@example.com', 'password');
    });

    it('enrolls in a course', () => {
        // Go to learn page
        cy.visit('/learn.html');

        // Find and click course
        cy.contains('Python Fundamentals').click();
        cy.contains('Enroll Now').click();

        // Verify enrollment
        cy.visit('/home.html');
        cy.contains('Python Fundamentals').should('exist');
    });
});
```

---

## Bug Reporting Template

When reporting bugs, include:

```markdown
### Bug Description
Brief description of the issue

### Steps to Reproduce
1. Navigate to page X
2. Click button Y
3. Observe error

### Expected Behavior
What should happen

### Actual Behavior
What actually happens

### Screenshots
[Attach screenshots]

### Environment
- Browser: Chrome 120
- OS: macOS 14
- User Role: Admin/Regular

### Console Errors
[Paste any console errors]

### Additional Context
Any other relevant information
```

---

## Test Data Management

### Creating Test Data

**Via Supabase Dashboard**:
1. Go to Table Editor
2. Insert test records manually

**Via SQL**:
```sql
-- Insert test user
INSERT INTO profiles (id, username, full_name, total_xp)
VALUES
('test-user-id', 'testuser', 'Test User', 5000);

-- Insert test course
INSERT INTO courses (title, slug, category, level, is_published)
VALUES
('Test Course', 'test-course', 'AI', 'Beginner', true);
```

### Cleaning Test Data

```sql
-- Delete test users
DELETE FROM profiles WHERE username LIKE 'test%';

-- Delete test courses
DELETE FROM courses WHERE slug LIKE 'test-%';
```

---

## CI/CD Testing

### GitHub Actions Example

```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Run unit tests
        run: bun test

      - name: Run E2E tests
        run: bun run test:e2e
```

---

## Testing Checklist

Before each release:

### Functionality
- [ ] Authentication (signup, login, logout, OAuth)
- [ ] Course browsing and enrollment
- [ ] Lesson completion and progress tracking
- [ ] Practice exercise submission
- [ ] Certification tracking
- [ ] Profile editing
- [ ] Admin panel operations

### Performance
- [ ] Page load times < 3s
- [ ] Database queries < 100ms
- [ ] Image loading optimized

### Security
- [ ] RLS policies active
- [ ] No exposed secrets
- [ ] Authentication required for protected routes
- [ ] XSS prevention tested

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets standards

### Responsive Design
- [ ] Mobile (320px-767px)
- [ ] Tablet (768px-1199px)
- [ ] Desktop (1200px+)

### Cross-Browser
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## Related Documentation

- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Development workflow
- [SECURITY.md](./SECURITY.md) - Security testing

---

**Last Updated**: 2025-12-18
**Version**: 1.0.0
