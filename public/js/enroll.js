// enroll.js
// ============================================
// Course Enrollment Page Logic
// Handles enrollment, prerequisites check, and access control
// ============================================

let currentUser = null;
let currentCourse = null;
let isEnrolled = false;
let prerequisitesMet = true;

// ============================================
// Initialize Page
// ============================================

document.addEventListener('DOMContentLoaded', async() => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseSlug = urlParams.get('course');

    if (!courseSlug) {
        showError('No course specified');
        setTimeout(() => window.location.href = 'learn.html', 2000);
        return;
    }

    await initializeEnrollmentPage(courseSlug);
});

// ============================================
// Initialize Enrollment Page
// ============================================

async function initializeEnrollmentPage(courseSlug) {
    try {
        // Check authentication
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            alert('Please log in to enroll in courses.');
            window.location.href = 'index.html#login';
            return;
        }

        currentUser = user;

        // Load course data
        await loadCourseData(courseSlug);

        // Check enrollment status
        await checkEnrollmentStatus();

        // Check prerequisites
        await checkPrerequisites();

        // Render page
        renderPage();

        // Setup event listeners
        setupEventListeners();

        // Hide loading, show content
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('enrollMain').style.display = 'block';

    } catch (error) {
        console.error('Error initializing enrollment page:', error);
        showError('Failed to load course. Please try again.');
    }
}

// ============================================
// Load Course Data
// ============================================

async function loadCourseData(slug) {
    const { data: course, error } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error || !course) {
        console.error('Error loading course:', error);
        throw new Error('Course not found');
    }

    currentCourse = course;
}

// ============================================
// Check Enrollment Status
// ============================================

async function checkEnrollmentStatus() {
    const { data: enrollment, error } = await supabase
        .from('enrollments')
        .select('id, status, progress_percentage')
        .eq('user_id', currentUser.id)
        .eq('course_id', currentCourse.id)
        .maybeSingle();

    if (error && error.code !== 'PGRST116') {
        console.error('Error checking enrollment:', error);
        return;
    }

    isEnrolled = !!enrollment;
}

// ============================================
// Check Prerequisites
// ============================================

async function checkPrerequisites() {
    if (!currentCourse.prerequisites || currentCourse.prerequisites.length === 0) {
        prerequisitesMet = true;
        return;
    }

    try {
        // Parse prerequisites (stored as JSON array of course IDs)
        const prerequisiteIds = typeof currentCourse.prerequisites === 'string' ?
            JSON.parse(currentCourse.prerequisites) :
            currentCourse.prerequisites;

        if (!Array.isArray(prerequisiteIds) || prerequisiteIds.length === 0) {
            prerequisitesMet = true;
            return;
        }

        // Get prerequisite courses
        const { data: prerequisiteCourses, error: coursesError } = await supabase
            .from('courses')
            .select('id, title, slug')
            .in('id', prerequisiteIds);

        if (coursesError) {
            console.error('Error fetching prerequisites:', coursesError);
            prerequisitesMet = true; // Fail open
            return;
        }

        // Check if user has completed all prerequisites
        const { data: completedEnrollments, error: enrollError } = await supabase
            .from('enrollments')
            .select('course_id, status, progress_percentage')
            .eq('user_id', currentUser.id)
            .in('course_id', prerequisiteIds);

        if (enrollError) {
            console.error('Error checking prerequisite enrollments:', enrollError);
            prerequisitesMet = true; // Fail open
            return;
        }

        // Check which prerequisites are not completed
        const completedCourseIds = completedEnrollments
            .filter(e => e.status === 'completed' || e.progress_percentage === 100)
            .map(e => e.course_id);

        const unmetPrerequisites = prerequisiteCourses.filter(
            course => !completedCourseIds.includes(course.id)
        );

        prerequisitesMet = unmetPrerequisites.length === 0;

        // Store unmet prerequisites for display
        currentCourse.unmetPrerequisites = unmetPrerequisites;

    } catch (error) {
        console.error('Error in checkPrerequisites:', error);
        prerequisitesMet = true; // Fail open
    }
}

// ============================================
// Render Page
// ============================================

function renderPage() {
    // Update course info
    document.getElementById('courseCategory').textContent = currentCourse.category || 'Course';
    document.getElementById('courseTitle').textContent = currentCourse.title;
    document.getElementById('courseDescription').textContent = currentCourse.description || '';

    // Update meta info
    const difficultyEl = document.getElementById('metaDifficulty');
    difficultyEl.innerHTML = `<i class="fas fa-signal"></i> ${currentCourse.difficulty || 'Beginner'}`;

    const durationEl = document.getElementById('metaDuration');
    const hours = currentCourse.duration_hours || 0;
    durationEl.innerHTML = `<i class="fas fa-clock"></i> ${formatDuration(hours)}`;

    const xpEl = document.getElementById('metaXP');
    xpEl.innerHTML = `<i class="fas fa-star"></i> ${currentCourse.xp_reward || 0} XP`;

    const studentsEl = document.getElementById('metaStudents');
    studentsEl.innerHTML = `<i class="fas fa-users"></i> ${currentCourse.enrolled_count || 0} students`;

    // Render learning objectives
    renderLearningObjectives();

    // Render course overview
    renderCourseOverview();

    // Update enrollment card
    updateEnrollmentCard();
}

// ============================================
// Render Learning Objectives
// ============================================

function renderLearningObjectives() {
    const container = document.getElementById('learningObjectives');

    try {
        let objectives = [];

        if (currentCourse.learning_objectives) {
            objectives = typeof currentCourse.learning_objectives === 'string' ?
                JSON.parse(currentCourse.learning_objectives) :
                currentCourse.learning_objectives;
        }

        if (!Array.isArray(objectives) || objectives.length === 0) {
            objectives = [
                'Gain practical knowledge and hands-on experience',
                'Build confidence in real-world applications',
                'Develop industry-relevant skills'
            ];
        }

        container.innerHTML = objectives.map(obj => `
            <div class="objective-item">
                <i class="fas fa-check-circle"></i>
                <span>${escapeHtml(obj)}</span>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error rendering objectives:', error);
        container.innerHTML = `
            <div class="objective-item">
                <i class="fas fa-check-circle"></i>
                <span>Learn essential concepts and skills</span>
            </div>
        `;
    }
}

// ============================================
// Render Course Overview
// ============================================

function renderCourseOverview() {
    const container = document.getElementById('courseOverview');

    // Use 'long_description' field if it exists, otherwise fall back to 'description'
    const overview = currentCourse.long_description ||
        currentCourse.description ||
        'This comprehensive course will teach you everything you need to know to succeed.';

    container.innerHTML = `<p>${escapeHtml(overview)}</p>`;
}

// ============================================
// Update Enrollment Card
// ============================================

function updateEnrollmentCard() {
    const enrollBtn = document.getElementById('enrollBtn');
    const continueBtn = document.getElementById('continueBtn');
    const alreadyEnrolled = document.getElementById('alreadyEnrolled');
    const prerequisitesWarning = document.getElementById('prerequisitesWarning');

    // Reset visibility
    enrollBtn.style.display = 'flex';
    continueBtn.style.display = 'none';
    alreadyEnrolled.style.display = 'none';
    prerequisitesWarning.style.display = 'none';

    // Show prerequisites warning if not met
    if (!prerequisitesMet && currentCourse.unmetPrerequisites) {
        prerequisitesWarning.style.display = 'flex';
        const list = document.getElementById('prerequisitesList');
        list.innerHTML = currentCourse.unmetPrerequisites.map(prereq => `
            <li>
                <a href="enroll.html?course=${prereq.slug}" style="color: white; text-decoration: underline;">
                    ${escapeHtml(prereq.title)}
                </a>
            </li>
        `).join('');

        enrollBtn.disabled = true;
        enrollBtn.innerHTML = '<i class="fas fa-lock"></i> Prerequisites Required';
        return;
    }

    // Show already enrolled message if enrolled
    if (isEnrolled) {
        alreadyEnrolled.style.display = 'flex';
        enrollBtn.style.display = 'none';
        continueBtn.style.display = 'flex';
        return;
    }

    // Ready to enroll
    enrollBtn.disabled = false;
    enrollBtn.innerHTML = '<i class="fas fa-graduation-cap"></i> Enroll Now - Free';
}

// ============================================
// Setup Event Listeners
// ============================================

function setupEventListeners() {
    const enrollBtn = document.getElementById('enrollBtn');
    const continueBtn = document.getElementById('continueBtn');

    if (enrollBtn) {
        enrollBtn.addEventListener('click', handleEnrollment);
    }

    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            window.location.href = `learning.html?course=${currentCourse.slug}`;
        });
    }
}

// ============================================
// Handle Enrollment
// ============================================

async function handleEnrollment() {
    if (!prerequisitesMet) {
        showNotification('Please complete prerequisite courses first', 'warning');
        return;
    }

    if (isEnrolled) {
        window.location.href = `learning.html?course=${currentCourse.slug}`;
        return;
    }

    const enrollBtn = document.getElementById('enrollBtn');
    const originalContent = enrollBtn.innerHTML;

    try {
        // Show loading state
        enrollBtn.disabled = true;
        enrollBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enrolling...';

        // Create enrollment
        const { data: enrollment, error } = await supabase
            .from('enrollments')
            .insert({
                user_id: currentUser.id,
                course_id: currentCourse.id,
                status: 'active',
                progress_percentage: 0,
                enrolled_at: new Date().toISOString(),
                last_accessed_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        // Success - redirect to learning page
        showNotification('Successfully enrolled! Loading course...', 'success');

        setTimeout(() => {
            window.location.href = `learning.html?course=${currentCourse.slug}`;
        }, 1000);

    } catch (error) {
        console.error('Error enrolling:', error);
        showNotification('Failed to enroll. Please try again.', 'error');

        // Reset button
        enrollBtn.disabled = false;
        enrollBtn.innerHTML = originalContent;
    }
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

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';

    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${escapeHtml(message)}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function showError(message) {
    const loadingState = document.getElementById('loadingState');
    if (loadingState) {
        loadingState.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-exclamation-circle" style="color: #ef4444;"></i>
                <p style="color: #ef4444;">${escapeHtml(message)}</p>
                <button onclick="window.location.href='learn.html'" 
                        style="margin-top: 16px; padding: 12px 24px; border: none; 
                               background: #ff9500; color: white; border-radius: 8px; 
                               cursor: pointer; font-weight: 600;">
                    Back to Courses
                </button>
            </div>
        `;
    }
}

// Inject notification styles
(function injectStyles() {
    if (document.getElementById('notification-styles')) return;

    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification i {
            font-size: 20px;
        }
        
        .notification-success {
            border-left: 4px solid #10b981;
        }
        
        .notification-success i {
            color: #10b981;
        }
        
        .notification-error {
            border-left: 4px solid #ef4444;
        }
        
        .notification-error i {
            color: #ef4444;
        }
        
        .notification-warning {
            border-left: 4px solid #f59e0b;
        }
        
        .notification-warning i {
            color: #f59e0b;
        }
        
        .notification-info {
            border-left: 4px solid #3b82f6;
        }
        
        .notification-info i {
            color: #3b82f6;
        }
    `;
    document.head.appendChild(style);
})();