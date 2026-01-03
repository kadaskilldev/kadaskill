// ============================================
// Learn Page - Database Integration
// Dynamically loads courses from Supabase
// ============================================

// Use the supabase client from script.js (already initialized)
// SUPABASE_URL and SUPABASE_ANON_KEY are declared in script.js

let allCourses = [];
let currentCategory = 'all';
let userCompletedCourses = []; // Store user's completed course slugs
let currentUser = null;

// ============================================
// Initialize Page
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadUserProfile();
    await loadUserCompletedCourses();
    await loadCourses();
    setupEventListeners();
});

// ============================================
// Load User Profile
// ============================================

async function loadUserProfile() {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.log('No user logged in, using default profile');
            return;
        }

        currentUser = user; // Store current user globally

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username, full_name, avatar_url, current_streak')
            .eq('id', user.id)
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
// Load User's Completed Courses
// ============================================

async function loadUserCompletedCourses() {
    if (!currentUser) {
        console.log('No user logged in, skipping completed courses check');
        return;
    }

    try {
        // Get all completed enrollments with course slugs
        const { data: completedEnrollments, error } = await supabase
            .from('enrollments')
            .select('course_id, courses!inner(slug)')
            .eq('user_id', currentUser.id)
            .eq('status', 'completed');

        if (error) {
            console.error('Error loading completed courses:', error);
            return;
        }

        // Extract course slugs
        userCompletedCourses = completedEnrollments
            ? completedEnrollments.map(e => e.courses.slug)
            : [];

        console.log('User completed courses:', userCompletedCourses);
    } catch (error) {
        console.error('Unexpected error loading completed courses:', error);
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
        renderCourses(allCourses);
        updateCourseCount(allCourses.length);

    } catch (error) {
        console.error('Unexpected error loading courses:', error);
        showError('An unexpected error occurred.');
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

    coursesGrid.innerHTML = courses.map(course => createCourseCard(course)).join('');
}

// ============================================
// Create Course Card HTML
// ============================================

function createCourseCard(course) {
    const categoryClass = course.category.toLowerCase().replace(/\s+/g, '-');
    const difficultyClass = course.difficulty.toLowerCase();
    const duration = formatDuration(course.duration_hours);
    const description = course.short_description || course.description || 'Learn essential skills and concepts.';

    // Check prerequisites
    const prerequisiteCheck = checkPrerequisites(course);
    const isLocked = !prerequisiteCheck.met;
    const cardClass = isLocked ? 'course-card course-card-locked' : 'course-card';

    return `
        <div class="${cardClass}" data-category="${categoryClass}">
            ${isLocked ? '<div class="course-lock-overlay"><i class="fas fa-lock"></i></div>' : ''}
            <div class="course-card-image">
                <img src="${course.thumbnail_url || '/images/courses/default.jpg'}"
                     alt="${course.title}"
                     onerror="this.style.display='none';">
                <div class="course-badge ${difficultyClass}">${course.difficulty}</div>
            </div>
            <div class="course-card-content">
                <h3 class="course-card-title">${course.title}</h3>
                <p class="course-card-description">${truncateText(description, 100)}</p>
                ${isLocked && prerequisiteCheck.missingCourse ? `
                    <div class="prerequisite-warning">
                        <i class="fas fa-info-circle"></i>
                        <span>Complete <strong>${prerequisiteCheck.missingCourse.title}</strong> first</span>
                    </div>
                ` : ''}
                <div class="course-card-footer">
                    <span class="course-duration">
                        <i class="fas fa-clock"></i> ${duration}
                    </span>
                    ${isLocked ? `
                        <button class="course-card-btn course-card-btn-locked" disabled>
                            <i class="fas fa-lock"></i> Locked
                        </button>
                    ` : `
                        <button class="course-card-btn" onclick="viewCourseDetails('${course.slug}')">
                            View Course
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;
}

// ============================================
// Helper Functions
// ============================================

function checkPrerequisites(course) {
    // If no prerequisites, course is unlocked
    if (!course.prerequisites || course.prerequisites.length === 0) {
        return { met: true, missingCourse: null };
    }

    // Check each prerequisite
    for (const prerequisiteSlug of course.prerequisites) {
        if (!userCompletedCourses.includes(prerequisiteSlug)) {
            // Find the prerequisite course details
            const prerequisiteCourse = allCourses.find(c => c.slug === prerequisiteSlug);
            return {
                met: false,
                missingCourse: prerequisiteCourse || { title: prerequisiteSlug, slug: prerequisiteSlug }
            };
        }
    }

    // All prerequisites met
    return { met: true, missingCourse: null };
}

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
// Course Enrollment
// ============================================

async function enrollInCourse(courseId, courseSlug) {
    try {
        console.log('Enrolling in course:', courseId, courseSlug);

        const { data: { user }, error: userError } = await supabase.auth.getUser();

        console.log('User auth check:', { user, userError });

        if (userError || !user) {
            console.error('User not authenticated:', userError);
            alert('Please log in to enroll in courses.');
            window.location.href = 'index.html#login';
            return;
        }

        console.log('User authenticated, checking enrollment...');

        // Check if already enrolled
        const { data: existingEnrollment, error: checkError } = await supabase
            .from('enrollments')
            .select('id')
            .eq('user_id', user.id)
            .eq('course_id', courseId)
            .single();

        console.log('Enrollment check:', { existingEnrollment, checkError });

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking enrollment:', checkError);
            alert('Failed to check enrollment status. Please try again.');
            return;
        }

        if (existingEnrollment) {
            // Already enrolled, redirect to course
            console.log('Already enrolled, redirecting to course...');
            window.location.href = `learning.html?course=${courseSlug}`;
            return;
        }

        console.log('Creating new enrollment...');

        // Create new enrollment
        const { data: enrollment, error: enrollError } = await supabase
            .from('enrollments')
            .insert({
                user_id: user.id,
                course_id: courseId,
                status: 'active',
                progress_percentage: 0,
                enrolled_at: new Date().toISOString()
            })
            .select()
            .single();

        if (enrollError) {
            console.error('Error enrolling:', enrollError);
            alert('Failed to enroll: ' + enrollError.message);
            return;
        }

        console.log('Enrollment created:', enrollment);

        // Redirect to course
        console.log('Redirecting to learning page...');
        window.location.href = `learning.html?course=${courseSlug}`;

    } catch (error) {
        console.error('Unexpected error enrolling:', error);
        alert('An unexpected error occurred: ' + error.message);
    }
}

// ============================================
// View Course Details (Preview)
// ============================================

function viewCourseDetails(courseSlug) {
    // Redirect to learning page in preview mode
    window.location.href = `learning.html?course=${courseSlug}`;
}

// Make functions global so onclick can access them
window.enrollInCourse = enrollInCourse;
window.viewCourseDetails = viewCourseDetails;

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
