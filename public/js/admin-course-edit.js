// ============================================
// Admin Course Edit - JavaScript
// ============================================

let courseId = null;
let currentCourse = null;
let allLessons = [];
let isDirty = false;

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Get course ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    courseId = urlParams.get('id');

    if (!courseId) {
        showToast('No course ID provided', 'error');
        setTimeout(() => window.location.href = 'admin.html', 2000);
        return;
    }

    await checkAdminAccess();
    setupEventListeners();
    await loadCourse();
    await loadLessons();
});

// ============================================
// Check Admin Access
// ============================================

async function checkAdminAccess() {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            window.location.href = 'index.html';
            return;
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || !profile || profile.role !== 'admin') {
            showToast('Access denied. Admin only.', 'error');
            setTimeout(() => window.location.href = 'home.html', 2000);
            return;
        }
    } catch (error) {
        console.error('Error checking admin access:', error);
        window.location.href = 'index.html';
    }
}

// ============================================
// Load Course Data
// ============================================

async function loadCourse() {
    try {
        const { data: course, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();

        if (error) throw error;

        if (!course) {
            showToast('Course not found', 'error');
            setTimeout(() => window.location.href = 'admin.html', 2000);
            return;
        }

        currentCourse = course;
        populateCourseForm(course);

    } catch (error) {
        console.error('Error loading course:', error);
        showToast('Failed to load course: ' + error.message, 'error');
    }
}

function populateCourseForm(course) {
    document.getElementById('course-title-display').textContent = course.title;
    document.getElementById('course-title').value = course.title || '';
    document.getElementById('course-short-desc').value = course.short_description || '';
    document.getElementById('course-description').value = course.description || '';
    document.getElementById('course-category').value = course.category || '';
    document.getElementById('course-difficulty').value = course.difficulty || '';
    document.getElementById('course-duration').value = course.duration_hours || '';
    document.getElementById('course-slug').value = course.slug || '';
    document.getElementById('course-thumbnail').value = course.thumbnail_url || '';
    document.getElementById('course-cover').value = course.cover_image_url || '';

    // Prerequisites
    if (Array.isArray(course.prerequisites)) {
        document.getElementById('course-prerequisites').value = course.prerequisites.join('\n');
    }

    // Learning objectives
    if (Array.isArray(course.learning_objectives)) {
        document.getElementById('course-objectives').value = course.learning_objectives.join('\n');
    }

    document.getElementById('course-published').checked = course.is_published || false;
    document.getElementById('course-featured').checked = course.is_featured || false;
}

// ============================================
// Load Lessons
// ============================================

async function loadLessons() {
    try {
        const { data: lessons, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', courseId)
            .order('order_index', { ascending: true });

        if (error) throw error;

        allLessons = lessons || [];
        renderLessons();

    } catch (error) {
        console.error('Error loading lessons:', error);
        showToast('Failed to load lessons: ' + error.message, 'error');
    }
}

function renderLessons() {
    const container = document.getElementById('lessons-container');

    if (!allLessons || allLessons.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <p>No lessons yet. Click "Add Lesson" to create your first lesson.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = allLessons.map((lesson, index) => `
        <div class="lesson-item" data-lesson-id="${lesson.id}">
            <div class="lesson-drag-handle">
                <i class="fas fa-grip-vertical"></i>
            </div>
            <div class="lesson-info">
                <div class="lesson-header">
                    <span class="lesson-number">${index + 1}</span>
                    <h4 class="lesson-title">${escapeHtml(lesson.title)}</h4>
                    <span class="lesson-type-badge lesson-type-${lesson.content_type}">
                        ${getLessonTypeIcon(lesson.content_type)} ${lesson.content_type}
                    </span>
                    ${lesson.module_name ? `<span class="lesson-module">${escapeHtml(lesson.module_name)}</span>` : ''}
                </div>
                ${lesson.description ? `<p class="lesson-description">${escapeHtml(lesson.description)}</p>` : ''}
                <div class="lesson-meta">
                    <span><i class="fas fa-award"></i> ${lesson.xp_reward || 10} XP</span>
                    ${lesson.video_duration_minutes ? `<span><i class="fas fa-clock"></i> ${lesson.video_duration_minutes} min</span>` : ''}
                    <span class="lesson-status ${lesson.is_published ? 'published' : 'draft'}">
                        ${lesson.is_published ? 'Published' : 'Draft'}
                    </span>
                </div>
            </div>
            <div class="lesson-actions">
                <button class="btn-icon" onclick="editLesson('${lesson.id}')" title="Edit lesson">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-danger" onclick="deleteLesson('${lesson.id}')" title="Delete lesson">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function getLessonTypeIcon(type) {
    const icons = {
        'text': '<i class="fas fa-file-alt"></i>',
        'video': '<i class="fas fa-video"></i>',
        'quiz': '<i class="fas fa-question-circle"></i>'
    };
    return icons[type] || '<i class="fas fa-file"></i>';
}

// ============================================
// Save Course
// ============================================

async function saveCourse() {
    const saveBtn = document.getElementById('save-course-btn');
    const originalText = saveBtn.innerHTML;

    try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        // Get form values
        const title = document.getElementById('course-title').value.trim();
        const shortDesc = document.getElementById('course-short-desc').value.trim();
        const description = document.getElementById('course-description').value.trim();
        const category = document.getElementById('course-category').value;
        const difficulty = document.getElementById('course-difficulty').value;
        const duration = parseInt(document.getElementById('course-duration').value) || null;
        const slug = document.getElementById('course-slug').value.trim();
        const thumbnail = document.getElementById('course-thumbnail').value.trim();
        const cover = document.getElementById('course-cover').value.trim();
        const prerequisites = document.getElementById('course-prerequisites').value
            .split('\n')
            .map(p => p.trim())
            .filter(p => p.length > 0);
        const objectives = document.getElementById('course-objectives').value
            .split('\n')
            .map(o => o.trim())
            .filter(o => o.length > 0);
        const isPublished = document.getElementById('course-published').checked;
        const isFeatured = document.getElementById('course-featured').checked;

        // Validation
        if (!title) {
            showToast('Course title is required', 'error');
            return;
        }
        if (!category) {
            showToast('Course category is required', 'error');
            return;
        }
        if (!difficulty) {
            showToast('Course difficulty is required', 'error');
            return;
        }
        if (!slug) {
            showToast('Course slug is required', 'error');
            return;
        }

        const courseData = {
            title,
            short_description: shortDesc || null,
            description: description || null,
            category,
            difficulty,
            duration_hours: duration,
            slug,
            thumbnail_url: thumbnail || null,
            cover_image_url: cover || null,
            prerequisites: prerequisites.length > 0 ? prerequisites : null,
            learning_objectives: objectives.length > 0 ? objectives : null,
            is_published: isPublished,
            is_featured: isFeatured,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('courses')
            .update(courseData)
            .eq('id', courseId);

        if (error) throw error;

        showToast('Course updated successfully!', 'success');
        isDirty = false;

        // Update header title
        document.getElementById('course-title-display').textContent = title;

    } catch (error) {
        console.error('Error saving course:', error);
        showToast('Failed to save course: ' + error.message, 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    }
}

// ============================================
// Lesson Modal
// ============================================

function openLessonModal(lesson = null) {
    const modal = document.getElementById('lesson-modal');
    const titleEl = document.getElementById('lesson-modal-title');
    const form = document.getElementById('lesson-form');

    form.reset();

    if (lesson) {
        titleEl.textContent = 'Edit Lesson';
        document.getElementById('lesson-id').value = lesson.id;
        document.getElementById('lesson-title').value = lesson.title || '';
        document.getElementById('lesson-slug').value = lesson.slug || '';
        document.getElementById('lesson-module').value = lesson.module_name || '';
        document.getElementById('lesson-content-type').value = lesson.content_type || '';
        document.getElementById('lesson-xp').value = lesson.xp_reward || 10;
        document.getElementById('lesson-description').value = lesson.description || '';
        document.getElementById('lesson-order-index').value = lesson.order_index;

        // Content type specific fields
        if (lesson.content_type === 'text') {
            document.getElementById('lesson-text-content').value = lesson.text_content || '';
        } else if (lesson.content_type === 'video') {
            document.getElementById('lesson-video-url').value = lesson.video_url || '';
            document.getElementById('lesson-video-duration').value = lesson.video_duration_minutes || '';
        } else if (lesson.content_type === 'quiz') {
            document.getElementById('lesson-quiz-id').value = lesson.quiz_id || '';
        }

        document.getElementById('lesson-published').checked = lesson.is_published !== false;

        showContentTypeFields(lesson.content_type);
    } else {
        titleEl.textContent = 'Add Lesson';
        document.getElementById('lesson-order-index').value = allLessons.length;
        document.getElementById('lesson-published').checked = true;
    }

    modal.classList.add('active');
    lockBodyScroll();
}

function closeLessonModal() {
    const modal = document.getElementById('lesson-modal');
    modal.classList.remove('active');
    unlockBodyScroll();
    document.getElementById('lesson-form').reset();
}

async function editLesson(lessonId) {
    const lesson = allLessons.find(l => l.id === lessonId);
    if (lesson) {
        openLessonModal(lesson);
    }
}

async function deleteLesson(lessonId) {
    const lesson = allLessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const confirmed = confirm(`Are you sure you want to delete "${lesson.title}"?\n\nThis action cannot be undone.`);
    if (!confirmed) return;

    try {
        const { error } = await supabase
            .from('lessons')
            .delete()
            .eq('id', lessonId);

        if (error) throw error;

        showToast('Lesson deleted successfully', 'success');
        await loadLessons();

    } catch (error) {
        console.error('Error deleting lesson:', error);
        showToast('Failed to delete lesson: ' + error.message, 'error');
    }
}

// ============================================
// Save Lesson
// ============================================

async function saveLesson(e) {
    e.preventDefault();

    const lessonId = document.getElementById('lesson-id').value;
    const title = document.getElementById('lesson-title').value.trim();
    const slug = document.getElementById('lesson-slug').value.trim();
    const moduleName = document.getElementById('lesson-module').value.trim();
    const contentType = document.getElementById('lesson-content-type').value;
    const xpReward = parseInt(document.getElementById('lesson-xp').value) || 10;
    const description = document.getElementById('lesson-description').value.trim();
    const orderIndex = parseInt(document.getElementById('lesson-order-index').value);
    const isPublished = document.getElementById('lesson-published').checked;

    if (!title || !contentType) {
        showToast('Title and content type are required', 'error');
        return;
    }

    const lessonData = {
        course_id: courseId,
        title,
        slug: slug || generateSlug(title),
        module_name: moduleName || null,
        content_type: contentType,
        xp_reward: xpReward,
        description: description || null,
        order_index: orderIndex,
        is_published: isPublished,
        updated_at: new Date().toISOString()
    };

    // Add content type specific fields
    if (contentType === 'text') {
        lessonData.text_content = document.getElementById('lesson-text-content').value.trim() || null;
        lessonData.video_url = null;
        lessonData.video_duration_minutes = null;
        lessonData.quiz_id = null;
    } else if (contentType === 'video') {
        lessonData.video_url = document.getElementById('lesson-video-url').value.trim() || null;
        lessonData.video_duration_minutes = parseInt(document.getElementById('lesson-video-duration').value) || null;
        lessonData.text_content = null;
        lessonData.quiz_id = null;
    } else if (contentType === 'quiz') {
        lessonData.quiz_id = document.getElementById('lesson-quiz-id').value || null;
        lessonData.text_content = null;
        lessonData.video_url = null;
        lessonData.video_duration_minutes = null;
    }

    try {
        let error;
        if (lessonId) {
            // Update existing lesson
            ({ error } = await supabase
                .from('lessons')
                .update(lessonData)
                .eq('id', lessonId));
        } else {
            // Create new lesson
            ({ error } = await supabase
                .from('lessons')
                .insert([lessonData]));
        }

        if (error) throw error;

        showToast(lessonId ? 'Lesson updated successfully!' : 'Lesson created successfully!', 'success');
        closeLessonModal();
        await loadLessons();

    } catch (error) {
        console.error('Error saving lesson:', error);
        showToast('Failed to save lesson: ' + error.message, 'error');
    }
}

// ============================================
// Content Type Switching
// ============================================

function showContentTypeFields(type) {
    // Hide all
    document.querySelectorAll('.content-type-fields').forEach(el => {
        el.style.display = 'none';
    });

    // Show selected
    if (type === 'text') {
        document.getElementById('text-content-fields').style.display = 'block';
    } else if (type === 'video') {
        document.getElementById('video-content-fields').style.display = 'block';
    } else if (type === 'quiz') {
        document.getElementById('quiz-content-fields').style.display = 'block';
    }
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Save course button
    document.getElementById('save-course-btn').addEventListener('click', saveCourse);

    // Add lesson button
    document.getElementById('add-lesson-btn').addEventListener('click', () => openLessonModal());

    // Lesson form
    document.getElementById('lesson-form').addEventListener('submit', saveLesson);

    // Content type change
    document.getElementById('lesson-content-type').addEventListener('change', (e) => {
        showContentTypeFields(e.target.value);
    });

    // Auto-generate slug from title
    document.getElementById('course-title').addEventListener('input', (e) => {
        const slugInput = document.getElementById('course-slug');
        if (!slugInput.value || slugInput.value === generateSlug(currentCourse?.title || '')) {
            slugInput.value = generateSlug(e.target.value);
        }
    });

    document.getElementById('lesson-title').addEventListener('input', (e) => {
        const slugInput = document.getElementById('lesson-slug');
        if (!slugInput.value) {
            slugInput.value = generateSlug(e.target.value);
        }
    });

    // Settings collapsible
    document.getElementById('settings-toggle').addEventListener('click', () => {
        const content = document.getElementById('settings-content');
        const toggle = document.getElementById('settings-toggle');

        if (content.classList.contains('expanded')) {
            content.classList.remove('expanded');
            toggle.classList.remove('expanded');
        } else {
            content.classList.add('expanded');
            toggle.classList.add('expanded');
        }
    });

    // Track changes
    document.querySelectorAll('#course-title, #course-short-desc, #course-description, #course-category, #course-difficulty').forEach(el => {
        el.addEventListener('input', () => {
            isDirty = true;
        });
    });

    // Warn before leaving if unsaved
    window.addEventListener('beforeunload', (e) => {
        if (isDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

// ============================================
// Utility Functions
// ============================================

function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function lockBodyScroll() {
    document.body.style.overflow = 'hidden';
}

function unlockBodyScroll() {
    document.body.style.overflow = '';
}
