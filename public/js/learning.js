// ============================================
// Learning Page - Database Integration
// Dynamically loads course lessons from Supabase
// ============================================

// Use the supabase client from script.js (already initialized)

let currentUser = null;
let currentCourse = null;
let allLessons = [];
let currentLesson = null;
let completedLessons = [];
let enrollmentId = null;

// ============================================
// Initialize Page
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Get course slug from URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseSlug = urlParams.get('course');

    if (!courseSlug) {
        alert('No course specified');
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
            alert('Please log in to access this course');
            window.location.href = 'index.html';
            return;
        }

        currentUser = user;

        // Load course data
        await loadCourse(courseSlug);

        // Load or create enrollment
        await loadEnrollment();

        // Load lessons
        await loadLessons();

        // Load completed lessons
        await loadCompletedLessons();

        // Render lessons list
        renderLessonsList();

        // Setup event listeners
        setupEventListeners();

    } catch (error) {
        console.error('Error initializing learning page:', error);
        alert('Error loading course. Please try again.');
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
        alert('Course not found');
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
    document.getElementById('courseTitle').textContent = currentCourse.title;
    document.getElementById('courseDescription').textContent = currentCourse.description || '';

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
// Load Enrollment
// ============================================

async function loadEnrollment() {
    // Check if already enrolled
    const { data: existingEnrollment, error: checkError } = await supabase
        .from('enrollments')
        .select('id, progress_percentage')
        .eq('user_id', currentUser.id)
        .eq('course_id', currentCourse.id)
        .single();

    if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking enrollment:', checkError);
        return;
    }

    if (existingEnrollment) {
        enrollmentId = existingEnrollment.id;
        updateProgressCircle(existingEnrollment.progress_percentage || 0);
        return;
    }

    // Create new enrollment
    const { data: newEnrollment, error: createError } = await supabase
        .from('enrollments')
        .insert({
            user_id: currentUser.id,
            course_id: currentCourse.id,
            status: 'active',
            progress_percentage: 0
        })
        .select()
        .single();

    if (createError) {
        console.error('Error creating enrollment:', createError);
        return;
    }

    enrollmentId = newEnrollment.id;
    updateProgressCircle(0);
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
        .select('lesson_id')
        .eq('user_id', currentUser.id)
        .eq('completed', true);

    if (error) {
        console.error('Error loading lesson progress:', error);
        return;
    }

    completedLessons = progress ? progress.map(p => p.lesson_id) : [];
}

// ============================================
// Render Lessons List
// ============================================

function renderLessonsList() {
    const lessonsList = document.getElementById('lessonsList');

    if (allLessons.length === 0) {
        lessonsList.innerHTML = `
            <div class="lessons-loading">
                <i class="fas fa-book-open"></i>
                <p>No lessons available yet</p>
            </div>
        `;
        return;
    }

    // Group lessons by module (assuming module is a property or we group by chunks)
    // For now, we'll create a single module or group lessons
    // If you have a module_name field, we can group by that

    // Simple approach: Create modules of 5 lessons each or use module field if exists
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
                    ${renderModuleLessons(module.lessons, moduleIndex)}
                </div>
            </div>
        `;
    }).join('');
}

function groupLessonsIntoModules(lessons) {
    // If lessons have a module field, group by that
    // Otherwise, create modules of ~5 lessons each

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

function renderModuleLessons(lessons, moduleIndex) {
    return lessons.map((lesson, index) => {
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
                 onclick="${isLocked ? '' : `loadLesson('${lesson.id}')`}">
                <div class="lesson-icon ${iconClass}">
                    <i class="fas ${iconName}"></i>
                </div>
                <div class="lesson-info">
                    <div class="lesson-name">${lesson.title}</div>
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
        'code': 'Code Exercise'
    };
    return types[contentType] || 'Lesson';
}

// ============================================
// Load Lesson Content
// ============================================

async function loadLesson(lessonId) {
    const lesson = allLessons.find(l => l.id === lessonId);

    if (!lesson) return;

    currentLesson = lesson;

    // Update UI
    document.getElementById('lessonTitle').textContent = lesson.title;

    // Show mark complete button
    const markCompleteBtn = document.getElementById('markCompleteBtn');
    const isCompleted = completedLessons.includes(lesson.id);

    if (isCompleted) {
        markCompleteBtn.textContent = 'Completed';
        markCompleteBtn.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
        markCompleteBtn.classList.add('completed');
        markCompleteBtn.style.display = 'flex';
    } else {
        markCompleteBtn.textContent = 'Mark as Complete';
        markCompleteBtn.innerHTML = '<i class="fas fa-check-circle"></i> Mark as Complete';
        markCompleteBtn.classList.remove('completed');
        markCompleteBtn.style.display = 'flex';
    }

    // Render lesson content
    renderLessonContent(lesson);

    // Update navigation buttons
    updateNavigationButtons();

    // Show navigation
    document.getElementById('lessonNavigation').style.display = 'flex';

    // Update active state in sidebar
    document.querySelectorAll('.lesson-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-lesson-id="${lessonId}"]`)?.classList.add('active');

    // Update last accessed
    await updateLastAccessed(lessonId);
}

// Make it global
window.loadLesson = loadLesson;

// ============================================
// Render Lesson Content
// ============================================

function renderLessonContent(lesson) {
    const contentArea = document.getElementById('lessonContent');

    switch (lesson.content_type) {
        case 'video':
            contentArea.innerHTML = renderVideoContent(lesson);
            break;
        case 'text':
            contentArea.innerHTML = renderTextContent(lesson);
            break;
        case 'code':
            contentArea.innerHTML = renderCodeContent(lesson);
            // Re-apply syntax highlighting
            setTimeout(() => {
                if (window.Prism) {
                    Prism.highlightAll();
                }
            }, 100);
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

    // Check if it's a YouTube or Vimeo URL
    let embedHtml = '';

    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const videoId = extractYouTubeId(videoUrl);
        embedHtml = `
            <div class="video-content">
                <div class="video-wrapper">
                    <iframe src="https://www.youtube.com/embed/${videoId}"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                    </iframe>
                </div>
                ${lesson.content ? `<div class="text-content">${lesson.content}</div>` : ''}
            </div>
        `;
    } else if (videoUrl.includes('vimeo.com')) {
        const videoId = extractVimeoId(videoUrl);
        embedHtml = `
            <div class="video-content">
                <div class="video-wrapper">
                    <iframe src="https://player.vimeo.com/video/${videoId}"
                            frameborder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowfullscreen>
                    </iframe>
                </div>
                ${lesson.content ? `<div class="text-content">${lesson.content}</div>` : ''}
            </div>
        `;
    } else {
        // Direct video URL
        embedHtml = `
            <div class="video-content">
                <div class="video-wrapper">
                    <video controls>
                        <source src="${videoUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
                ${lesson.content ? `<div class="text-content">${lesson.content}</div>` : ''}
            </div>
        `;
    }

    return embedHtml;
}

function renderTextContent(lesson) {
    return `
        <div class="text-content">
            ${lesson.content || '<p>No content available for this lesson.</p>'}
        </div>
    `;
}

function renderCodeContent(lesson) {
    // Assume lesson.content contains code
    const code = lesson.content || '// No code available';
    const language = lesson.code_language || 'python';

    return `
        <div class="code-content">
            <div class="code-editor">
                <div class="code-header">
                    <span class="code-language">${language}</span>
                    <button class="code-copy-btn" onclick="copyCode(this)">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="code-body">
                    <pre><code class="language-${language}">${escapeHtml(code)}</code></pre>
                </div>
            </div>
        </div>
    `;
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
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

window.copyCode = function(button) {
    const codeBlock = button.closest('.code-editor').querySelector('code');
    const code = codeBlock.textContent;

    navigator.clipboard.writeText(code).then(() => {
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 2000);
    });
};

// ============================================
// Mark Lesson as Complete
// ============================================

async function markLessonComplete() {
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
                completed: true,
                completed_at: new Date()
            });

        if (error) {
            console.error('Error marking lesson complete:', error);
            alert('Failed to mark lesson as complete');
            return;
        }

        // Add to completed list
        completedLessons.push(currentLesson.id);

        // Update UI
        const markCompleteBtn = document.getElementById('markCompleteBtn');
        markCompleteBtn.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
        markCompleteBtn.classList.add('completed');

        // Update sidebar
        const lessonItem = document.querySelector(`[data-lesson-id="${currentLesson.id}"]`);
        if (lessonItem) {
            lessonItem.classList.remove('locked');
            const icon = lessonItem.querySelector('.lesson-icon');
            icon.classList.remove('unlocked');
            icon.classList.add('completed');
            icon.querySelector('i').className = 'fas fa-check-circle';
        }

        // Unlock next lesson
        const nextLesson = allLessons.find(l => l.order_index === currentLesson.order_index + 1);
        if (nextLesson) {
            const nextLessonItem = document.querySelector(`[data-lesson-id="${nextLesson.id}"]`);
            if (nextLessonItem) {
                nextLessonItem.classList.remove('locked');
                nextLessonItem.setAttribute('onclick', `loadLesson('${nextLesson.id}')`);
            }
        }

        // Update course progress
        await updateCourseProgress();

        // Show success message
        showNotification('Lesson completed! Great job!', 'success');

    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

// ============================================
// Update Course Progress
// ============================================

async function updateCourseProgress() {
    const totalLessons = allLessons.length;
    const completedCount = completedLessons.length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // Update database
    const { error } = await supabase
        .from('enrollments')
        .update({
            progress_percentage: progressPercentage,
            last_accessed_at: new Date()
        })
        .eq('id', enrollmentId);

    if (error) {
        console.error('Error updating course progress:', error);
        return;
    }

    // Update UI
    updateProgressCircle(progressPercentage);
}

function updateProgressCircle(percentage) {
    const circle = document.getElementById('progressCircleFill');
    const text = document.getElementById('progressText');

    const circumference = 339.292; // 2 * PI * r (r = 54)
    const offset = circumference - (percentage / 100) * circumference;

    circle.style.strokeDashoffset = offset;
    text.textContent = `${percentage}%`;
}

// ============================================
// Update Last Accessed
// ============================================

async function updateLastAccessed(lessonId) {
    if (!enrollmentId) return;

    await supabase
        .from('enrollments')
        .update({
            last_accessed_at: new Date()
        })
        .eq('id', enrollmentId);
}

// ============================================
// Navigation
// ============================================

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevLessonBtn');
    const nextBtn = document.getElementById('nextLessonBtn');

    if (!currentLesson) return;

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
    }

    // Next button
    if (currentIndex < allLessons.length - 1) {
        const nextLesson = allLessons[currentIndex + 1];
        const isNextUnlocked = isLessonUnlocked(nextLesson);

        nextBtn.disabled = !isNextUnlocked;
        nextBtn.onclick = () => {
            if (isNextUnlocked) {
                loadLesson(nextLesson.id);
            }
        };
    } else {
        nextBtn.disabled = true;
    }
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Mark complete button
    const markCompleteBtn = document.getElementById('markCompleteBtn');
    markCompleteBtn.addEventListener('click', markLessonComplete);

    // Module collapse/expand
    document.addEventListener('click', (e) => {
        if (e.target.closest('.module-header')) {
            const moduleItem = e.target.closest('.module-item');
            moduleItem.classList.toggle('expanded');
        }
    });

    // Collapse all button
    const collapseAllBtn = document.getElementById('collapseAllBtn');
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

// ============================================
// Notification
// ============================================

function showNotification(message, type = 'info') {
    // Simple alert for now - you can create a custom notification component
    if (type === 'success') {
        console.log('✅', message);
    } else {
        console.log('ℹ️', message);
    }
}
