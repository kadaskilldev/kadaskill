// learn.js
// ============================================
// Learn Page - Database Integration
// Dynamically loads courses from Supabase with enrollment status
// ============================================

let allCourses = [];
let userEnrollments = [];
let currentCategory = 'all';
let currentUser = null;

// ============================================
// Initialize Page
// ============================================

document.addEventListener('DOMContentLoaded', async() => {
    await checkAuthentication();
    await loadUserProfile();
    // Streak tracking is now handled by home.js
    await loadUserEnrollments();
    await loadCourses();
    setupEventListeners();
});

// ============================================
// Check Authentication
// ============================================

async function checkAuthentication() {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.log('No user logged in');
            return;
        }

        currentUser = user;
    } catch (error) {
        console.error('Error checking authentication:', error);
    }
}

// ============================================
// Load User Profile
// ============================================

async function loadUserProfile() {
    if (!currentUser) return;

    try {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username, full_name, avatar_url, current_streak')
            .eq('id', currentUser.id)
            .single();

        if (profileError) {
            console.error('Error loading profile:', profileError);
            return;
        }

        // Update greeting
        const greetingName = document.querySelector('.highlight-name');
        if (greetingName) {
            greetingName.textContent = profile.full_name || profile.username || 'Learner';
        }

        // Update avatar
        const avatarImg = document.querySelector('.avatar-img');
        if (avatarImg && profile.avatar_url) {
            avatarImg.src = profile.avatar_url;
        }

        // Update streak
        const streakNumber = document.querySelector('.streak-number');
        if (streakNumber) {
            streakNumber.textContent = profile.current_streak || 0;
        }

    } catch (error) {
        console.error('Unexpected error loading profile:', error);
    }
}

// ============================================
// Load User Enrollments
// ============================================

async function loadUserEnrollments() {
    if (!currentUser) return;

    try {
        const { data: enrollments, error } = await supabase
            .from('enrollments')
            .select('course_id, status, progress_percentage')
            .eq('user_id', currentUser.id);

        if (error) {
            console.error('Error loading enrollments:', error);
            return;
        }

        userEnrollments = enrollments || [];

        console.log('📚 User Enrollments:', userEnrollments);
    } catch (error) {
        console.error('Error in loadUserEnrollments:', error);
    }
}

// ============================================
// Load Courses from Database
// ============================================

async function loadCourses() {
    try {
        const { data: courses, error } = await supabase
            .from('courses')
            .select('*')
            .eq('is_published', true)
            .order('category', { ascending: true })
            .order('difficulty', { ascending: true });

        if (error) {
            console.error('Error loading courses:', error);
            showError('Failed to load courses. Please refresh the page.');
            return;
        }

        allCourses = courses || [];

        // Check prerequisites for each course
        await checkCoursesPrerequisites();

        renderCourses(allCourses);
        updateCourseCount(allCourses.length);

    } catch (error) {
        console.error('Unexpected error loading courses:', error);
        showError('An unexpected error occurred.');
    }
}

// ============================================
// Check Prerequisites for All Courses
// Uses ONLY Learning Path prerequisites (no difficulty-based fallback)
// ============================================

async function checkCoursesPrerequisites() {
    if (!currentUser) {
        // Mark all courses as accessible if not logged in
        allCourses.forEach(course => {
            course.prerequisitesMet = true;
            course.isLocked = false;
        });
        return;
    }

    // Get all completed courses (status = 'completed' AND progress = 100%)
    const completedCourseIds = userEnrollments
        .filter(e => e.status === 'completed' && e.progress_percentage === 100)
        .map(e => e.course_id);

    console.log('✅ Completed Course IDs:', completedCourseIds);

    // Check each course - ONLY using Learning Path prerequisites
    for (const course of allCourses) {
        try {
            // Check if course has prerequisites from learning paths
            if (course.prerequisites && course.prerequisites.length > 0) {
                const prerequisiteIds = typeof course.prerequisites === 'string' ?
                    JSON.parse(course.prerequisites) :
                    course.prerequisites;

                if (Array.isArray(prerequisiteIds) && prerequisiteIds.length > 0) {
                    // Check if all prerequisites are completed
                    const allMet = prerequisiteIds.every(prereqId =>
                        completedCourseIds.includes(prereqId)
                    );

                    course.prerequisitesMet = allMet;
                    course.isLocked = !allMet;

                    // Get unmet prerequisite details for display
                    if (!allMet) {
                        const unmetPrereqIds = prerequisiteIds.filter(id => !completedCourseIds.includes(id));

                        const { data: unmetCourses } = await supabase
                            .from('courses')
                            .select('id, title, slug')
                            .in('id', unmetPrereqIds);

                        course.unmetPrerequisites = unmetCourses || [];
                    }

                    console.log(`🔒 Course "${course.title}" - Locked: ${course.isLocked} (Learning Path Prerequisites)`);
                    continue;
                }
            }

            // No prerequisites set - course is unlocked
            course.prerequisitesMet = true;
            course.isLocked = false;
            console.log(`🟢 Course "${course.title}" - Unlocked (No Prerequisites)`);

        } catch (error) {
            console.error('Error checking prerequisites for course:', course.id, error);
            // On error, unlock the course (fail open)
            course.prerequisitesMet = true;
            course.isLocked = false;
        }
    }
}

// ============================================
// Render Courses to Grid
// ============================================

function renderCourses(courses) {
    const coursesGrid = document.getElementById('courses-grid');

    if (!coursesGrid) {
        console.error('Courses grid element not found');
        return;
    }

    if (courses.length === 0) {
        coursesGrid.innerHTML = `
            <div class="no-courses-message">
                <i class="fas fa-book" style="font-size: 48px; color: #666; margin-bottom: 16px;"></i>
                <p style="color: #666; font-size: 18px;">No courses found</p>
            </div>
        `;
        return;
    }

    // Separate enrolled and not enrolled courses
    const enrolledCourses = courses.filter(course =>
        userEnrollments.some(e => e.course_id === course.id)
    );

    const notEnrolledCourses = courses.filter(course =>
        !userEnrollments.some(e => e.course_id === course.id)
    );

    let html = '';

    // Render enrolled courses first if any
    if (enrolledCourses.length > 0) {
        html += `
            <div class="course-section-header">
                <h3 class="section-subtitle">
                    <i class="fas fa-book-reader"></i> Enrolled Courses
                </h3>
            </div>
        `;
        html += enrolledCourses.map(course => createCourseCard(course, true)).join('');
    }

    // Render not enrolled courses
    if (notEnrolledCourses.length > 0) {
        html += `
            <div class="course-section-header">
                <h3 class="section-subtitle">
                    <i class="fas fa-compass"></i> Available Courses
                </h3>
            </div>
        `;
        html += notEnrolledCourses.map(course => createCourseCard(course, false)).join('');
    }

    coursesGrid.innerHTML = html;
}

// ============================================
// Create Course Card HTML
// ============================================

function createCourseCard(course, isEnrolled) {
    const categoryClass = course.category.toLowerCase().replace(/\s+/g, '-');
    const difficultyClass = course.difficulty.toLowerCase();
    const duration = formatDuration(course.duration_hours);
    const description = course.short_description || course.description || 'Learn essential skills and concepts.';

    const enrollment = userEnrollments.find(e => e.course_id === course.id);
    const progress = enrollment ? enrollment.progress_percentage : 0;

    const isLocked = course.isLocked || false;

    let buttonHtml = '';
    let lockBadge = '';

    if (isLocked) {
        lockBadge = '<div class="course-locked-badge"><i class="fas fa-lock"></i> Locked</div>';
        buttonHtml = `
            <button class="course-card-btn locked" onclick="showPrerequisitesModal('${course.id}')">
                <i class="fas fa-lock"></i> Prerequisites Required
            </button>
        `;
    } else if (isEnrolled) {
        buttonHtml = `
            <button class="course-card-btn enrolled" onclick="continueCourse('${course.slug}')">
                Continue
            </button>
        `;
    } else {
        buttonHtml = `
            <button class="course-card-btn" onclick="enrollInCourse('${course.slug}')">
                <i class="fas fa-graduation-cap"></i> Enroll
            </button>
        `;
    }

    return `
        <div class="course-card ${isLocked ? 'locked' : ''}" data-category="${categoryClass}">
            ${lockBadge}
            <div class="course-card-image">
                <img src="${course.thumbnail_url || '/images/courses/default.jpg'}"
                     alt="${course.title}"
                     onerror="this.style.display='none';">
                <div class="course-badge ${difficultyClass}">${course.difficulty}</div>
            </div>
            <div class="course-card-content">
                <h3 class="course-card-title">${course.title}</h3>
                <p class="course-card-description">${truncateText(description, 100)}</p>
                <div class="course-card-footer">
                    <span class="course-duration">
                        <i class="fas fa-clock"></i> ${duration}
                    </span>
                    ${buttonHtml}
                </div>
            </div>
        </div>
    `;
}

// ============================================
// Helper Functions
// ============================================

function formatDuration(hours) {
    if (!hours) return 'Self-paced';

    if (hours < 1) {
        const minutes = Math.round(hours * 60);
        return `${minutes} minutes`;
    }

    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    if (minutes === 0) {
        return `${wholeHours} ${wholeHours === 1 ? 'hour' : 'hours'}`;
    }

    return `${wholeHours} hours ${minutes} minutes`;
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

function updateCourseCount(count) {
    const countElement = document.getElementById('course-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

function showError(message) {
    const coursesGrid = document.getElementById('courses-grid');
    if (coursesGrid) {
        coursesGrid.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-exclamation-circle" style="font-size: 48px; color: #ff4444; margin-bottom: 16px;"></i>
                <p style="color: #666; font-size: 18px;">${message}</p>
                <button onclick="location.reload()" class="course-card-btn" style="margin-top: 16px;">
                    Refresh Page
                </button>
            </div>
        `;
    }
}

// ============================================
// Course Enrollment - Redirect to Enroll Page
// ============================================

function enrollInCourse(courseSlug) {
    if (!currentUser) {
        alert('Please log in to enroll in courses.');
        window.location.href = 'index.html#login';
        return;
    }

    // Redirect to enrollment page
    window.location.href = `enroll.html?course=${courseSlug}`;
}

// Make it global
window.enrollInCourse = enrollInCourse;

// ============================================
// Continue Course - Direct to Learning Page
// ============================================

function continueCourse(courseSlug) {
    window.location.href = `learning.html?course=${courseSlug}`;
}

window.continueCourse = continueCourse;

// ============================================
// Show Prerequisites Modal
// ============================================

function showPrerequisitesModal(courseId) {
    const course = allCourses.find(c => c.id === courseId);

    if (!course || !course.unmetPrerequisites) return;

    const prerequisitesText = course.unmetPrerequisites
        .map(p => p.title)
        .join(', ');

    alert(`This course requires: ${prerequisitesText}`);
}

window.showPrerequisitesModal = showPrerequisitesModal;

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Category filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab-btn');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter courses
            const category = tab.dataset.category;
            currentCategory = category;
            filterCourses(category);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('course-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            searchCourses(searchTerm);
        });
    }
}

// ============================================
// Filter & Search Functions
// ============================================

function filterCourses(category) {
    let filteredCourses = allCourses;

    if (category !== 'all') {
        filteredCourses = allCourses.filter(course =>
            course.category.toLowerCase().replace(/\s+/g, '-') === category ||
            course.category.toLowerCase() === category
        );
    }

    renderCourses(filteredCourses);
    updateCourseCount(filteredCourses.length);
}

function searchCourses(searchTerm) {
    if (!searchTerm) {
        filterCourses(currentCategory);
        return;
    }

    let coursesToSearch = allCourses;

    // Apply category filter first if not 'all'
    if (currentCategory !== 'all') {
        coursesToSearch = allCourses.filter(course =>
            course.category.toLowerCase().replace(/\s+/g, '-') === currentCategory ||
            course.category.toLowerCase() === currentCategory
        );
    }

    // Then apply search
    const searchResults = coursesToSearch.filter(course =>
        course.title.toLowerCase().includes(searchTerm) ||
        (course.description && course.description.toLowerCase().includes(searchTerm)) ||
        (course.short_description && course.short_description.toLowerCase().includes(searchTerm))
    );

    renderCourses(searchResults);
    updateCourseCount(searchResults.length);
}

// ============================================
// Inject Additional Styles
// ============================================

(function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .course-section-header {
            grid-column: 1 / -1;
            margin-top: 24px;
            margin-bottom: 8px;
        }
        
        .section-subtitle {
            font-size: 20px;
            font-weight: 700;
            color: #1a1a1a;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .section-subtitle i {
            color: #ff9500;
        }
        
        .course-card.locked {
            opacity: 0.7;
            position: relative;
        }
        
        .course-locked-badge {
            position: absolute;
            top: 12px;
            right: 12px;
            background: rgba(239, 68, 68, 0.9);
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
            z-index: 10;
        }
        
        .course-card-btn.enrolled {
            background: #ff9500 !important;
            color: #1a202c !important;
            border-radius: 50px !important;
        }
        
        .course-card-btn.enrolled:hover {
            background: #e68500 !important;
        }
        
        .course-card-btn.locked {
            background: #6b7280;
            cursor: not-allowed;
        }
        
        .course-card-btn.locked:hover {
            background: #6b7280;
            transform: none;
        }
    `;
    document.head.appendChild(style);
})();