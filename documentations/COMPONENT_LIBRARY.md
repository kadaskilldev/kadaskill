# KadaSkill Component Library

## Overview

This document describes the reusable UI components used throughout the KadaSkill platform.

---

## Navigation Components

### Header Navigation

**File**: `public/js/components.js`

```html
<header class="site-header">
    <div class="container">
        <div class="logo">
            <img src="images/logo.png" alt="KadaSkill">
        </div>
        <nav class="main-nav">
            <a href="home.html" class="nav-link">Dashboard</a>
            <a href="learn.html" class="nav-link">Learn</a>
            <a href="practice.html" class="nav-link">Practice</a>
            <a href="certification.html" class="nav-link">Certifications</a>
        </nav>
        <div class="user-menu">
            <div class="user-profile__toggle" aria-expanded="false">
                <img src="avatar.jpg" class="user-avatar" alt="User">
            </div>
        </div>
    </div>
</header>
```

**Usage**:
```javascript
loadNavigation(); // Loads navigation from components
```

---

### Footer

```html
<footer class="site-footer">
    <div class="footer__content">
        <div class="footer__section">
            <h3>About KadaSkill</h3>
            <p>Learn AI, Cybersecurity, and Cloud skills</p>
        </div>
        <div class="footer__section">
            <h3>Quick Links</h3>
            <a href="about.html">About Us</a>
            <a href="contact.html">Contact</a>
        </div>
        <div class="footer__social">
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-linkedin"></i></a>
        </div>
    </div>
</footer>
```

---

## Card Components

### Course Card

**File**: `public/css/learn.css`

```html
<div class="course-card">
    <div class="course-card__image">
        <img src="course-thumbnail.jpg" alt="Course">
        <span class="course-card__badge">AI</span>
    </div>
    <div class="course-card__content">
        <h3 class="course-card__title">Python Fundamentals</h3>
        <p class="course-card__description">Learn Python from scratch</p>
        <div class="course-card__meta">
            <span class="course-card__level">Beginner</span>
            <span class="course-card__duration">20 hours</span>
        </div>
        <div class="course-card__footer">
            <span class="course-card__xp">500 XP</span>
            <button class="btn btn--primary">Enroll Now</button>
        </div>
    </div>
</div>
```

**CSS Classes**:
- `.course-card` - Container
- `.course-card__image` - Thumbnail section
- `.course-card__badge` - Category badge
- `.course-card__content` - Main content
- `.course-card__title` - Course title
- `.course-card__description` - Description text
- `.course-card__meta` - Level and duration
- `.course-card__footer` - XP and action button

---

### Certification Card

```html
<div class="cert-card">
    <div class="cert-card__header">
        <img src="cert-icon.png" alt="Certification" class="cert-card__icon">
        <span class="cert-card__provider">AWS</span>
    </div>
    <div class="cert-card__body">
        <h3 class="cert-card__title">AWS Cloud Practitioner</h3>
        <p class="cert-card__subtitle">Foundation Level</p>
        <div class="cert-card__details">
            <span>40 hours</span>
            <span>Foundation</span>
        </div>
    </div>
    <div class="cert-card__footer">
        <button class="btn btn--primary">Start Learning</button>
    </div>
</div>
```

---

### Practice Exercise Card

```html
<div class="exercise-card">
    <div class="exercise-card__header">
        <span class="exercise-card__difficulty exercise-card__difficulty--easy">Easy</span>
        <span class="exercise-card__xp">50 XP</span>
    </div>
    <div class="exercise-card__body">
        <h3 class="exercise-card__title">Python Loops Basics</h3>
        <p class="exercise-card__description">Practice for and while loops</p>
        <div class="exercise-card__tags">
            <span class="tag">Python</span>
            <span class="tag">Loops</span>
        </div>
    </div>
    <div class="exercise-card__footer">
        <span class="exercise-card__time">15 min</span>
        <button class="btn btn--secondary">Start Exercise</button>
    </div>
</div>
```

---

## Button Components

### Primary Button

```html
<button class="btn btn--primary">
    Click Me
</button>
```

**Variants**:
- `.btn--primary` - Main action (blue)
- `.btn--secondary` - Secondary action (gray)
- `.btn--success` - Success action (green)
- `.btn--danger` - Destructive action (red)
- `.btn--outline` - Outline style
- `.btn--disabled` - Disabled state

### Button with Icon

```html
<button class="btn btn--primary">
    <i class="fas fa-plus"></i>
    Add Course
</button>
```

---

## Form Components

### Text Input

```html
<div class="form-group">
    <label for="username" class="form-label">Username</label>
    <input
        type="text"
        id="username"
        class="form-input"
        placeholder="Enter username"
        required>
    <span class="form-error">Username is required</span>
</div>
```

### Textarea

```html
<div class="form-group">
    <label for="bio" class="form-label">Bio</label>
    <textarea
        id="bio"
        class="form-textarea"
        rows="4"
        placeholder="Tell us about yourself"></textarea>
</div>
```

### Select Dropdown

```html
<div class="form-group">
    <label for="category" class="form-label">Category</label>
    <select id="category" class="form-select">
        <option value="">Select category</option>
        <option value="AI">AI</option>
        <option value="Cybersecurity">Cybersecurity</option>
        <option value="Cloud">Cloud</option>
    </select>
</div>
```

---

## Modal Components

### Standard Modal

```html
<div class="modal" id="myModal">
    <div class="modal__overlay"></div>
    <div class="modal__content">
        <div class="modal__header">
            <h2 class="modal__title">Modal Title</h2>
            <button class="modal__close" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal__body">
            <p>Modal content goes here</p>
        </div>
        <div class="modal__footer">
            <button class="btn btn--secondary">Cancel</button>
            <button class="btn btn--primary">Confirm</button>
        </div>
    </div>
</div>
```

**JavaScript**:
```javascript
// Open modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.classList.add('modal-open');
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
}
```

---

## Loading Components

### Loading Screen

```html
<div class="loading-screen">
    <div class="loading-spinner">
        <div class="spinner"></div>
    </div>
    <p class="loading-text">Loading...</p>
</div>
```

### Inline Spinner

```html
<div class="spinner-inline">
    <div class="spinner-small"></div>
</div>
```

---

## Notification Components

### Toast Notification

```html
<div class="toast toast--success">
    <i class="fas fa-check-circle"></i>
    <span>Operation successful!</span>
</div>
```

**Variants**:
- `.toast--success` - Green (success)
- `.toast--error` - Red (error)
- `.toast--warning` - Yellow (warning)
- `.toast--info` - Blue (info)

**JavaScript**:
```javascript
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast--show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('toast--show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
```

---

## Badge Components

### XP Badge

```html
<span class="badge badge--xp">
    <i class="fas fa-star"></i>
    500 XP
</span>
```

### Level Badge

```html
<span class="badge badge--level">
    Level 5
</span>
```

### Status Badge

```html
<span class="badge badge--status badge--status--active">Active</span>
<span class="badge badge--status badge--status--completed">Completed</span>
<span class="badge badge--status badge--status--pending">Pending</span>
```

---

## Progress Components

### Progress Bar

```html
<div class="progress-bar">
    <div class="progress-bar__fill" style="width: 65%;"></div>
    <span class="progress-bar__text">65%</span>
</div>
```

**JavaScript**:
```javascript
function updateProgress(percentage) {
    const fill = document.querySelector('.progress-bar__fill');
    const text = document.querySelector('.progress-bar__text');

    fill.style.width = `${percentage}%`;
    text.textContent = `${percentage}%`;
}
```

---

## Table Components

### Data Table

```html
<table class="data-table">
    <thead>
        <tr>
            <th>Course</th>
            <th>Progress</th>
            <th>XP Earned</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Python Fundamentals</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-bar__fill" style="width: 75%;"></div>
                </div>
            </td>
            <td>375 XP</td>
            <td>
                <button class="btn btn--small">Continue</button>
            </td>
        </tr>
    </tbody>
</table>
```

---

## Utility Classes

### Spacing

```css
.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mt-4 { margin-top: 2rem; }

.mb-1 { margin-bottom: 0.5rem; }
/* ... similar for padding (pt, pb, pl, pr) */
```

### Text Alignment

```css
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
```

### Display

```css
.d-none { display: none; }
.d-block { display: block; }
.d-flex { display: flex; }
.d-grid { display: grid; }
```

---

**Last Updated**: 2025-12-18
**Version**: 1.0.0
