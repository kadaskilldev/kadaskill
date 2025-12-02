// ============================================
// Learn Page - Database Integration
// Dynamically loads courses from Supabase
// ============================================

// Use the supabase client from script.js (already initialized)
// SUPABASE_URL and SUPABASE_ANON_KEY are declared in script.js

let allCourses = [];
let currentCategory = 'all';

// ============================================
// Initialize Page
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadUserProfile();
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

    return `
        <div class="course-card" data-category="${categoryClass}">
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
                    <button class="course-card-btn" onclick="enrollInCourse('${course.id}', '${course.slug}')">
                        Start
                    </button>
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

// Make it global so onclick can access it
window.enrollInCourse = enrollInCourse;

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
