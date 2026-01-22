# KadaSkill User Guide

## Welcome to KadaSkill! 🎓

**Empowering Tomorrow's Tech Leaders Through Microlearning Excellence**

---

## Introduction

Welcome to KadaSkill, a cutting-edge microlearning platform designed and built by **Diskartech Solutions Inc.** that fuses the Filipino "barkada" (community) spirit with evidence-based microlearning methodologies. KadaSkill is specifically crafted to deliver bite-sized, high-impact learning experiences in Cloud Computing, Artificial Intelligence, and Cybersecurity.

Our platform empowers Diskartech consultants and tech professionals to stay competitive and future-ready through flexible, engaging, and measurable learning experiences that fit seamlessly into busy professional schedules.

---

## Purpose of This Manual

This comprehensive user guide serves as your complete reference for navigating and maximizing the KadaSkill learning ecosystem. Whether you're a:

- **🎓 Learner** seeking to upskill in cutting-edge technologies
- **👨‍🏫 Administrator** managing content and user experiences
- **📊 Manager** tracking team progress and engagement

This manual will guide you through every feature, functionality, and best practice to ensure you get the most value from the KadaSkill platform.

---

## System Overview

### 🌟 **What is KadaSkill?**

KadaSkill is a comprehensive learning management system (LMS) that transforms traditional training into engaging, bite-sized learning experiences. Built on modern web technologies and powered by Supabase, our platform delivers:

### 🎯 **Core Learning Domains**
- **☁️ Cloud Computing**: AWS, Azure, Google Cloud, DevOps, Infrastructure
- **🤖 Artificial Intelligence**: Machine Learning, Deep Learning, Data Science, MLOps
- **🔒 Cybersecurity**: Security+, Ethical Hacking, Network Security, Compliance

### 🚀 **Platform Capabilities**

#### **For Learners:**
- **📚 Interactive Courses**: Video lessons, text content, and hands-on exercises
- **🎮 Gamified Learning**: XP system, badges, ranks, and achievement streaks
- **💻 Practice Exercises**: Timed quizzes, coding challenges, and knowledge assessments
- **🏆 Certification Paths**: Study guides for industry-standard certifications
- **📊 Progress Tracking**: Detailed analytics on learning journey and performance
- **👥 Social Learning**: Leaderboards, following system, and community features

#### **For Administrators:**
- **🛠️ Content Management**: Advanced course editor with multimedia support
- **👤 User Management**: Comprehensive user administration and role management
- **📈 Analytics Dashboard**: Real-time insights into platform usage and learning outcomes
- **🎯 Practice Exercise Management**: Create and manage assessments and challenges
- **🏅 Certification Management**: Organize and track certification programs
- **🔧 System Administration**: Platform configuration and security management

### 🎲 **Gamification System**
- **⚡ Experience Points (XP)**: Earned through course completion, exercises, and daily engagement
- **🏅 Dynamic Badge System**: Bronze to Diamond tier achievements with auto-awarding
- **📊 Rank Progression**: From Beginner to Master based on accumulated XP
- **🔥 Streak Tracking**: Daily learning streaks with bonus rewards
- **🏆 Leaderboards**: Global and peer comparisons to drive engagement

### 🏗️ **Technical Architecture**
- **Frontend**: Modern HTML5, CSS3, and JavaScript with responsive design
- **Backend**: Node.js with Express.js server architecture
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Authentication**: Secure OAuth integration with multiple providers
- **Hosting**: Scalable cloud infrastructure with CDN support

---

## Table of Contents

### For Learners
1. [Getting Started](#getting-started-learners)
2. [Dashboard Overview](#dashboard-overview)
3. [Browsing & Enrolling in Courses](#browsing--enrolling-in-courses)
4. [Taking Courses](#taking-courses)
5. [Practice Exercises](#practice-exercises)
6. [Certifications](#certifications)
7. [Profile Management](#profile-management)
8. [Gamification System](#gamification-system)

### For Administrators
9. [Admin Access](#admin-access)
10. [User Management](#user-management)
11. [Course Management](#course-management)
12. [Certification Management](#certification-management)
13. [Practice Exercise Management](#practice-exercise-management)
14. [Analytics Dashboard](#analytics-dashboard)

---

## For Learners

### Getting Started (Learners)

#### Creating an Account

1. **Visit KadaSkill** at your domain
2. **Click "Sign Up"** on the homepage
3. **Choose sign-up method**:
   - **Email/Password**: Enter email, password, full name, and username
   - **OAuth**: Sign in with Google, Microsoft, Facebook, or LinkedIn
4. **Verify your email** (if using email/password)
5. **Complete your profile**

#### First Login

After signing up:
1. You'll be redirected to your **Dashboard** (home.html)
2. Your profile is automatically created with 0 XP
3. Start exploring courses!

---

### Dashboard Overview

Your dashboard (`home.html`) shows:

#### Sidebar
- **Profile Info**: Avatar, username, level, and rank
- **Stats**:
  - Total XP
  - Current streak (days)
  - Courses completed
- **Navigation**: Quick links to all pages

#### Main Content
- **Welcome Message**: Personalized greeting
- **Continue Learning**: Resume your current course
- **Practice Exercises**: Quick access to exercises
- **Recent Badges**: Badges you've earned
- **Leaderboard**: Top learners

---

### Browsing & Enrolling in Courses

#### Navigate to Course Catalog

1. Click **"Learn"** in navigation
2. Browse courses by:
   - **Category**: AI, Cybersecurity, Cloud
   - **Level**: Beginner, Intermediate, Advanced, Expert
   - **Search**: Type keywords in search bar

#### Course Information

Each course card shows:
- Course title and description
- Category and level
- Duration (estimated hours)
- XP reward
- Enrollment count
- **Enroll button**

#### Enrolling in a Course

1. Click on a course card
2. Review course details
3. Click **"Enroll Now"**
4. Course appears in your Dashboard
5. Start learning immediately!

---

### Taking Courses

#### Course Player

After enrolling:
1. Click **"Continue"** on course from Dashboard
2. Or navigate to **Learn → Your Courses → Select Course**
3. Course player (`learning.html`) displays:
   - **Sidebar**: Lesson list with progress indicators
   - **Video Player**: Lesson video content
   - **Lesson Content**: Text, code samples, resources
   - **Quiz** (if available): Test your knowledge

#### Progress Tracking

- Progress bar shows completion percentage
- Green checkmarks indicate completed lessons
- Current lesson is highlighted
- XP is awarded for completing lessons

#### Completing a Course

- Finish all lessons
- Pass all quizzes (if required)
- Receive completion badge
- XP awarded to your profile

---

### Practice Exercises

#### Accessing Exercises

1. Click **"Practice"** in navigation
2. Browse exercises by:
   - Category (AI, Cybersecurity, Cloud)
   - Difficulty (Easy, Medium, Hard)
   - Skill tags

#### Exercise Interface

Each exercise shows:
- Problem description
- Difficulty level
- Estimated time
- XP reward
- Tags (skills practiced)

#### Solving Exercises

1. Click **"Start Exercise"**
2. Read problem statement
3. Write your solution in the code editor
4. Click **"Submit"**
5. View test results
6. Earn XP if all tests pass

#### Exercise Types

- **Coding Challenges**: Write code to solve problems
- **Multiple Choice**: Answer questions
- **Debugging**: Fix broken code

---

### Certifications

#### Certification Catalog

1. Click **"Certifications"** in navigation
2. View available certifications in:
   - AI (Machine Learning, Deep Learning, etc.)
   - Cybersecurity (Security+, CEH, etc.)
   - Cloud (AWS, Azure, Google Cloud)

#### Certification Details

Each certification shows:
- Provider (AWS, Microsoft, Google, CompTIA, etc.)
- Level (Foundation, Associate, Professional, Expert)
- Estimated duration
- Prerequisites
- Study resources
- Official exam information

#### Starting a Certification Path

1. Click on certification card
2. Review details and prerequisites
3. Click **"Start Learning"**
4. Access:
   - Study guide
   - Recommended courses
   - Practice exams
   - External resources

#### Tracking Progress

- Progress bar shows study completion
- Recommended courses marked as you complete them
- Practice exercises linked to certification
- Study resources checklist

---

### Profile Management

#### Viewing Your Profile

1. Click your **avatar** in top-right
2. Select **"Profile"** from dropdown
3. View:
   - Username and full name
   - Bio
   - Level and rank badge
   - Total XP
   - Current streak
   - Skills
   - Enrolled courses
   - Earned badges
   - Certifications in progress

#### Editing Your Profile

1. From profile page, click **"Edit Profile"**
2. Update:
   - Full name
   - Bio (describe yourself)
   - Skills (add/remove skill tags)
   - Profile picture
3. Click **"Save Changes"**

#### Uploading Profile Picture

1. Click **"Edit Profile"**
2. Click on avatar or **"Change Picture"**
3. Select image file (JPG, PNG)
4. Image uploads to profile
5. Click **"Save"**

---

### Gamification System

#### XP (Experience Points)

Earn XP by:
- Completing lessons: 25-50 XP
- Finishing courses: 500 XP
- Solving practice exercises: 50-150 XP
- Daily login: 10 XP
- Streak bonuses: 5 XP per day

**Level Calculation**: Level = √(Total XP / 100)

Examples:
- 1,000 XP = Level 3
- 10,000 XP = Level 10
- 40,000 XP = Level 20

#### Ranks

Based on your level:
- **Beginner**: Level 1-5
- **Intermediate**: Level 6-10
- **Advanced**: Level 11-15
- **Expert**: Level 16-20
- **Master**: Level 21+

#### Badges

Earn badges for achievements:

**XP Milestones**:
- 1,000 XP, 5,000 XP, 10,000 XP, 25,000 XP, 50,000 XP

**Course Completion**:
- Complete 1, 5, 10, 25, 50 courses

**Streak Achievements**:
- 7-day, 30-day, 100-day, 365-day streaks

**Skill Mastery**:
- Master specific skill categories

**Badge Tiers**:
- Bronze
- Silver
- Gold
- Platinum
- Diamond

#### Streaks

Maintain a daily learning streak:
- Log in daily
- Complete at least one activity
- Streak increases each consecutive day
- Resets if a day is missed
- Bonus XP for long streaks

#### Leaderboard

View global rankings:
- Top 10 learners
- Your personal rank
- Users near your rank
- Rankings based on total XP

---

## For Administrators

### Admin Access

#### Accessing Admin Panel

1. Log in with admin account
2. Your profile must have `is_admin = true` flag
3. Navigate to `/admin.html`
4. Or click **"Admin"** in navigation (if visible)

**Security**: Only users with admin flag can access admin panel. Database Row Level Security enforces this.

---

### User Management

#### Viewing Users

1. Navigate to **Admin Panel → Users**
2. View all registered users:
   - Username
   - Email
   - Registration date
   - XP and level
   - Status (active/inactive)
   - Admin status

#### Search and Filter

- **Search**: By username or email
- **Filter by Role**: All, Admins, Regular users
- **Filter by Status**: All, Active, Inactive

#### User Actions

- **View Details**: Click on user to see full profile
- **Promote to Admin**: Grant admin privileges
- **Demote from Admin**: Remove admin privileges
- **Suspend User**: Temporarily disable account
- **Delete User**: Permanently remove user (use with caution)

---

### Course Management

#### Viewing Courses

1. Navigate to **Admin Panel → Courses**
2. View all courses:
   - Title and description
   - Category and level
   - Enrollment count
   - Published status
   - Creation date

#### Creating a Course

1. Click **"Add New Course"**
2. Fill in details:
   - **Title**: Course name
   - **Slug**: URL-friendly identifier
   - **Description**: Detailed description
   - **Short Description**: Brief summary
   - **Category**: AI, Cybersecurity, or Cloud
   - **Level**: Beginner, Intermediate, Advanced, Expert
   - **Duration**: Estimated hours
   - **XP Reward**: Points awarded
   - **Thumbnail**: Course image URL
   - **Published**: Make visible to users
3. Click **"Create Course"**
4. Add lessons to course

#### Editing a Course

1. Find course in list
2. Click **"Edit"** button
3. Modify any field
4. Click **"Save Changes"**

#### Adding Lessons

1. Open course editor
2. Click **"Add Lesson"**
3. Fill in:
   - Lesson title
   - Content (text, markdown)
   - Video URL (YouTube, Vimeo, etc.)
   - Order/sequence
   - Duration
4. Save lesson

#### Deleting a Course

1. Click **"Delete"** on course
2. Confirm deletion
3. **Warning**: This removes all lessons and unenrolls users

---

### Certification Management

#### Managing Certifications

1. Navigate to **Admin Panel → Certifications**
2. View all certification programs
3. **Add New**: Create certification
4. **Edit**: Modify details
5. **Delete**: Remove certification

#### Certification Fields

- Title and provider
- Category and level
- Exam code
- Estimated study duration
- Prerequisites
- Study resources (URLs, books)
- Official certification URL
- Active status

#### Bulk Actions

- Select multiple certifications
- Mark as active/inactive
- Delete multiple at once

---

### Practice Exercise Management

#### Managing Exercises

1. Navigate to **Admin Panel → Practice**
2. View all practice exercises
3. Filter by category and difficulty

#### Creating an Exercise

1. Click **"Add New Exercise"**
2. Fill in:
   - **Title**: Exercise name
   - **Description**: Problem statement
   - **Category**: AI, Cybersecurity, Cloud
   - **Difficulty**: Easy, Medium, Hard
   - **Skill Tags**: Skills practiced
   - **Starter Code**: Initial code template
   - **Solution Code**: Reference solution
   - **Test Cases**: Input/output pairs
   - **XP Reward**: Points for solving
   - **Time Estimate**: Minutes to complete
3. Click **"Create Exercise"**

#### Exercise Submissions

View user submissions:
- Submitted code
- Test results (pass/fail)
- Execution time
- Timestamp

---

### Analytics Dashboard

#### Overview Metrics

Admin dashboard shows:
- **Total Users**: All registered users
- **Active Users**: Users active in last 30 days
- **Total Courses**: All courses in catalog
- **Total Enrollments**: Sum of all enrollments
- **Completion Rate**: % of completed enrollments
- **Average XP**: Mean XP across all users

#### Engagement Charts

**User Engagement Over Time**:
- Daily/weekly/monthly active users
- Sign-up trends
- Peak usage times

**Course Popularity**:
- Most enrolled courses
- Highest completion rates
- Category distribution

**Practice Activity**:
- Exercise attempts
- Success rates
- Popular exercises

#### Leaderboard

View top users by:
- Total XP
- Courses completed
- Badges earned
- Current streak

---

## Tips & Best Practices

### For Learners

✅ **Set Daily Goals**: Maintain streaks for bonus XP
✅ **Complete Quizzes**: Test your understanding
✅ **Practice Regularly**: Solve at least one exercise daily
✅ **Update Skills**: Add new skills as you learn
✅ **Join the Leaderboard**: Compete with peers

### For Admins

✅ **Keep Content Fresh**: Add new courses regularly
✅ **Monitor User Feedback**: Address issues promptly
✅ **Update Resources**: Keep certification materials current
✅ **Review Analytics**: Identify popular content
✅ **Backup Data**: Supabase handles this automatically

---

## Troubleshooting

### Common Issues

**Q: I can't log in**
A: Reset your password or clear browser cache

**Q: Course won't load**
A: Check internet connection, refresh page

**Q: XP not updating**
A: Refresh dashboard, XP updates are real-time

**Q: Profile picture not uploading**
A: Ensure image is under 5MB, supported formats: JPG, PNG

**Q: Admin panel not accessible**
A: Contact system administrator to verify admin status

---

## Getting Support

**Technical Issues**:
- Check browser console for errors
- Clear cache and cookies
- Try different browser

**Account Issues**:
- Email: support@kadaskill.com
- Contact admin via platform

**Feature Requests**:
- Submit via feedback form
- Contact development team

---

## Keyboard Shortcuts

- `Alt + H` - Go to Dashboard
- `Alt + L` - Go to Learn
- `Alt + P` - Go to Practice
- `Alt + C` - Go to Certifications
- `Alt + R` - Go to Profile
- `Esc` - Close modals

---

**Last Updated**: 2025-12-18
**Version**: 1.0.0

**Happy Learning!** 🚀
