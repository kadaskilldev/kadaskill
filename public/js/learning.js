// ============================================
// Learning Page - Database Integration
// Dynamically loads course lessons from Supabase
// With automatic completion tracking
// ============================================

let currentUser = null;
let currentCourse = null;
let allLessons = [];
let currentLesson = null;
let completedLessons = [];
let enrollmentId = null;
let videoWatchedPercentage = 0;
let contentEngagementTimer = null;
let minimumEngagementTime = 0;

// ============================================
// Initialize Page
// ============================================

document.addEventListener('DOMContentLoaded', async() => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseSlug = urlParams.get('course');

    if (!courseSlug) {
        showNotification('No course specified', 'error');
        window.location.href = 'learn.html';
        return;
    }

    await initializeLearning(courseSlug);
});

// ============================================
// Initialize Learning
// ============================================

async function initializeLearning(courseSlug) {
    try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            showNotification('Please log in to access this course', 'error');
            window.location.href = 'index.html';
            return;
        }

        currentUser = user;

        // Load course data
        await loadCourse(courseSlug);

        // Check prerequisites
        const prerequisitesCheck = await checkCoursePrerequisites();
        if (!prerequisitesCheck.met) {
            showPrerequisiteError(prerequisitesCheck);
            return;
        }

        // Check if user is enrolled
        const isEnrolled = await checkEnrollment();

        if (!isEnrolled) {
            // Show course preview (not enrolled)
            await showCoursePreview();
            return;
        }

        // User is enrolled - show learning interface
        showLearningInterface();

        // Load lessons
        await loadLessons();

        // Load completed lessons
        await loadCompletedLessons();

        // Render lessons list
        renderLessonsList();

        // Setup event listeners
        setupEventListeners();

        // Auto-load first lesson only if there are lessons and we're not coming back to a specific lesson
        if (allLessons.length > 0) {
            // Check if there's a lesson in URL hash
            const hash = window.location.hash.replace('#lesson-', '');
            if (hash && allLessons.find(l => l.id === hash)) {
                await loadLesson(hash);
            }
            // Otherwise show welcome message, user clicks to start
        }

    } catch (error) {
        console.error('Error initializing learning page:', error);
        showNotification('Error loading course. Please try again.', 'error');
    }
}

// ============================================
// Load Course Data
// ============================================

async function loadCourse(slug) {
    const { data: course, error } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error loading course:', error);
        showNotification('Course not found', 'error');
        window.location.href = 'learn.html';
        return;
    }

    currentCourse = course;
    updateCourseHeader();
}

// ============================================
// Update Course Header
// ============================================

function updateCourseHeader() {
    const titleEl = document.getElementById('courseTitle');
    const descEl = document.getElementById('courseDescription');

    if (titleEl) titleEl.textContent = currentCourse.title;
    if (descEl) descEl.textContent = currentCourse.description || '';

    // Update difficulty
    const difficultyEl = document.querySelector('#courseDifficulty span');
    if (difficultyEl) {
        difficultyEl.textContent = currentCourse.difficulty || 'Beginner';
    }

    // Update duration
    const durationEl = document.querySelector('#courseDuration span');
    if (durationEl) {
        const hours = currentCourse.duration_hours || 0;
        durationEl.textContent = hours >= 1 ? `${Math.floor(hours)} hours` : `${Math.round(hours * 60)} min`;
    }

    // Update XP
    const xpEl = document.querySelector('#courseXP span');
    if (xpEl) {
        xpEl.textContent = `${currentCourse.xp_reward || 0} XP`;
    }
}

// ============================================
// Check Enrollment (without auto-enrolling)
// ============================================

async function checkEnrollment() {
    try {
        const { data: existingEnrollment, error: checkError } = await supabase
            .from('enrollments')
            .select('id, progress_percentage')
            .eq('user_id', currentUser.id)
            .eq('course_id', currentCourse.id)
            .maybeSingle();

        if (checkError) {
            console.error('Error checking enrollment:', checkError);
            return false;
        }

        if (existingEnrollment) {
            enrollmentId = existingEnrollment.id;
            updateProgressCircle(existingEnrollment.progress_percentage || 0);
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error in checkEnrollment:', error);
        return false;
    }
}

// ============================================
// Show Course Preview (Not Enrolled)
// ============================================

async function showCoursePreview() {
    // Hide learning interface
    const learningMain = document.getElementById('learningMain');
    if (learningMain) learningMain.style.display = 'none';

    // Show preview section
    const preview = document.getElementById('coursePreview');
    if (preview) preview.style.display = 'block';

    // Hide progress widget
    const progressWidget = document.querySelector('.course-progress-widget');
    if (progressWidget) progressWidget.style.display = 'none';

    // Populate course details
    const fullDescEl = document.getElementById('courseFullDescription');
    if (fullDescEl) {
        fullDescEl.textContent = currentCourse.description || 'No description available.';
    }

    // Populate highlights (parse from description or use default)
    const highlightsEl = document.getElementById('courseHighlights');
    if (highlightsEl) {
        let objectives = [];

        if (currentCourse.learning_objectives) {
            try {
                objectives = Array.isArray(currentCourse.learning_objectives)
                    ? currentCourse.learning_objectives
                    : JSON.parse(currentCourse.learning_objectives);
            } catch (e) {
                console.error('Error parsing learning objectives:', e);
            }
        }

        highlightsEl.innerHTML = objectives.length > 0
            ? objectives.map(obj => `<li>${obj}</li>`).join('')
            : '<li>Master essential concepts and skills</li><li>Complete hands-on projects</li><li>Earn certificates and badges</li>';
    }

    // Populate enrollment stats
    document.getElementById('enrolledCount').textContent = `${currentCourse.enrolled_count || 0} students`;
    document.getElementById('enrollDuration').textContent = `${currentCourse.duration_hours || 0} hours`;
    document.getElementById('enrollDifficulty').textContent = currentCourse.difficulty || 'Beginner';
    document.getElementById('enrollXP').textContent = `${currentCourse.xp_reward || 0} XP`;

    // Load syllabus (lessons)
    await loadSyllabus();

    // Setup enroll button
    const enrollBtn = document.getElementById('enrollBtn');
    if (enrollBtn) {
        enrollBtn.addEventListener('click', handleEnrollNow);
    }
}

// ============================================
// Show Learning Interface (Enrolled)
// ============================================

function showLearningInterface() {
    // Show learning interface
    const learningMain = document.getElementById('learningMain');
    if (learningMain) learningMain.style.display = 'block';

    // Hide preview section
    const preview = document.getElementById('coursePreview');
    if (preview) preview.style.display = 'none';

    // Show progress widget
    const progressWidget = document.querySelector('.course-progress-widget');
    if (progressWidget) progressWidget.style.display = 'block';
}

// ============================================
// Load Syllabus (for preview)
// ============================================

async function loadSyllabus() {
    const { data: lessons, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', currentCourse.id)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error loading syllabus:', error);
        document.getElementById('syllabusContent').innerHTML = '<p>Error loading syllabus</p>';
        return;
    }

    const syllabusContent = document.getElementById('syllabusContent');
    if (!syllabusContent) return;

    if (!lessons || lessons.length === 0) {
        syllabusContent.innerHTML = '<p>No lessons available yet.</p>';
        return;
    }

    syllabusContent.innerHTML = `
        <div class="syllabus-list">
            ${lessons.map((lesson, index) => `
                <div class="syllabus-item">
                    <div class="syllabus-item-number">${index + 1}</div>
                    <div class="syllabus-item-content">
                        <h4>${lesson.title}</h4>
                        <div class="syllabus-item-meta">
                            <span class="lesson-type">
                                <i class="fas ${getLessonIcon(lesson.type)}"></i>
                                ${lesson.type}
                            </span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ============================================
// Handle Enroll Now Button
// ============================================

async function handleEnrollNow() {
    const enrollBtn = document.getElementById('enrollBtn');
    if (enrollBtn) {
        enrollBtn.disabled = true;
        enrollBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enrolling...';
    }

    try {
        // Create enrollment
        const { data: newEnrollment, error: createError } = await supabase
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

        if (createError) {
            console.error('Error creating enrollment:', createError);
            showNotification('Failed to enroll. Please try again.', 'error');
            if (enrollBtn) {
                enrollBtn.disabled = false;
                enrollBtn.innerHTML = '<i class="fas fa-check-circle"></i> Enroll Now';
            }
            return;
        }

        enrollmentId = newEnrollment.id;
        showNotification('Successfully enrolled! Loading course...', 'success');

        // Reload page to show learning interface
        setTimeout(() => {
            window.location.reload();
        }, 1000);

    } catch (error) {
        console.error('Error enrolling:', error);
        showNotification('An error occurred. Please try again.', 'error');
        if (enrollBtn) {
            enrollBtn.disabled = false;
            enrollBtn.innerHTML = '<i class="fas fa-check-circle"></i> Enroll Now';
        }
    }
}

// ============================================
// Helper: Get Lesson Icon
// ============================================

function getLessonIcon(type) {
    switch(type?.toLowerCase()) {
        case 'video': return 'fa-play-circle';
        case 'text': return 'fa-file-alt';
        case 'quiz': return 'fa-question-circle';
        default: return 'fa-book';
    }
}

// ============================================
// Check Course Prerequisites
// ============================================

async function checkCoursePrerequisites() {
    // If no prerequisites, course is unlocked
    if (!currentCourse.prerequisites || currentCourse.prerequisites.length === 0) {
        return { met: true, missingCourse: null };
    }

    try {
        // Get user's completed courses
        const { data: completedEnrollments, error } = await supabase
            .from('enrollments')
            .select('course_id, courses!inner(slug, title)')
            .eq('user_id', currentUser.id)
            .eq('status', 'completed');

        if (error) {
            console.error('Error checking prerequisites:', error);
            return { met: true, missingCourse: null }; // Allow access on error
        }

        const completedSlugs = completedEnrollments
            ? completedEnrollments.map(e => e.courses.slug)
            : [];

        // Check each prerequisite
        for (const prerequisiteSlug of currentCourse.prerequisites) {
            if (!completedSlugs.includes(prerequisiteSlug)) {
                // Fetch the prerequisite course details
                const { data: prerequisiteCourse } = await supabase
                    .from('courses')
                    .select('slug, title')
                    .eq('slug', prerequisiteSlug)
                    .single();

                return {
                    met: false,
                    missingCourse: prerequisiteCourse || { title: prerequisiteSlug, slug: prerequisiteSlug }
                };
            }
        }

        // All prerequisites met
        return { met: true, missingCourse: null };
    } catch (error) {
        console.error('Error in prerequisite check:', error);
        return { met: true, missingCourse: null }; // Allow access on error
    }
}

// ============================================
// Show Prerequisite Error
// ============================================

function showPrerequisiteError(prerequisitesCheck) {
    const learningMain = document.getElementById('learningMain');
    if (learningMain) learningMain.style.display = 'none';

    const preview = document.getElementById('coursePreview');
    if (preview) {
        preview.style.display = 'block';
        preview.innerHTML = `
            <div class="container">
                <div class="prerequisite-error">
                    <div class="prerequisite-error-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <h2>Course Locked</h2>
                    <p>This course requires you to complete a prerequisite course first.</p>
                    <div class="prerequisite-required">
                        <h3>Required Course:</h3>
                        <div class="prerequisite-course-card">
                            <i class="fas fa-graduation-cap"></i>
                            <span>${prerequisitesCheck.missingCourse.title}</span>
                        </div>
                    </div>
                    <div class="prerequisite-actions">
                        <a href="learn.html" class="btn-back-to-courses">
                            <i class="fas fa-arrow-left"></i>
                            Back to Courses
                        </a>
                        <a href="learning.html?course=${prerequisitesCheck.missingCourse.slug}" class="btn-start-prerequisite">
                            <i class="fas fa-play-circle"></i>
                            Start Required Course
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
}

// ============================================
// Load Lessons
// ============================================

async function loadLessons() {
    const { data: lessons, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', currentCourse.id)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error loading lessons:', error);
        showNotification('Failed to load lessons', 'error');
        return;
    }

    allLessons = lessons || [];
}

// ============================================
// Load Completed Lessons
// ============================================

async function loadCompletedLessons() {
    const { data: progress, error } = await supabase
        .from('lesson_progress')
        .select('lesson_id, is_completed')
        .eq('user_id', currentUser.id)
        .eq('is_completed', true);

    if (error) {
        console.error('Error loading lesson progress:', error);
        return;
    }

    completedLessons = progress ? progress.map(p => p.lesson_id) : [];
}

// ============================================
// Load First Available Lesson
// ============================================

async function loadFirstAvailableLesson() {
    if (allLessons.length === 0) return;

    // Find first incomplete lesson
    const firstIncompleteLesson = allLessons.find(lesson =>
        !completedLessons.includes(lesson.id) && isLessonUnlocked(lesson)
    );

    if (firstIncompleteLesson) {
        await loadLesson(firstIncompleteLesson.id);
    } else {
        // Load first lesson if all are complete
        await loadLesson(allLessons[0].id);
    }
}

// ============================================
// Render Lessons List
// ============================================

function renderLessonsList() {
    const lessonsList = document.getElementById('lessonsList');

    if (!lessonsList) {
        console.error('Lessons list element not found');
        return;
    }

    if (allLessons.length === 0) {
        lessonsList.innerHTML = `
            <div class="lessons-loading">
                <i class="fas fa-book-open"></i>
                <p>No lessons available yet</p>
            </div>
        `;
        return;
    }

    const modules = groupLessonsIntoModules(allLessons);

    lessonsList.innerHTML = modules.map((module, moduleIndex) => {
        return `
            <div class="module-item ${moduleIndex === 0 ? 'expanded' : ''}" data-module="${moduleIndex}">
                <div class="module-header">
                    <div class="module-header-left">
                        <div class="module-number">Module ${moduleIndex + 1}</div>
                        <div class="module-title">${module.title}</div>
                    </div>
                    <i class="fas fa-chevron-right module-chevron"></i>
                </div>
                <div class="module-lessons">
                    ${renderModuleLessons(module.lessons)}
                </div>
            </div>
        `;
    }).join('');
}

function groupLessonsIntoModules(lessons) {
    const moduleSize = 5;
    const modules = [];

    for (let i = 0; i < lessons.length; i += moduleSize) {
        const chunk = lessons.slice(i, i + moduleSize);
        modules.push({
            title: `Lessons ${i + 1}-${Math.min(i + moduleSize, lessons.length)}`,
            lessons: chunk
        });
    }

    return modules;
}

function renderModuleLessons(lessons) {
    return lessons.map((lesson) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isLocked = !isLessonUnlocked(lesson);
                const isActive = currentLesson && currentLesson.id === lesson.id;

                let iconClass = 'unlocked';
                let iconName = 'fa-circle';

                if (isCompleted) {
                    iconClass = 'completed';
                    iconName = 'fa-check-circle';
                } else if (isLocked) {
                    iconClass = 'locked';
                    iconName = 'fa-lock';
                }

                return `
            <div class="lesson-item ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}"
                 data-lesson-id="${lesson.id}"
                 ${!isLocked ? `onclick="loadLesson('${lesson.id}')"` : ''}>
                <div class="lesson-icon ${iconClass}">
                    <i class="fas ${iconName}"></i>
                </div>
                <div class="lesson-info">
                    <div class="lesson-name">${escapeHtml(lesson.title)}</div>
                    <div class="lesson-duration">${getLessonTypeLabel(lesson.content_type)}</div>
                </div>
            </div>
        `;
    }).join('');
}

function isLessonUnlocked(lesson) {
    // First lesson is always unlocked
    if (lesson.order_index === 0) return true;

    // Find previous lesson
    const prevLesson = allLessons.find(l => l.order_index === lesson.order_index - 1);

    if (!prevLesson) return true;

    // Check if previous lesson is completed
    return completedLessons.includes(prevLesson.id);
}

function getLessonTypeLabel(contentType) {
    const types = {
        'video': 'Video Lesson',
        'text': 'Reading',
        'quiz': 'Quiz',
        'code': 'Code Exercise'
    };
    return types[contentType] || 'Lesson';
}

// ============================================
// Load Lesson Content
// ============================================

async function loadLesson(lessonId) {
    // Clear previous engagement tracking
    stopEngagementTracking();

    const lesson = allLessons.find(l => l.id === lessonId);

    if (!lesson) {
        showNotification('Lesson not found', 'error');
        return;
    }

    currentLesson = lesson;
    videoWatchedPercentage = 0;

    // Update UI
    const lessonTitleEl = document.getElementById('lessonTitle');
    if (lessonTitleEl) {
        lessonTitleEl.textContent = lesson.title;
    }

    // Update mark complete button - show completion status or hide
    updateMarkCompleteButton();

    // Show completion indicator if already completed
    if (completedLessons.includes(lesson.id)) {
        showCompletionBadge();
    }

    // Render lesson content
    renderLessonContent(lesson);

    // Update navigation buttons
    updateNavigationButtons();

    // Show navigation
    const navEl = document.getElementById('lessonNavigation');
    if (navEl) navEl.style.display = 'flex';

    // Update active state in sidebar
    document.querySelectorAll('.lesson-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeItem = document.querySelector(`[data-lesson-id="${lessonId}"]`);
    if (activeItem) activeItem.classList.add('active');

    // Update last accessed
    await updateLastAccessed(lessonId);

    // Start engagement tracking for auto-completion
    startEngagementTracking(lesson);
}

// Make it global
window.loadLesson = loadLesson;

// ============================================
// Update Mark Complete Button
// ============================================

function updateMarkCompleteButton() {
    const markCompleteBtn = document.getElementById('markCompleteBtn');
    if (!markCompleteBtn) return;

    const isCompleted = completedLessons.includes(currentLesson.id);

    if (isCompleted) {
        // Already completed - show status only
        markCompleteBtn.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
        markCompleteBtn.classList.add('completed');
        markCompleteBtn.disabled = true;
        markCompleteBtn.style.cursor = 'default';
        markCompleteBtn.style.opacity = '0.7';
        markCompleteBtn.style.display = 'flex';
    } else {
        // Hide button - system will auto-complete based on engagement
        markCompleteBtn.style.display = 'none';
    }
}

// ============================================
// Show Completion Badge
// ============================================

function showCompletionBadge() {
    // Add a visual indicator that lesson is completed
    const lessonTitleEl = document.getElementById('lessonTitle');
    if (lessonTitleEl && !lessonTitleEl.querySelector('.completion-badge')) {
        const badge = document.createElement('span');
        badge.className = 'completion-badge';
        badge.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
        badge.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #10b981;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            margin-left: 12px;
            font-weight: 500;
        `;
        lessonTitleEl.appendChild(badge);
    }
}

// ============================================
// Engagement Tracking for Auto-Completion
// ============================================

function startEngagementTracking(lesson) {
    // Set minimum engagement time based on content type
    switch (lesson.content_type) {
        case 'video':
            minimumEngagementTime = 0; // Will track video progress via API
            break;
        case 'text':
            // Estimate reading time: ~200 words per minute
            const wordCount = (lesson.text_content || '').split(/\s+/).length;
            minimumEngagementTime = Math.max(30000, (wordCount / 200) * 60 * 1000 * 0.7); // 70% of estimated time
            break;
        case 'quiz':
            minimumEngagementTime = 0; // Quiz completion triggers auto-complete
            return; // Don't start timer for quiz
        default:
            minimumEngagementTime = 30000; // 30 seconds minimum
    }

    // For text content, start engagement timer
    if (lesson.content_type === 'text' && !completedLessons.includes(lesson.id)) {
        let timeSpent = 0;
        const totalTime = minimumEngagementTime;
        
        contentEngagementTimer = setInterval(() => {
            timeSpent += 1000;
            const percentage = Math.min(100, (timeSpent / totalTime) * 100);
            
            // Update reading progress UI
            updateReadingProgress(percentage, timeSpent, totalTime);
            
            // Auto-complete after minimum engagement time
            if (timeSpent >= minimumEngagementTime) {
                stopEngagementTracking();
                autoCompleteLessonIfEligible('engagement');
            }
        }, 1000);
    }
}

// ============================================
// Update Reading Progress UI
// ============================================

function updateReadingProgress(percentage, timeSpent, totalTime) {
    const progressBar = document.getElementById('readingProgressBar');
    const progressPercentage = document.getElementById('progressPercentage');
    const progressText = document.getElementById('progressText');
    
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        
        // Color coding
        if (percentage >= 100) {
            progressBar.style.background = '#10b981'; // Green
        } else if (percentage >= 50) {
            progressBar.style.background = '#f59e0b'; // Orange
        } else {
            progressBar.style.background = '#3b82f6'; // Blue
        }
    }
    
    if (progressPercentage) {
        progressPercentage.textContent = `${Math.round(percentage)}%`;
    }
    
    if (progressText) {
        const remainingSeconds = Math.ceil((totalTime - timeSpent) / 1000);
        const remainingMinutes = Math.ceil(remainingSeconds / 60);
        
        if (percentage >= 100) {
            progressText.innerHTML = '<i class="fas fa-check-circle"></i> Great! Completing lesson...';
            progressText.style.color = '#10b981';
        } else if (remainingSeconds > 60) {
            progressText.textContent = `Keep reading... ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} remaining`;
        } else {
            progressText.textContent = `Keep reading... ${remainingSeconds} seconds remaining`;
        }
    }
}

function stopEngagementTracking() {
    if (contentEngagementTimer) {
        clearInterval(contentEngagementTimer);
        contentEngagementTimer = null;
    }
    
    // Clear YouTube tracking
    if (window.youtubeProgressInterval) {
        clearInterval(window.youtubeProgressInterval);
        window.youtubeProgressInterval = null;
    }
    
    // Clean up players
    if (window.currentYouTubePlayer) {
        window.currentYouTubePlayer = null;
    }
    
    if (window.currentVimeoPlayer) {
        window.currentVimeoPlayer = null;
    }
}

async function autoCompleteLessonIfEligible(trigger = 'manual') {
    if (!currentLesson || completedLessons.includes(currentLesson.id)) {
        return;
    }

    let shouldComplete = false;

    switch (currentLesson.content_type) {
        case 'video':
            // Auto-complete if 80% watched
            shouldComplete = videoWatchedPercentage >= 80;
            break;
        case 'text':
            // Auto-complete after engagement time
            shouldComplete = trigger === 'engagement';
            break;
        case 'quiz':
            // Handled separately in quiz completion
            shouldComplete = trigger === 'quiz' || trigger === 'manual';
            break;
        default:
            shouldComplete = trigger === 'manual';
    }

    if (shouldComplete) {
        await markLessonComplete(true);
    }
}

// ============================================
// Render Lesson Content
// ============================================

function renderLessonContent(lesson) {
    const contentArea = document.getElementById('lessonContent');
    
    if (!contentArea) {
        console.error('Content area not found');
        return;
    }

    switch (lesson.content_type) {
        case 'video':
            contentArea.innerHTML = renderVideoContent(lesson);
            setupVideoTracking();
            break;
        case 'text':
            contentArea.innerHTML = renderTextContent(lesson);
            break;
        case 'quiz':
            contentArea.innerHTML = renderQuizContent(lesson);
            break;
        default:
            contentArea.innerHTML = renderTextContent(lesson);
    }
}

function renderVideoContent(lesson) {
    const videoUrl = lesson.video_url;

    if (!videoUrl) {
        return '<p>No video available for this lesson.</p>';
    }

    let embedHtml = '';
    const progressIndicator = `
        <div class="lesson-progress-indicator" id="lessonProgressIndicator">
            <div class="progress-info">
                <i class="fas fa-video"></i>
                <span id="progressText">Watch at least 80% of the video to complete this lesson</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar" id="videoProgressBar" style="width: 0%"></div>
            </div>
            <div class="progress-percentage" id="progressPercentage">0%</div>
        </div>
    `;

    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const videoId = extractYouTubeId(videoUrl);
        embedHtml = `
            <div class="video-content">
                ${progressIndicator}
                <div class="video-wrapper">
                    <iframe id="lessonVideo" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                    </iframe>
                </div>
                ${lesson.text_content ? `<div class="text-content">${lesson.text_content}</div>` : ''}
            </div>
        `;
    } else if (videoUrl.includes('vimeo.com')) {
        const videoId = extractVimeoId(videoUrl);
        embedHtml = `
            <div class="video-content">
                ${progressIndicator}
                <div class="video-wrapper">
                    <iframe id="lessonVideo" src="https://player.vimeo.com/video/${videoId}?api=1"
                            frameborder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowfullscreen>
                    </iframe>
                </div>
                ${lesson.text_content ? `<div class="text-content">${lesson.text_content}</div>` : ''}
            </div>
        `;
    } else {
        // Direct video URL
        embedHtml = `
            <div class="video-content">
                ${progressIndicator}
                <div class="video-wrapper">
                    <video id="lessonVideo" controls>
                        <source src="${videoUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
                ${lesson.text_content ? `<div class="text-content">${lesson.text_content}</div>` : ''}
            </div>
        `;
    }

    return embedHtml;
}

function setupVideoTracking() {
    setTimeout(() => {
        const videoElement = document.getElementById('lessonVideo');
        
        if (!videoElement) return;

        // For HTML5 video element
        if (videoElement.tagName === 'VIDEO') {
            videoElement.addEventListener('timeupdate', function() {
                if (this.duration > 0) {
                    const percentage = (this.currentTime / this.duration) * 100;
                    videoWatchedPercentage = Math.max(videoWatchedPercentage, percentage);
                    updateVideoProgress(percentage);
                    
                    // Auto-complete at 80%
                    if (percentage >= 80 && !completedLessons.includes(currentLesson.id)) {
                        autoCompleteLessonIfEligible('video');
                    }
                }
            });
        }
        // For YouTube iframes - use YouTube API
        else if (videoElement.tagName === 'IFRAME' && videoElement.src.includes('youtube.com')) {
            setupYouTubeTracking();
        }
        // For Vimeo iframes
        else if (videoElement.tagName === 'IFRAME' && videoElement.src.includes('vimeo.com')) {
            setupVimeoTracking();
        }
    }, 1000);
}

// ============================================
// YouTube API Tracking
// ============================================

function setupYouTubeTracking() {
    // Load YouTube IFrame API
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Wait for API to be ready
    window.onYouTubeIframeAPIReady = function() {
        initYouTubePlayer();
    };

    // If API already loaded
    if (window.YT && window.YT.Player) {
        initYouTubePlayer();
    }
}

function initYouTubePlayer() {
    try {
        const iframe = document.getElementById('lessonVideo');
        if (!iframe) return;

        const player = new YT.Player('lessonVideo', {
            events: {
                'onReady': onYouTubePlayerReady,
                'onStateChange': onYouTubePlayerStateChange
            }
        });

        window.currentYouTubePlayer = player;
    } catch (error) {
        console.error('Error initializing YouTube player:', error);
        // Fallback: Use manual completion button
        showManualCompleteButton();
    }
}

function onYouTubePlayerReady(event) {
    const player = event.target;
    
    // Track progress every second
    window.youtubeProgressInterval = setInterval(() => {
        if (player && player.getCurrentTime && player.getDuration) {
            const currentTime = player.getCurrentTime();
            const duration = player.getDuration();
            
            if (duration > 0) {
                const percentage = (currentTime / duration) * 100;
                videoWatchedPercentage = Math.max(videoWatchedPercentage, percentage);
                updateVideoProgress(percentage);
                
                // Auto-complete at 80%
                if (percentage >= 80 && currentLesson && !completedLessons.includes(currentLesson.id)) {
                    clearInterval(window.youtubeProgressInterval);
                    autoCompleteLessonIfEligible('video');
                }
            }
        }
    }, 1000);
}

function onYouTubePlayerStateChange(event) {
    // Player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    if (event.data === YT.PlayerState.ENDED) {
        // Video finished - mark as complete
        videoWatchedPercentage = 100;
        updateVideoProgress(100);
        if (currentLesson && !completedLessons.includes(currentLesson.id)) {
            autoCompleteLessonIfEligible('video');
        }
    }
}

// ============================================
// Vimeo API Tracking
// ============================================

function setupVimeoTracking() {
    // Load Vimeo Player API
    if (!window.Vimeo) {
        const script = document.createElement('script');
        script.src = 'https://player.vimeo.com/api/player.js';
        script.onload = initVimeoPlayer;
        document.head.appendChild(script);
    } else {
        initVimeoPlayer();
    }
}

function initVimeoPlayer() {
    try {
        const iframe = document.getElementById('lessonVideo');
        if (!iframe || !window.Vimeo) return;

        const player = new Vimeo.Player(iframe);

        player.on('timeupdate', function(data) {
            const percentage = data.percent * 100;
            videoWatchedPercentage = Math.max(videoWatchedPercentage, percentage);
            updateVideoProgress(percentage);
            
            // Auto-complete at 80%
            if (percentage >= 80 && currentLesson && !completedLessons.includes(currentLesson.id)) {
                autoCompleteLessonIfEligible('video');
            }
        });

        player.on('ended', function() {
            videoWatchedPercentage = 100;
            updateVideoProgress(100);
            if (currentLesson && !completedLessons.includes(currentLesson.id)) {
                autoCompleteLessonIfEligible('video');
            }
        });

        window.currentVimeoPlayer = player;
    } catch (error) {
        console.error('Error initializing Vimeo player:', error);
        showManualCompleteButton();
    }
}

// ============================================
// Update Video Progress UI
// ============================================

function updateVideoProgress(percentage) {
    const progressBar = document.getElementById('videoProgressBar');
    const progressPercentage = document.getElementById('progressPercentage');
    const progressText = document.getElementById('progressText');
    
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        
        // Color coding
        if (percentage >= 80) {
            progressBar.style.background = '#10b981'; // Green
        } else if (percentage >= 50) {
            progressBar.style.background = '#f59e0b'; // Orange
        } else {
            progressBar.style.background = '#3b82f6'; // Blue
        }
    }
    
    if (progressPercentage) {
        progressPercentage.textContent = `${Math.round(percentage)}%`;
        progressPercentage.style.fontSize = "0.85rem"; // smaller %
    }
    
    if (progressText) {
        progressText.style.fontSize = "0.85rem"; // smaller text

        if (percentage >= 80) {
            progressText.innerHTML = '<i class="fas fa-check-circle"></i> Great! Completing lesson...';
            progressText.style.color = '#10b981';
        } else {
            progressText.textContent = `Watch ${Math.round(80 - percentage)}% more to complete`;
        }
    }
}

// ============================================
// Fallback: Manual Complete Button
// ============================================

function showManualCompleteButton() {
    const progressIndicator = document.getElementById('lessonProgressIndicator');
    if (progressIndicator) {
        progressIndicator.innerHTML = `
            <div class="manual-complete-notice">
                <i class="fas fa-info-circle"></i>
                <p>Automatic tracking unavailable. Click below when you finish watching:</p>
                <button onclick="markLessonComplete(false)" class="btn-manual-complete">
                    <i class="fas fa-check-circle"></i> I Finished This Video
                </button>
            </div>
        `;
    }
}

function renderTextContent(lesson) {
    const wordCount = (lesson.text_content || '').split(/\s+/).length;
    const estimatedMinutes = Math.max(1, Math.round(wordCount / 200));
    
    return `
        <div class="text-content">
            <div class="lesson-progress-indicator" id="lessonProgressIndicator">
                <div class="progress-info">
                    <i class="fas fa-book-open"></i>
                    <span id="progressText">Read for ${estimatedMinutes} minute${estimatedMinutes > 1 ? 's' : ''} to complete this lesson</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" id="readingProgressBar" style="width: 0%"></div>
                </div>
                <div class="progress-percentage" id="progressPercentage">0%</div>
            </div>
            ${lesson.text_content || '<p>No content available for this lesson.</p>'}
        </div>
    `;
}

function renderQuizContent(lesson) {
    let quizData;
    try {
        quizData = JSON.parse(lesson.text_content);
    } catch (e) {
        console.error('Error parsing quiz data:', e);
        return '<p>Error loading quiz data.</p>';
    }

    if (!quizData || !quizData.questions) {
        return '<p>Invalid quiz data.</p>';
    }

    const { instructions, questions } = quizData;

    let quizHtml = `
        <div class="quiz-content">
            <div class="quiz-header">
                <i class="fas fa-clipboard-question"></i>
                <h3>Knowledge Check</h3>
            </div>
            ${instructions ? `<p class="quiz-instructions">${escapeHtml(instructions)}</p>` : ''}
            <div class="quiz-questions">
    `;

    questions.forEach((q, index) => {
        quizHtml += `
            <div class="quiz-question" data-question-index="${index}">
                <div class="question-header">
                    <span class="question-number">Question ${index + 1}</span>
                    <span class="question-points">${q.points || 1} point${q.points !== 1 ? 's' : ''}</span>
                </div>
                <p class="question-text">${escapeHtml(q.question)}</p>
                <div class="question-options">
        `;

        q.options.forEach((option, optIndex) => {
            quizHtml += `
                <label class="quiz-option">
                    <input type="radio" name="question-${index}" value="${optIndex}"
                           onchange="handleQuizAnswer(${index}, ${optIndex}, ${q.correctAnswer})">
                    <span class="option-text">${escapeHtml(option)}</span>
                    <span class="option-indicator"></span>
                </label>
            `;
        });

        quizHtml += `
                </div>
                <div class="question-feedback" style="display: none;"></div>
            </div>
        `;
    });

    quizHtml += `
            </div>
            <div class="quiz-summary" style="display: none;">
                <div class="quiz-score">
                    <i class="fas fa-trophy"></i>
                    <span>Score: <strong><span id="quizScore">0</span>/${questions.length}</strong></span>
                </div>
                <button class="btn-retry-quiz" onclick="retryQuiz()">
                    <i class="fas fa-redo"></i> Retry Quiz
                </button>
            </div>
        </div>
    `;

    return quizHtml;
}

// ============================================
// Helper Functions
// ============================================

function extractYouTubeId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
}

function extractVimeoId(url) {
    const regex = /vimeo\.com\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
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

window.copyCode = function(button) {
    const codeBlock = button.closest('.code-editor')?.querySelector('code');
    if (!codeBlock) return;
    
    const code = codeBlock.textContent;

    navigator.clipboard.writeText(code).then(() => {
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('Failed to copy code', 'error');
    });
};

// ============================================
// Mark Lesson as Complete
// ============================================

async function markLessonComplete(autoTriggered = false) {
    if (!currentLesson || !currentUser) return;

    const isAlreadyCompleted = completedLessons.includes(currentLesson.id);

    if (isAlreadyCompleted) return;

    try {
        // Insert or update lesson progress
        const { error } = await supabase
            .from('lesson_progress')
            .upsert({
                user_id: currentUser.id,
                lesson_id: currentLesson.id,
                enrollment_id: enrollmentId,
                is_completed: true,
                completed_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,lesson_id'
            });

        if (error) {
            console.error('Error marking lesson complete:', error);
            showNotification('Failed to mark lesson as complete', 'error');
            return;
        }

        // Add to completed list
        completedLessons.push(currentLesson.id);

        // Update UI
        updateMarkCompleteButton();

        // Update sidebar
        const lessonItem = document.querySelector(`[data-lesson-id="${currentLesson.id}"]`);
        if (lessonItem) {
            lessonItem.classList.remove('locked');
            const icon = lessonItem.querySelector('.lesson-icon');
            if (icon) {
                icon.classList.remove('unlocked');
                icon.classList.add('completed');
                const iconEl = icon.querySelector('i');
                if (iconEl) iconEl.className = 'fas fa-check-circle';
            }
        }

        // Unlock next lesson
        const nextLesson = allLessons.find(l => l.order_index === currentLesson.order_index + 1);
        if (nextLesson) {
            const nextLessonItem = document.querySelector(`[data-lesson-id="${nextLesson.id}"]`);
            if (nextLessonItem) {
                nextLessonItem.classList.remove('locked');
                nextLessonItem.setAttribute('onclick', `loadLesson('${nextLesson.id}')`);
                
                const icon = nextLessonItem.querySelector('.lesson-icon');
                if (icon) {
                    icon.classList.remove('locked');
                    icon.classList.add('unlocked');
                    const iconEl = icon.querySelector('i');
                    if (iconEl) iconEl.className = 'fas fa-circle';
                }
            }
        }

        // Update course progress
        await updateCourseProgress();

        // Show success message
        const message = autoTriggered ? 
            'Lesson completed automatically!' : 
            'Lesson completed! Great job!';
        showNotification(message, 'success');

        // Update navigation buttons
        updateNavigationButtons();

    } catch (error) {
        console.error('Unexpected error:', error);
        showNotification('An error occurred', 'error');
    }
}

// ============================================
// Update Course Progress
// ============================================

async function updateCourseProgress() {
    const totalLessons = allLessons.length;
    const completedCount = completedLessons.length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    try {
        // Update database
        const { error } = await supabase
            .from('enrollments')
            .update({
                progress_percentage: progressPercentage,
                last_accessed_at: new Date().toISOString()
            })
            .eq('id', enrollmentId);

        if (error) {
            console.error('Error updating course progress:', error);
            return;
        }

        // Update UI
        updateProgressCircle(progressPercentage);

        // Check if course is complete
        if (progressPercentage === 100) {
            await handleCourseCompletion();
        }
    } catch (error) {
        console.error('Error in updateCourseProgress:', error);
    }
}

async function handleCourseCompletion() {
    try {
        const { error } = await supabase
            .from('enrollments')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString()
            })
            .eq('id', enrollmentId);

        if (error) {
            console.error('Error marking course as completed:', error);
        } else {
            showNotification('🎉 Congratulations! You completed the course!', 'success');
        }
    } catch (error) {
        console.error('Error in handleCourseCompletion:', error);
    }
}

function updateProgressCircle(percentage) {
    const circle = document.getElementById('progressCircleFill');
    const text = document.getElementById('progressText');

    if (circle) {
        const circumference = 439.823; // 2 * PI * 70
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
    
    if (text) {
        text.textContent = `${percentage}%`;
    }
}
// ============================================
// Update Last Accessed
// ============================================

async function updateLastAccessed(lessonId) {
    if (!enrollmentId) return;

    try {
        await supabase
            .from('enrollments')
            .update({
                last_accessed_at: new Date().toISOString()
            })
            .eq('id', enrollmentId);
    } catch (error) {
        console.error('Error updating last accessed:', error);
    }
}

// ============================================
// Navigation
// ============================================

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevLessonBtn');
    const nextBtn = document.getElementById('nextLessonBtn');

    if (!currentLesson || !prevBtn || !nextBtn) return;

    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);

    // Previous button
    if (currentIndex > 0) {
        prevBtn.disabled = false;
        prevBtn.onclick = () => {
            const prevLesson = allLessons[currentIndex - 1];
            loadLesson(prevLesson.id);
        };
    } else {
        prevBtn.disabled = true;
        prevBtn.onclick = null;
    }

    // Next button
    if (currentIndex < allLessons.length - 1) {
        const nextLesson = allLessons[currentIndex + 1];
        const isNextUnlocked = isLessonUnlocked(nextLesson);

        nextBtn.disabled = !isNextUnlocked;
        if (isNextUnlocked) {
            nextBtn.onclick = () => loadLesson(nextLesson.id);
        } else {
            nextBtn.onclick = null;
        }
    } else {
        nextBtn.disabled = true;
        nextBtn.onclick = null;
    }
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Mark complete button - REMOVED manual click handler
    // System will auto-complete based on engagement tracking
    
    // Module collapse/expand
    document.addEventListener('click', (e) => {
        const moduleHeader = e.target.closest('.module-header');
        if (moduleHeader) {
            const moduleItem = moduleHeader.closest('.module-item');
            if (moduleItem) {
                moduleItem.classList.toggle('expanded');
            }
        }
    });

    // Collapse all button
    const collapseAllBtn = document.getElementById('collapseAllBtn');
    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', () => {
            const modules = document.querySelectorAll('.module-item');
            const allExpanded = Array.from(modules).every(m => m.classList.contains('expanded'));

            modules.forEach(module => {
                if (allExpanded) {
                    module.classList.remove('expanded');
                } else {
                    module.classList.add('expanded');
                }
            });
        });
    }

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        stopEngagementTracking();
    });
}

// ============================================
// Quiz Interaction Functions
// ============================================

let quizState = {
    answers: {},
    correctAnswers: 0,
    totalQuestions: 0,
    allAnswered: false
};

window.handleQuizAnswer = function(questionIndex, selectedAnswer, correctAnswer) {
    const questionElement = document.querySelector(`[data-question-index="${questionIndex}"]`);
    if (!questionElement) return;

    const feedbackElement = questionElement.querySelector('.question-feedback');
    const options = questionElement.querySelectorAll('.quiz-option');

    // Disable all options for this question
    options.forEach(option => {
        const input = option.querySelector('input');
        if (input) input.disabled = true;
    });

    // Mark correct and incorrect answers
    const isCorrect = selectedAnswer === correctAnswer;
    quizState.answers[questionIndex] = isCorrect;

    options.forEach((option, index) => {
        if (index === correctAnswer) {
            option.classList.add('correct');
        } else if (index === selectedAnswer && !isCorrect) {
            option.classList.add('incorrect');
        }
    });

    // Show feedback
    if (feedbackElement) {
        feedbackElement.style.display = 'block';
        if (isCorrect) {
            feedbackElement.innerHTML = '<i class="fas fa-check-circle"></i> Correct! Well done!';
            feedbackElement.className = 'question-feedback correct';
        } else {
            feedbackElement.innerHTML = '<i class="fas fa-times-circle"></i> Incorrect. The correct answer is highlighted above.';
            feedbackElement.className = 'question-feedback incorrect';
        }
    }

    // Update quiz score
    updateQuizScore();
};

function updateQuizScore() {
    const totalAnswered = Object.keys(quizState.answers).length;
    const correctAnswers = Object.values(quizState.answers).filter(a => a).length;
    const totalQuestions = document.querySelectorAll('.quiz-question').length;

    quizState.correctAnswers = correctAnswers;
    quizState.totalQuestions = totalQuestions;

    // Show summary if all questions answered
    if (totalAnswered === totalQuestions && !quizState.allAnswered) {
        quizState.allAnswered = true;
        
        const summaryElement = document.querySelector('.quiz-summary');
        const scoreElement = document.getElementById('quizScore');

        if (summaryElement) summaryElement.style.display = 'flex';
        if (scoreElement) scoreElement.textContent = correctAnswers;

        // Calculate percentage
        const percentage = (correctAnswers / totalQuestions) * 100;

        // Auto-mark lesson as complete if passed (70% or higher)
        if (percentage >= 70) {
            showNotification(`Great job! You scored ${Math.round(percentage)}%`, 'success');
            setTimeout(() => {
                autoCompleteLessonIfEligible('quiz');
            }, 1500);
        } else {
            showNotification(`You scored ${Math.round(percentage)}%. Try again to pass (70% required).`, 'info');
        }
    }
}

window.retryQuiz = function() {
    // Reset quiz state
    quizState = { 
        answers: {}, 
        correctAnswers: 0, 
        totalQuestions: 0,
        allAnswered: false
    };

    // Re-render the current lesson
    if (currentLesson) {
        renderLessonContent(currentLesson);
    }
};

// ============================================
// Notification System
// ============================================

function showNotification(message, type = 'info') {
    // Create notification element
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
    
    // Add to body
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ============================================
// Add CSS for notifications (inject into page)
// ============================================

(function injectNotificationStyles() {
    const style = document.createElement('style');
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
        
        /* Lesson Progress Indicator Styles */
        .lesson-progress-indicator {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 24px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .progress-info {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            font-size: 15px;
            font-weight: 500;
        }
        
        .progress-info i {
            font-size: 20px;
        }
        
        .progress-bar-container {
            background: rgba(255,255,255,0.2);
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 8px;
        }
        
        .progress-bar {
            height: 100%;
            background: #10b981;
            border-radius: 4px;
            transition: width 0.3s ease, background 0.3s ease;
        }
        
        .progress-percentage {
            text-align: right;
            font-weight: 600;
            font-size: 14px;
        }
        
        .manual-complete-notice {
            text-align: center;
            padding: 20px;
        }
        
        .manual-complete-notice i {
            font-size: 32px;
            margin-bottom: 12px;
            display: block;
        }
        
        .manual-complete-notice p {
            margin: 12px 0;
            font-size: 15px;
        }
        
        .btn-manual-complete {
            background: white;
            color: #667eea;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-top: 12px;
            transition: transform 0.2s ease;
        }
        
        .btn-manual-complete:hover {
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
})();