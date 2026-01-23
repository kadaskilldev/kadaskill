// ============================================
// Admin Panel - Database Integration
// ============================================

let currentUser = null;
let currentSection = 'dashboard';
let engagementChart = null;
let categoryChart = null;

// User management state
let allUsers = [];
let filteredUsers = [];
let currentPage = 1;
let usersPerPage = 10;
let currentFilters = {
    search: '',
    role: 'all',
    status: 'all'
};

// Certification study resources state
let studyResources = [];

// Certification bulk selection state
let selectedCertIds = new Set();

// Certification filter state
let allCertifications = [];
let filteredCertifications = [];
let certFilters = {
    search: '',
    category: '',
    status: ''
};

// Certification pagination state
let certCurrentPage = 1;
let certPerPage = 10;

// Courses filter state
let allCourses = [];
let courseFilters = {
    category: '',
    difficulty: ''
};

// Exercises filter state
let allExercises = [];
let exerciseFilters = {
    category: '',
    difficulty: ''
};

const CERT_ICON_BUCKET = 'certification-icons';
const CERT_ICON_PLACEHOLDER = 'images/certifications/placeholder.png';

function lockBodyScroll() {
    document.body.classList.add('modal-open');
}

function unlockBodyScroll() {
    if (!document.querySelector('.modal.active')) {
        document.body.classList.remove('modal-open');
    }
}

// ============================================
// Certification Modal Helpers & Form Handling
// ============================================

function openCertModal(cert) {
    const modal = document.getElementById('cert-modal');
    if (!modal) return;

    const titleEl = document.getElementById('cert-modal-title');
    const idInput = document.getElementById('cert-id');
    const titleInput = document.getElementById('cert-title');
    const slugInput = document.getElementById('cert-slug');
    const providerInput = document.getElementById('cert-provider');
    const categoryInput = document.getElementById('cert-category');
    const levelInput = document.getElementById('cert-level');
    const descInput = document.getElementById('cert-description');
    const overviewInput = document.getElementById('cert-overview');
    const durationInput = document.getElementById('cert-duration');
    const examCodeInput = document.getElementById('cert-exam-code');
    const imageUrlInput = document.getElementById('cert-image-url');
    const officialUrlInput = document.getElementById('cert-official-url');
    const prereqInput = document.getElementById('cert-prerequisites');
    const activeCheckbox = document.getElementById('cert-active');
    const imagePreview = document.getElementById('cert-image-preview');

    if (cert) {
        titleEl.textContent = 'Edit Certification';
        idInput.value = cert.id;
        titleInput.value = cert.title || '';
        slugInput.value = cert.slug || '';
        providerInput.value = cert.provider || '';
        categoryInput.value = cert.category || '';
        levelInput.value = cert.level || '';
        descInput.value = cert.description || '';
        overviewInput.value = cert.overview || '';
        durationInput.value = cert.estimated_duration_hours || '';
        examCodeInput.value = cert.exam_code || '';
        imageUrlInput.value = cert.icon_url || '';
        officialUrlInput.value = cert.official_url || '';
        if (Array.isArray(cert.prerequisites)) {
            prereqInput.value = cert.prerequisites.join('\n');
        } else {
            prereqInput.value = '';
        }
        activeCheckbox.checked = cert.is_active !== false;

        // Load study resources
        studyResources = Array.isArray(cert.study_resources) ? cert.study_resources : [];
    } else {
        titleEl.textContent = 'Add New Certification';
        idInput.value = '';
        titleInput.value = '';
        slugInput.value = '';
        providerInput.value = '';
        categoryInput.value = '';
        levelInput.value = '';
        descInput.value = '';
        overviewInput.value = '';
        durationInput.value = '';
        examCodeInput.value = '';
        imageUrlInput.value = '';
        officialUrlInput.value = '';
        prereqInput.value = '';
        activeCheckbox.checked = true;

        // Reset study resources
        studyResources = [];
    }

    if (imagePreview && imageUrlInput) {
        const url = imageUrlInput.value.trim();
        imagePreview.src = url || CERT_ICON_PLACEHOLDER;
    }

    // Render study resources UI
    renderStudyResources();

    modal.classList.add('active');
    lockBodyScroll();
}

function closeCertModal() {
    const modal = document.getElementById('cert-modal');
    if (!modal) return;
    modal.classList.remove('active');
    unlockBodyScroll();

    const form = document.getElementById('cert-form');
    if (form) form.reset();

    const idInput = document.getElementById('cert-id');
    if (idInput) idInput.value = '';

    // Reset study resources and UI
    studyResources = [];
    renderStudyResources();

    const imagePreview = document.getElementById('cert-image-preview');
    if (imagePreview) {
        imagePreview.src = CERT_ICON_PLACEHOLDER;
    }
    const imageStatus = document.getElementById('cert-image-status');
    if (imageStatus) {
        imageStatus.style.display = 'none';
        imageStatus.textContent = '';
    }
    const imageFileInput = document.getElementById('cert-image-file');
    if (imageFileInput) {
        imageFileInput.value = '';
    }
}

async function handleCertFormSubmit(e) {
    e.preventDefault();

    const idInput = document.getElementById('cert-id');
    const titleInput = document.getElementById('cert-title');
    const slugInput = document.getElementById('cert-slug');
    const providerInput = document.getElementById('cert-provider');
    const categoryInput = document.getElementById('cert-category');
    const levelInput = document.getElementById('cert-level');
    const descInput = document.getElementById('cert-description');
    const overviewInput = document.getElementById('cert-overview');
    const durationInput = document.getElementById('cert-duration');
    const examCodeInput = document.getElementById('cert-exam-code');
    const imageUrlInput = document.getElementById('cert-image-url');
    const officialUrlInput = document.getElementById('cert-official-url');
    const prereqInput = document.getElementById('cert-prerequisites');
    const activeCheckbox = document.getElementById('cert-active');

    const certId = idInput.value;
    const title = titleInput.value.trim();
    const slug = slugInput.value.trim();
    const provider = providerInput.value.trim();
    const category = categoryInput.value;
    const level = levelInput.value;
    const description = descInput.value.trim();
    const overview = overviewInput.value.trim();
    const durationVal = parseInt(durationInput.value, 10);
    const examCode = examCodeInput.value.trim();
    const imageUrl = imageUrlInput.value.trim();
    const officialUrl = officialUrlInput.value.trim();
    const prereqText = prereqInput.value;
    const isActive = !!activeCheckbox.checked;

    // Clear previous validation state
    const requiredInputs = [titleInput, slugInput, categoryInput];
    requiredInputs.forEach(input => {
        if (!input) return;
        input.classList.remove('input-error');
        const group = input.closest('.form-group');
        const label = group ? group.querySelector('.form-label') : null;
        if (label) label.classList.remove('label-error');
    });

    // Validate required fields
    const missingInputs = [];
    if (!title) missingInputs.push(titleInput);
    if (!slug) missingInputs.push(slugInput);
    if (!category) missingInputs.push(categoryInput);

    if (missingInputs.length > 0) {
        missingInputs.forEach(input => {
            if (!input) return;
            input.classList.add('input-error');
            const group = input.closest('.form-group');
            const label = group ? group.querySelector('.form-label') : null;
            if (label) label.classList.add('label-error');
        });
        showToast('Please fill in all required fields (Title, Slug, Category).', 'error');
        return;
    }

    const saveButton = document.querySelector('#cert-form button[type="submit"]');
    const originalButtonHtml = saveButton ? saveButton.innerHTML : null;
    if (saveButton) {
        saveButton.disabled = true;
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    }

    const estimatedDuration = Number.isNaN(durationVal) ? null : durationVal;
    const prerequisites = prereqText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    // Normalize study resources
    const resources = Array.isArray(studyResources)
        ? studyResources
            .map(r => {
                const title = (r.title || '').trim();
                const url = (r.url || '').trim();
                const type = (r.type || 'documentation').trim() || 'documentation';
                return {
                    title,
                    url,
                    type,
                    is_completed: !!r.is_completed
                };
            })
            .filter(r => r.title || r.url)
        : [];

    const certData = {
        title,
        slug,
        provider: provider || null,
        category,
        level: level || null,
        description: description || null,
        overview: overview || null,
        estimated_duration_hours: estimatedDuration,
        exam_code: examCode || null,
        icon_url: imageUrl || null,
        official_url: officialUrl || null,
        study_resources: resources.length > 0 ? resources : null,
        prerequisites: prerequisites.length > 0 ? prerequisites : null,
        is_active: isActive,
        updated_at: new Date().toISOString()
    };

    try {
        let error = null;

        if (certId) {
            const { error: updateError } = await supabase
                .from('certifications')
                .update(certData)
                .eq('id', certId);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('certifications')
                .insert([certData]);
            error = insertError;
        }

        if (error) {
            console.error('Error saving certification:', error);
            showToast('Failed to save certification: ' + error.message, 'error');
            return;
        }

        showToast(certId ? 'Certification updated successfully.' : 'Certification created successfully.', 'success');
        closeCertModal();
        loadCertifications();

    } catch (err) {
        console.error('Unexpected error saving certification:', err);
        showToast('Failed to save certification', 'error');
    } finally {
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.innerHTML = originalButtonHtml;
        }
    }
}

// ============================================
// Initialize Page
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await checkAdminAccess();
    setupEventListeners();
    await loadDashboardStats();
    await loadEngagementChart();
    await loadCategoryChart();
    await loadTopPerformers();
    await loadRecentActivity();
    await loadCoursePerformance();

    // Slug auto-generation for certifications
    const certTitleInput = document.getElementById('cert-title');
    const certSlugInput = document.getElementById('cert-slug');
    if (certTitleInput && certSlugInput) {
        certTitleInput.addEventListener('input', () => {
            // Only auto-generate when slug is empty
            if (certSlugInput.value.trim()) return;
            certSlugInput.value = generateSlugFromTitle(certTitleInput.value);
        });

        certSlugInput.addEventListener('input', () => {
            // If user clears slug, allow auto-generation again
            if (!certSlugInput.value.trim()) {
                certSlugInput.dataset.userEdited = 'false';
            } else {
                certSlugInput.dataset.userEdited = 'true';
            }
        });
    }

    const imageUrlInput = document.getElementById('cert-image-url');
    const imagePreview = document.getElementById('cert-image-preview');
    const imageUploadBtn = document.getElementById('cert-image-upload-btn');
    const imageFileInput = document.getElementById('cert-image-file');
    const imageStatus = document.getElementById('cert-image-status');

    if (imageUrlInput && imagePreview) {
        const updatePreviewFromInput = () => {
            const url = imageUrlInput.value.trim();
            imagePreview.src = url || CERT_ICON_PLACEHOLDER;
        };
        imageUrlInput.addEventListener('input', updatePreviewFromInput);
    }

    if (imageUploadBtn && imageFileInput) {
        imageUploadBtn.addEventListener('click', () => {
            imageFileInput.click();
        });

        imageFileInput.addEventListener('change', async (event) => {
            const file = event.target.files && event.target.files[0];
            if (!file) return;

            if (file.size > 5 * 1024 * 1024) {
                showToast('File is too big! Please upload an image smaller than 5MB.', 'error');
                imageFileInput.value = '';
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                showToast('Your session has expired. Please log in again.', 'error');
                window.location.href = 'index.html';
                return;
            }

            const originalLabel = imageUploadBtn.textContent;
            imageUploadBtn.disabled = true;
            imageUploadBtn.textContent = 'Uploading...';
            if (imageStatus) {
                imageStatus.style.display = 'block';
                imageStatus.textContent = 'Uploading image...';
            }

            try {
                const fileExt = file.name.split('.').pop();
                const titleInput = document.getElementById('cert-title');
                const slugInputEl = document.getElementById('cert-slug');
                let slugValue = slugInputEl && slugInputEl.value ? slugInputEl.value.trim() : '';
                if (!slugValue && titleInput && titleInput.value) {
                    slugValue = generateSlugFromTitle(titleInput.value);
                }
                const safeSlug = slugValue || 'certification';
                const filePath = `${safeSlug}/${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from(CERT_ICON_BUCKET)
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: publicData } = supabase.storage
                    .from(CERT_ICON_BUCKET)
                    .getPublicUrl(filePath);

                const publicUrl = publicData && publicData.publicUrl ? publicData.publicUrl : null;
                if (!publicUrl) {
                    throw new Error('Could not get public URL for uploaded image.');
                }

                if (imageUrlInput) {
                    imageUrlInput.value = publicUrl;
                    const inputEvent = new Event('input', { bubbles: true });
                    imageUrlInput.dispatchEvent(inputEvent);
                }

                if (imageStatus) {
                    imageStatus.textContent = 'Image uploaded successfully.';
                }

            } catch (error) {
                console.error('Error uploading certification image:', error);
                showToast('Error uploading image: ' + (error.message || 'Unknown error'), 'error');
                if (imageStatus) {
                    imageStatus.textContent = 'Failed to upload image.';
                }
            } finally {
                imageUploadBtn.disabled = false;
                imageUploadBtn.textContent = originalLabel;
                if (imageStatus) {
                    setTimeout(() => {
                        imageStatus.style.display = 'none';
                        imageStatus.textContent = '';
                    }, 2000);
                }
                imageFileInput.value = '';
            }
        });
    }

    const bulkActivateBtn = document.getElementById('cert-bulk-activate');
    const bulkDeactivateBtn = document.getElementById('cert-bulk-deactivate');
    const bulkDeleteBtn = document.getElementById('cert-bulk-delete');

    if (bulkActivateBtn) {
        bulkActivateBtn.addEventListener('click', () => bulkUpdateCertStatus(true));
    }
    if (bulkDeactivateBtn) {
        bulkDeactivateBtn.addEventListener('click', () => bulkUpdateCertStatus(false));
    }
    if (bulkDeleteBtn) {
        bulkDeleteBtn.addEventListener('click', () => bulkDeleteCertifications());
    }
});

// ============================================
// Study Resources Management (Certifications)
// ============================================

function renderStudyResources() {
    const container = document.getElementById('study-resources-container');
    if (!container) return;

    if (!studyResources || studyResources.length === 0) {
        container.innerHTML = `
            <div class="empty-questions">
                <i class="fas fa-link"></i>
                <p>No study resources yet. Click "Add Resource" to add one.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = studyResources.map((res, index) => {
        const type = res.type || 'documentation';
        return `
            <div class="study-resource-row">
                <div class="form-row form-row-3">
                    <div class="form-group">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-input" value="${res.title || ''}"
                               oninput="updateStudyResourceTitle(${index}, this.value)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">URL</label>
                        <input type="text" class="form-input" value="${res.url || ''}"
                               placeholder="https://..."
                               oninput="updateStudyResourceUrl(${index}, this.value)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Type</label>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <select class="form-input" onchange="updateStudyResourceType(${index}, this.value)">
                                <option value="documentation" ${type === 'documentation' ? 'selected' : ''}>Documentation</option>
                                <option value="video" ${type === 'video' ? 'selected' : ''}>Video</option>
                                <option value="practice" ${type === 'practice' ? 'selected' : ''}>Practice</option>
                                <option value="article" ${type === 'article' ? 'selected' : ''}>Article</option>
                                <option value="course" ${type === 'course' ? 'selected' : ''}>Course</option>
                            </select>
                            <button type="button" class="btn-icon btn-danger" onclick="removeStudyResource(${index})" title="Remove resource">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function addStudyResource() {
    studyResources.push({
        title: '',
        url: '',
        type: 'documentation',
        is_completed: false
    });
    renderStudyResources();
}

function removeStudyResource(index) {
    if (!Array.isArray(studyResources)) return;
    studyResources.splice(index, 1);
    renderStudyResources();
}

function updateStudyResourceTitle(index, value) {
    if (!studyResources[index]) return;
    studyResources[index].title = value;
}

function updateStudyResourceUrl(index, value) {
    if (!studyResources[index]) return;
    studyResources[index].url = value;
}

function updateStudyResourceType(index, value) {
    if (!studyResources[index]) return;
    studyResources[index].type = value;
}

// ============================================
// Check Admin Access
// ============================================

async function checkAdminAccess() {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.log('No user logged in, redirecting to login');
            window.location.href = 'index.html';
            return;
        }

        currentUser = user;

        // Get user profile to check role
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username, full_name, avatar_url, role')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('Error loading profile:', profileError);
            alert('Failed to load admin profile');
            window.location.href = 'index.html';
            return;
        }

        // Check if user is admin
        if (profile.role !== 'admin') {
            alert('Access denied. Admin privileges required.');
            window.location.href = 'home.html';
            return;
        }

        // Update admin header
        updateAdminHeader(profile);

    } catch (error) {
        console.error('Unexpected error checking admin access:', error);
        window.location.href = 'index.html';
    }
}

// ============================================
// Update Admin Header
// ============================================

function updateAdminHeader(profile) {
    const usernameEl = document.getElementById('admin-username');
    if (usernameEl) {
        usernameEl.textContent = profile.full_name || profile.username;
    }

    const avatarEl = document.getElementById('admin-avatar');
    if (avatarEl && profile.avatar_url) {
        avatarEl.src = profile.avatar_url;
    }
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Sidebar navigation
    const navItems = document.querySelectorAll('.admin-nav-item[data-section]');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            switchSection(section);
        });
    });

    // Content Management expandable menu
    const contentToggle = document.getElementById('content-management-toggle');
    const contentSubnav = document.getElementById('content-subnav');

    if (contentToggle && contentSubnav) {
        contentToggle.addEventListener('click', () => {
            const isExpanded = contentSubnav.classList.contains('expanded');
            if (isExpanded) {
                contentSubnav.classList.remove('expanded');
                contentToggle.classList.remove('expanded');
            } else {
                contentSubnav.classList.add('expanded');
                contentToggle.classList.add('expanded');
            }
        });
    }

    // Subnav items
    const subnavItems = document.querySelectorAll('.admin-subnav-item[data-section]');
    subnavItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            switchSection(section);
        });
    });

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // User management filters
    const userSearch = document.getElementById('user-search');
    if (userSearch) {
        userSearch.addEventListener('input', (e) => {
            currentFilters.search = e.target.value;
            currentPage = 1;
            applyUserFilters();
        });
    }

    const roleFilter = document.getElementById('role-filter');
    if (roleFilter) {
        roleFilter.addEventListener('change', (e) => {
            currentFilters.role = e.target.value;
            currentPage = 1;
            applyUserFilters();
        });
    }

    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            currentFilters.status = e.target.value;
            currentPage = 1;
            applyUserFilters();
        });
    }

    // Course Performance filters
    const coursePerformanceSort = document.getElementById('course-performance-sort');
    if (coursePerformanceSort) {
        coursePerformanceSort.addEventListener('change', (e) => {
            coursePerformanceFilters.sort = e.target.value;
            renderCoursePerformance();
        });
    }

    const coursePerformanceStatus = document.getElementById('course-performance-status');
    if (coursePerformanceStatus) {
        coursePerformanceStatus.addEventListener('change', (e) => {
            coursePerformanceFilters.status = e.target.value;
            renderCoursePerformance();
        });
    }

    // Pagination buttons
    const usersPrevBtn = document.getElementById('users-prev-btn');
    if (usersPrevBtn) {
        usersPrevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderUsersTable();
            }
        });
    }

    const usersNextBtn = document.getElementById('users-next-btn');
    if (usersNextBtn) {
        usersNextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderUsersTable();
            }
        });
    }

    // Edit user form
    const editUserForm = document.getElementById('edit-user-form');
    if (editUserForm) {
        editUserForm.addEventListener('submit', handleEditUserSubmit);
    }

    // Modal overlay click to close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            const parentModal = overlay.closest('.modal');
            if (!parentModal) return;

            if (parentModal.id === 'edit-user-modal') {
                closeEditUserModal();
            } else if (parentModal.id === 'exercise-modal') {
                closeExerciseModal();
            } else if (parentModal.id === 'cert-modal') {
                closeCertModal();
            } else {
                parentModal.classList.remove('active');
                unlockBodyScroll();
            }
        });
    });

    // Add New Course button
    const addCourseBtn = document.getElementById('add-course-btn');
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', addNewCourse);
    }

    // Course filter event listeners
    const courseCategoryFilter = document.getElementById('course-category-filter');
    const courseDifficultyFilter = document.getElementById('course-difficulty-filter');

    if (courseCategoryFilter) {
        courseCategoryFilter.addEventListener('change', (e) => {
            courseFilters.category = e.target.value;
            applyCoursesFilters();
        });
    }

    if (courseDifficultyFilter) {
        courseDifficultyFilter.addEventListener('change', (e) => {
            courseFilters.difficulty = e.target.value;
            applyCoursesFilters();
        });
    }

    // Exercise filter event listeners
    const exerciseCategoryFilter = document.getElementById('exercise-category-filter');
    const exerciseDifficultyFilter = document.getElementById('exercise-difficulty-filter');

    if (exerciseCategoryFilter) {
        exerciseCategoryFilter.addEventListener('change', (e) => {
            exerciseFilters.category = e.target.value;
            applyExercisesFilters();
        });
    }

    if (exerciseDifficultyFilter) {
        exerciseDifficultyFilter.addEventListener('change', (e) => {
            exerciseFilters.difficulty = e.target.value;
            applyExercisesFilters();
        });
    }

    // Course inline editing - Back button
    const backToCoursesBtn = document.getElementById('back-to-courses-btn');
    if (backToCoursesBtn) {
        backToCoursesBtn.addEventListener('click', backToCoursesView);
    }

    // Course inline editing - Save button
    const saveCourseBtn = document.getElementById('save-course-btn-inline');
    if (saveCourseBtn) {
        saveCourseBtn.addEventListener('click', saveCourseInline);
    }

    // Course inline editing - Add Lesson button
    const addLessonBtn = document.getElementById('add-lesson-btn-inline');
    if (addLessonBtn) {
        addLessonBtn.addEventListener('click', addNewLessonInline);
    }

    // Collapsible triggers
    document.querySelectorAll('.collapsible-trigger').forEach(trigger => {
        trigger.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const target = document.getElementById(targetId);
            if (!target) return;

            const isExpanded = target.classList.contains('expanded');
            if (isExpanded) {
                target.classList.remove('expanded');
                this.classList.remove('expanded');
            } else {
                target.classList.add('expanded');
                this.classList.add('expanded');
            }
        });
    });
}

// ============================================
// Section Switching
// ============================================

function switchSection(sectionName) {
    // Update main nav items
    const navItems = document.querySelectorAll('.admin-nav-item[data-section]');
    navItems.forEach(item => {
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update subnav items
    const subnavItems = document.querySelectorAll('.admin-subnav-item[data-section]');
    subnavItems.forEach(item => {
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Auto-expand Content Management if navigating to courses/certifications/exercises
    const contentSections = ['courses', 'certifications', 'exercises'];
    if (contentSections.includes(sectionName)) {
        const contentToggle = document.getElementById('content-management-toggle');
        const contentSubnav = document.getElementById('content-subnav');
        if (contentToggle && contentSubnav) {
            contentSubnav.classList.add('expanded');
            contentToggle.classList.add('expanded');
        }
    }

    // Update sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const activeSection = document.getElementById(`${sectionName}-section`);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    // Update header title
    const titles = {
        'dashboard': 'Analytics Dashboard',
        'users': 'User Management',
        'courses': 'Courses Management',
        'certifications': 'Certifications Management',
        'exercises': 'Practice Exercises Management',
        'learning-paths': 'Learning Paths',
        'gamification': 'Gamification',
        'help': 'Help & Support'
    };

    const titleEl = document.getElementById('section-title');
    if (titleEl) {
        titleEl.textContent = titles[sectionName] || 'Admin Panel';
    }

    currentSection = sectionName;

    // Load data for specific sections
    if (sectionName === 'users') {
        loadUsers();
    } else if (sectionName === 'courses') {
        loadCourses();
    } else if (sectionName === 'certifications') {
        loadCertifications();
    } else if (sectionName === 'exercises') {
        loadExercises();
    } else if (sectionName === 'learning-paths') {
        initializeLearningPaths();
    } else if (sectionName === 'gamification') {
        initializeGamification();
    }
}

// ============================================
// Load Dashboard Stats
// ============================================

async function loadDashboardStats() {
    try {
        // Get total users and calculate growth
        const { count: userCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const { count: lastMonthUsers } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .lt('created_at', oneMonthAgo.toISOString());

        const userGrowth = lastMonthUsers > 0
            ? (((userCount - lastMonthUsers) / lastMonthUsers) * 100).toFixed(1)
            : 0;

        const statUsersEl = document.getElementById('stat-users');
        if (statUsersEl) statUsersEl.textContent = userCount || 0;

        const statUsersChangeEl = document.getElementById('stat-users-change');
        if (statUsersChangeEl) {
            statUsersChangeEl.innerHTML = `<i class="fas fa-arrow-up"></i> ${userGrowth}% vs last month`;
            statUsersChangeEl.classList.add(userGrowth >= 0 ? 'positive' : 'negative');
        }

        // Get total courses and published count
        const { data: courses } = await supabase
            .from('courses')
            .select('id, is_published');

        const totalCourses = courses?.length || 0;
        const publishedCourses = courses?.filter(c => c.is_published).length || 0;

        const statCoursesEl = document.getElementById('stat-courses');
        if (statCoursesEl) statCoursesEl.textContent = totalCourses;

        const statCoursesPublishedEl = document.getElementById('stat-courses-published');
        if (statCoursesPublishedEl) statCoursesPublishedEl.textContent = publishedCourses;

        // Get enrollments and completion rate
        const { data: enrollments } = await supabase
            .from('enrollments')
            .select('id, progress_percentage, status');

        const activeEnrollments = enrollments?.filter(e => e.status === 'active').length || 0;
        const completedEnrollments = enrollments?.filter(e => e.status === 'completed').length || 0;
        const totalEnrollments = enrollments?.length || 0;
        const completionRate = totalEnrollments > 0
            ? ((completedEnrollments / totalEnrollments) * 100).toFixed(1)
            : 0;

        const statEnrollmentsEl = document.getElementById('stat-enrollments');
        if (statEnrollmentsEl) statEnrollmentsEl.textContent = activeEnrollments;

        const statEnrollmentsChangeEl = document.getElementById('stat-enrollments-change');
        if (statEnrollmentsChangeEl) {
            statEnrollmentsChangeEl.innerHTML = `<i class="fas fa-check-circle"></i> ${completionRate}% completion rate`;
        }

        // Get total XP and average
        const { data: profiles } = await supabase
            .from('profiles')
            .select('total_xp');

        const totalXP = profiles?.reduce((sum, p) => sum + (p.total_xp || 0), 0) || 0;
        const avgXP = profiles?.length > 0 ? Math.floor(totalXP / profiles.length) : 0;

        const statTotalXPEl = document.getElementById('stat-total-xp');
        if (statTotalXPEl) statTotalXPEl.textContent = formatNumber(totalXP);

        const statAvgXPEl = document.getElementById('stat-avg-xp');
        if (statAvgXPEl) statAvgXPEl.textContent = formatNumber(avgXP);

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// ============================================
// Load Recent Activity
// ============================================

async function loadRecentActivity() {
    try {
        console.log('Loading recent activity...');

        const { data: recentEnrollments, error } = await supabase
            .from('enrollments')
            .select(`
                id,
                enrolled_at,
                user_id,
                course_id,
                profiles (username, full_name),
                courses (title)
            `)
            .order('enrolled_at', { ascending: false })
            .limit(5);

        if (error) {
            console.error('Error loading recent activity:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
        }

        console.log('Recent activity data:', recentEnrollments);
        console.log('Number of enrollments found:', recentEnrollments?.length || 0);

        const activityContainer = document.getElementById('recent-activity');
        if (!activityContainer) {
            console.error('Element "recent-activity" not found');
            return;
        }

        if (recentEnrollments && recentEnrollments.length > 0) {
            activityContainer.innerHTML = recentEnrollments.map(enrollment => {
                const username = enrollment.profiles?.full_name || enrollment.profiles?.username || 'Unknown User';
                const courseTitle = enrollment.courses?.title || 'Unknown Course';
                const timeAgo = getTimeAgo(new Date(enrollment.enrolled_at));

                return `
                    <div class="activity-item">
                        <div class="activity-item__icon">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <div class="activity-item__content">
                            <p class="activity-item__text"><strong>${username}</strong> enrolled in <strong>${courseTitle}</strong></p>
                            <p class="activity-item__time">${timeAgo}</p>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            activityContainer.innerHTML = `
                <div class="empty-state-small">
                    <i class="fas fa-inbox" style="font-size: 48px; color: #d1d5db; margin-bottom: 12px;"></i>
                    <p style="text-align: center; color: #6b7280; margin: 0;">No recent enrollments yet</p>
                    <p style="text-align: center; color: #9ca3af; font-size: 14px; margin-top: 4px;">Activity will appear here when users enroll in courses</p>
                </div>
            `;
        }

        console.log('Recent activity loaded successfully');

    } catch (error) {
        console.error('Error loading recent activity:', error);
        const activityContainer = document.getElementById('recent-activity');
        if (activityContainer) {
            activityContainer.innerHTML = '<p style="text-align: center; color: #ef4444;">Error loading activity</p>';
        }
    }
}

// ============================================
// Load Engagement Chart
// ============================================

async function loadEngagementChart() {
    try {
        console.log('Loading engagement chart...');

        // Get last 7 days of enrollment data
        const days = [];
        const enrollmentCounts = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const { count, error } = await supabase
                .from('enrollments')
                .select('*', { count: 'exact', head: true })
                .gte('enrolled_at', date.toISOString())
                .lt('enrolled_at', nextDate.toISOString());

            if (error) {
                console.error('Error fetching enrollment count for date:', date, error);
            }

            days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            enrollmentCounts.push(count || 0);
        }

        console.log('Engagement data:', { days, enrollmentCounts });

        const ctx = document.getElementById('engagement-chart');
        if (!ctx) {
            console.error('Canvas element "engagement-chart" not found');
            return;
        }

        if (engagementChart) {
            engagementChart.destroy();
        }

        engagementChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Daily Enrollments',
                    data: enrollmentCounts,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: '600' },
                        bodyFont: { size: 13 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                            font: { size: 12 }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            font: { size: 12 }
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });

        console.log('Engagement chart loaded successfully');

    } catch (error) {
        console.error('Error loading engagement chart:', error);
    }
}

// ============================================
// Load Category Chart
// ============================================

async function loadCategoryChart() {
    try {
        console.log('Loading category chart...');

        const { data: enrollments, error } = await supabase
            .from('enrollments')
            .select(`
                id,
                courses (category)
            `);

        if (error) {
            console.error('Error loading category data:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            // Still render empty chart
        }

        console.log('Category enrollments data:', enrollments);
        console.log('Number of enrollments for categories:', enrollments?.length || 0);

        const categoryCounts = {};
        enrollments?.forEach(enrollment => {
            const category = enrollment.courses?.category || 'Other';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        let categories = Object.keys(categoryCounts);
        let counts = Object.values(categoryCounts);

        // If no data, show empty state
        if (categories.length === 0) {
            console.log('No enrollment data, showing empty chart');
            categories = ['No Data'];
            counts = [1];
        }

        console.log('Category counts:', categoryCounts);

        const colors = [
            '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#d1d5db'
        ];

        const ctx = document.getElementById('category-chart');
        if (!ctx) {
            console.error('Canvas element "category-chart" not found');
            return;
        }

        if (categoryChart) {
            categoryChart.destroy();
        }

        const isEmpty = categories.length === 1 && categories[0] === 'No Data';

        categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
                datasets: [{
                    data: counts,
                    backgroundColor: isEmpty ? ['#e5e7eb'] : colors.slice(0, categories.length),
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 12 },
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: !isEmpty,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: '600' },
                        bodyFont: { size: 13 },
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

        console.log('Category chart loaded successfully');

    } catch (error) {
        console.error('Error loading category chart:', error);
    }
}

// ============================================
// Load Top Performers
// ============================================

async function loadTopPerformers() {
    try {
        const { data: topUsers, error } = await supabase
            .from('profiles')
            .select('username, full_name, avatar_url, total_xp')
            .order('total_xp', { ascending: false })
            .limit(5);

        if (error) {
            console.error('Error loading top performers:', error);
            return;
        }

        const performersContainer = document.getElementById('top-performers');
        if (!performersContainer) return;

        if (topUsers && topUsers.length > 0) {
            performersContainer.innerHTML = topUsers.map((user, index) => {
                const rankClass = index === 0 ? 'top-1' : index === 1 ? 'top-2' : index === 2 ? 'top-3' : '';
                const displayName = user.full_name || user.username || 'Unknown User';
                const avatar = user.avatar_url || 'images/profile/default-avatar.svg';
                const xp = formatNumber(user.total_xp || 0);

                return `
                    <div class="leaderboard-item">
                        <div class="leaderboard-item__rank ${rankClass}">${index + 1}</div>
                        <img src="${avatar}" alt="${displayName}" class="leaderboard-item__avatar">
                        <div class="leaderboard-item__content">
                            <div class="leaderboard-item__name">${displayName}</div>
                            <div class="leaderboard-item__stats">@${user.username || 'user'}</div>
                        </div>
                        <div class="leaderboard-item__xp">${xp} XP</div>
                    </div>
                `;
            }).join('');
        } else {
            performersContainer.innerHTML = '<p style="text-align: center; color: #666;">No users yet</p>';
        }

    } catch (error) {
        console.error('Error loading top performers:', error);
    }
}

// ============================================
// Course Performance State
// ============================================

let allCoursePerformance = [];
let coursePerformanceFilters = {
    sort: 'enrollments-desc',
    status: 'all'
};

// ============================================
// Load Course Performance
// ============================================

async function loadCoursePerformance() {
    try {
        console.log('Loading course performance...');

        const { data: courses, error } = await supabase
            .from('courses')
            .select(`
                id,
                title,
                is_published,
                enrollments (
                    id,
                    progress_percentage,
                    status
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading course performance:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
        }

        console.log('Course performance data:', courses);
        console.log('Number of courses found:', courses?.length || 0);

        // Process and store course performance data
        if (courses && courses.length > 0) {
            allCoursePerformance = courses.map(course => {
                const enrollments = course.enrollments || [];
                const enrollmentCount = enrollments.length;
                const avgProgress = enrollmentCount > 0
                    ? (enrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / enrollmentCount)
                    : 0;
                const completedCount = enrollments.filter(e => e.status === 'completed').length;
                const completionRate = enrollmentCount > 0
                    ? ((completedCount / enrollmentCount) * 100)
                    : 0;

                return {
                    ...course,
                    enrollmentCount,
                    avgProgress,
                    completionRate
                };
            });
        } else {
            allCoursePerformance = [];
        }

        renderCoursePerformance();
        console.log('Course performance loaded successfully');

    } catch (error) {
        console.error('Error loading course performance:', error);
        const tableBody = document.getElementById('course-performance-body');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #ef4444; padding: 20px;">Error loading course data</td></tr>';
        }
    }
}

// ============================================
// Render Course Performance Table
// ============================================

function renderCoursePerformance() {
    const tableBody = document.getElementById('course-performance-body');
    if (!tableBody) {
        console.error('Element "course-performance-body" not found');
        return;
    }

    // Apply filters
    let filteredCourses = [...allCoursePerformance];

    // Filter by status
    if (coursePerformanceFilters.status === 'published') {
        filteredCourses = filteredCourses.filter(c => c.is_published);
    } else if (coursePerformanceFilters.status === 'draft') {
        filteredCourses = filteredCourses.filter(c => !c.is_published);
    }

    // Apply sorting
    const [sortBy, sortOrder] = coursePerformanceFilters.sort.split('-');

    filteredCourses.sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'enrollments':
                comparison = a.enrollmentCount - b.enrollmentCount;
                break;
            case 'completion':
                comparison = a.completionRate - b.completionRate;
                break;
            case 'progress':
                comparison = a.avgProgress - b.avgProgress;
                break;
            case 'name':
                comparison = a.title.localeCompare(b.title);
                break;
        }

        return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Render table
    if (filteredCourses.length > 0) {
        tableBody.innerHTML = filteredCourses.map(course => {
            return `
                <tr>
                    <td>${course.title}</td>
                    <td>${course.enrollmentCount}</td>
                    <td>${course.avgProgress.toFixed(1)}%</td>
                    <td>
                        <span style="color: ${course.completionRate >= 50 ? '#10b981' : course.completionRate >= 25 ? '#f59e0b' : '#ef4444'}; font-weight: 600;">
                            ${course.completionRate.toFixed(1)}%
                        </span>
                    </td>
                    <td>
                        <span style="color: ${course.is_published ? '#10b981' : '#6b7280'}; font-weight: 600;">
                            ${course.is_published ? 'Published' : 'Draft'}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    } else {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px;">
                    <i class="fas fa-book-open" style="font-size: 48px; color: #d1d5db; display: block; margin-bottom: 12px;"></i>
                    <p style="color: #6b7280; margin: 0;">No courses match the selected filters</p>
                    <p style="color: #9ca3af; font-size: 14px; margin-top: 4px;">Try adjusting your filters</p>
                </td>
            </tr>
        `;
    }
}

// ============================================
// Load Users
// ============================================

async function loadUsers() {
    try {
        const { data: users, error } = await supabase
            .from('profiles')
            .select('id, username, full_name, email, role, total_xp, created_at, updated_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading users:', error);
            return;
        }

        allUsers = users || [];
        applyUserFilters();

    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// ============================================
// User Filters and Search
// ============================================

function applyUserFilters() {
    filteredUsers = allUsers.filter(user => {
        // Search filter
        const searchLower = currentFilters.search.toLowerCase();
        const matchesSearch = !searchLower ||
            (user.username && user.username.toLowerCase().includes(searchLower)) ||
            (user.full_name && user.full_name.toLowerCase().includes(searchLower)) ||
            (user.email && user.email.toLowerCase().includes(searchLower));

        // Role filter
        const matchesRole = currentFilters.role === 'all' || user.role === currentFilters.role;

        // Status filter (based on activity - if updated_at is within last 30 days)
        let matchesStatus = true;
        if (currentFilters.status !== 'all') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const lastActive = user.updated_at ? new Date(user.updated_at) : new Date(user.created_at);
            const isActive = lastActive > thirtyDaysAgo;
            matchesStatus = currentFilters.status === 'active' ? isActive : !isActive;
        }

        return matchesSearch && matchesRole && matchesStatus;
    });

    currentPage = 1; // Reset to first page
    renderUsersTable();
}

function renderUsersTable() {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;

    // Calculate pagination
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    if (paginatedUsers.length > 0) {
        tableBody.innerHTML = paginatedUsers.map(user => {
            // Calculate if user is active (updated in last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const lastActive = user.updated_at ? new Date(user.updated_at) : new Date(user.created_at);
            const isActive = lastActive > thirtyDaysAgo;

            return `
                <tr>
                    <td>${user.username || 'N/A'}</td>
                    <td>${user.email || 'N/A'}</td>
                    <td><span style="text-transform: capitalize; font-weight: 600; color: ${user.role === 'admin' ? '#f59e0b' : '#6b7280'};">${user.role || 'user'}</span></td>
                    <td>
                        <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 12px; font-size: 0.8125rem; font-weight: 600; background: ${isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)'}; color: ${isActive ? '#10b981' : '#6b7280'};">
                            <span style="width: 6px; height: 6px; border-radius: 50%; background: ${isActive ? '#10b981' : '#6b7280'};"></span>
                            ${isActive ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                    <td>${formatNumber(user.total_xp || 0)}</td>
                    <td>${formatDate(user.created_at)}</td>
                    <td>
                        <button class="btn-edit" onclick="openEditUserModal('${user.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete" onclick="confirmDeleteUser('${user.id}', '${user.username || user.email}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } else {
        tableBody.innerHTML = '<tr><td colspan="7" class="loading-cell">No users found</td></tr>';
    }

    updatePaginationControls();
}

function updatePaginationControls() {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = Math.min(startIndex + usersPerPage, filteredUsers.length);

    // Update info
    const showingEl = document.getElementById('users-showing');
    if (showingEl) showingEl.textContent = filteredUsers.length > 0 ? `${startIndex + 1}-${endIndex}` : '0';

    const totalEl = document.getElementById('users-total');
    if (totalEl) totalEl.textContent = filteredUsers.length;

    const currentPageEl = document.getElementById('users-current-page');
    if (currentPageEl) currentPageEl.textContent = filteredUsers.length > 0 ? currentPage : '0';

    // Update buttons
    const prevBtn = document.getElementById('users-prev-btn');
    if (prevBtn) prevBtn.disabled = currentPage <= 1;

    const nextBtn = document.getElementById('users-next-btn');
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages || filteredUsers.length === 0;
}

// ============================================
// Load Courses
// ============================================

async function loadCourses() {
    try {
        console.log('Loading courses...');

        // First get all courses
        const { data: courses, error } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading courses:', error);
            const tableBody = document.getElementById('courses-table-body');
            if (tableBody) {
                tableBody.innerHTML = `<tr><td colspan="7" class="loading-cell">Error loading courses: ${error.message}</td></tr>`;
            }
            return;
        }

        console.log('Courses loaded:', courses);

        if (!courses || courses.length === 0) {
            console.log('No courses found');
            const tableBody = document.getElementById('courses-table-body');
            if (tableBody) {
                tableBody.innerHTML = '<tr><td colspan="7" class="loading-cell">No courses found. Click "Add New Course" to create one.</td></tr>';
            }
            return;
        }

        // Get lesson counts for each course
        const coursesWithCounts = await Promise.all(
            courses.map(async (course) => {
                const { count, error: countError } = await supabase
                    .from('lessons')
                    .select('*', { count: 'exact', head: true })
                    .eq('course_id', course.id);

                if (countError) {
                    console.error('Error counting lessons for course:', course.id, countError);
                }

                return {
                    ...course,
                    lessonCount: count || 0
                };
            })
        );

        console.log('Courses with counts:', coursesWithCounts);
        allCourses = coursesWithCounts;
        applyCoursesFilters();

        // Debug: Check if buttons are rendered
        setTimeout(() => {
            const addBtn = document.getElementById('add-course-btn');
            const actionBtns = document.querySelectorAll('.btn-icon.btn-edit');
            console.log('Add course button:', addBtn);
            console.log('Action buttons count:', actionBtns.length);
        }, 100);

    } catch (error) {
        console.error('Error in loadCourses:', error);
        const tableBody = document.getElementById('courses-table-body');
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="7" class="loading-cell">Error: ${error.message}</td></tr>`;
        }
    }
}

function renderCoursesTable(courses) {
    const tableBody = document.getElementById('courses-table-body');
    if (!tableBody) return;

    if (courses && courses.length > 0) {
        tableBody.innerHTML = courses.map(course => {
            const lessonCount = course.lessonCount || 0;

            // Format last updated date
            const lastUpdated = course.updated_at ? new Date(course.updated_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) : 'N/A';

            // Get course image or use placeholder
            const courseImage = course.thumbnail_url || 'images/placeholder-course.jpg';

            // Difficulty badge styling
            const difficultyClass = course.difficulty ? `difficulty-${course.difficulty.toLowerCase()}` : '';

            // Check if course has prerequisites
            const hasPrerequisites = course.prerequisites && course.prerequisites.length > 0;
            const prerequisiteText = hasPrerequisites
                ? `Requires: ${course.prerequisites.length} course${course.prerequisites.length > 1 ? 's' : ''}`
                : '';

            return `
                <tr class="course-row">
                    <td>
                        <div class="course-cell-content">
                            <img src="${courseImage}" alt="${escapeHtml(course.title)}" class="course-thumbnail" onerror="this.src='images/placeholder-course.jpg'">
                            <div class="course-info">
                                <h4 class="course-title">
                                    ${escapeHtml(course.title)}
                                    ${hasPrerequisites ? '<span class="prerequisite-indicator" title="' + prerequisiteText + '"><i class="fas fa-lock"></i></span>' : ''}
                                </h4>
                                <p class="course-description">${escapeHtml(course.short_description || '').substring(0, 80)}${(course.short_description?.length > 80) ? '...' : ''}</p>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="category-badge">${course.category || 'Uncategorized'}</span>
                    </td>
                    <td>
                        <span class="difficulty-badge ${difficultyClass}">${course.difficulty || 'N/A'}</span>
                    </td>
                    <td class="lessons-cell">
                        <i class="fas fa-book"></i> ${lessonCount}
                    </td>
                    <td class="updated-cell">${lastUpdated}</td>
                    <td>
                        <span class="status-badge ${course.is_published ? 'status-published' : 'status-draft'}">
                            <i class="fas fa-circle"></i> ${course.is_published ? 'Published' : 'Draft'}
                        </span>
                    </td>
                    <td class="actions-cell">
                        <button class="btn-icon btn-edit" onclick="editCourse('${course.id}')" title="Edit course">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="deleteCourse('${course.id}')" title="Delete course">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } else {
        tableBody.innerHTML = '<tr><td colspan="7" class="loading-cell">No courses found</td></tr>';
    }
}

function applyCoursesFilters() {
    let filtered = [...allCourses];

    // Category filter
    if (courseFilters.category) {
        filtered = filtered.filter(course => course.category === courseFilters.category);
    }

    // Difficulty filter
    if (courseFilters.difficulty) {
        filtered = filtered.filter(course => course.difficulty === courseFilters.difficulty);
    }

    renderCoursesTable(filtered);
}

// ============================================
// Load Certifications
// ============================================

async function loadCertifications() {
    try {
        const { data: certifications, error } = await supabase
            .from('certifications')
            .select('id, title, provider, category, level, is_active')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading certifications:', error);
            return;
        }

        allCertifications = certifications || [];
        applyCertFilters();

    } catch (error) {
        console.error('Error loading certifications:', error);
    }
}

function applyCertFilters(resetPage = true) {
    let filtered = [...allCertifications];

    // Search filter (title or provider)
    if (certFilters.search) {
        const searchLower = certFilters.search.toLowerCase();
        filtered = filtered.filter(cert =>
            (cert.title || '').toLowerCase().includes(searchLower) ||
            (cert.provider || '').toLowerCase().includes(searchLower)
        );
    }

    // Category filter
    if (certFilters.category) {
        filtered = filtered.filter(cert => cert.category === certFilters.category);
    }

    // Status filter
    if (certFilters.status) {
        const isActive = certFilters.status === 'active';
        filtered = filtered.filter(cert => cert.is_active === isActive);
    }

    filteredCertifications = filtered;

    // Reset to page 1 when filters change
    if (resetPage) {
        certCurrentPage = 1;
    }

    // Paginate results
    const totalPages = Math.ceil(filtered.length / certPerPage);
    const startIndex = (certCurrentPage - 1) * certPerPage;
    const endIndex = startIndex + certPerPage;
    const paginatedCerts = filtered.slice(startIndex, endIndex);

    renderCertificationsTable(paginatedCerts);
    updateCertCount(filtered.length, allCertifications.length);
    renderCertPagination(filtered.length, totalPages);
}

function updateCertCount(filteredCount, totalCount) {
    const countEl = document.getElementById('cert-count');
    if (!countEl) return;

    if (filteredCount === totalCount) {
        countEl.textContent = `${totalCount} certification${totalCount !== 1 ? 's' : ''}`;
    } else {
        countEl.textContent = `${filteredCount} of ${totalCount} certification${totalCount !== 1 ? 's' : ''}`;
    }
}

function renderCertPagination(totalItems, totalPages) {
    const pageInfoEl = document.getElementById('cert-page-info');
    const pageNumbersEl = document.getElementById('cert-page-numbers');
    const prevBtn = document.getElementById('cert-prev-btn');
    const nextBtn = document.getElementById('cert-next-btn');

    if (!pageInfoEl || !pageNumbersEl || !prevBtn || !nextBtn) return;

    // Update page info
    const startItem = totalItems === 0 ? 0 : (certCurrentPage - 1) * certPerPage + 1;
    const endItem = Math.min(certCurrentPage * certPerPage, totalItems);
    pageInfoEl.textContent = `Showing ${startItem}-${endItem} of ${totalItems}`;

    // Update prev/next buttons
    prevBtn.disabled = certCurrentPage <= 1;
    nextBtn.disabled = certCurrentPage >= totalPages;

    // Generate page numbers
    pageNumbersEl.innerHTML = '';

    if (totalPages <= 1) return;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, certCurrentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page + ellipsis
    if (startPage > 1) {
        pageNumbersEl.innerHTML += `<button class="page-number" onclick="goToCertPage(1)">1</button>`;
        if (startPage > 2) {
            pageNumbersEl.innerHTML += `<span class="page-ellipsis">...</span>`;
        }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === certCurrentPage ? 'active' : '';
        pageNumbersEl.innerHTML += `<button class="page-number ${activeClass}" onclick="goToCertPage(${i})">${i}</button>`;
    }

    // Ellipsis + last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbersEl.innerHTML += `<span class="page-ellipsis">...</span>`;
        }
        pageNumbersEl.innerHTML += `<button class="page-number" onclick="goToCertPage(${totalPages})">${totalPages}</button>`;
    }
}

function goToCertPage(page) {
    certCurrentPage = page;
    applyCertFilters(false);
}

function certPrevPage() {
    if (certCurrentPage > 1) {
        certCurrentPage--;
        applyCertFilters(false);
    }
}

function certNextPage() {
    const totalPages = Math.ceil(filteredCertifications.length / certPerPage);
    if (certCurrentPage < totalPages) {
        certCurrentPage++;
        applyCertFilters(false);
    }
}

function renderCertificationsTable(certifications) {
    const tableBody = document.getElementById('certifications-table-body');
    if (!tableBody) return;

    if (certifications && certifications.length > 0) {
        tableBody.innerHTML = certifications.map(cert => {
            const badgeCategory = (cert.category || 'General').toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const statusClass = cert.is_active ? 'status-active' : 'status-inactive';
            const statusLabel = cert.is_active ? 'Active' : 'Inactive';

            return `
                <tr>
                    <td>
                        <div class="table-title">${cert.title}</div>
                        <div class="table-subtitle">${cert.provider || 'Unknown provider'}</div>
                    </td>
                    <td>
                        <span class="category-badge category-${badgeCategory}">${cert.category || 'General'}</span>
                    </td>
                    <td><span style="text-transform: capitalize;">${cert.level || 'N/A'}</span></td>
                    <td>
                        <span class="status-badge ${statusClass}">${statusLabel}</span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-icon" onclick="editCertification('${cert.id}')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon btn-danger" onclick="deleteCertification('${cert.id}')" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    } else {
        const hasFilters = certFilters.search || certFilters.category || certFilters.status;
        const message = hasFilters
            ? 'No certifications match your filters.'
            : 'No certifications found. Add your first certification to get started.';

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="loading-cell">
                    <div class="empty-state">
                        <i class="fas fa-certificate"></i>
                        <p>${message}</p>
                    </div>
                </td>
            </tr>
        `;
    }
}

// ============================================
// Certification Bulk Actions
// ============================================

function handleCertHeaderCheckboxChange(checked) {
    const checkboxes = document.querySelectorAll('.cert-select-checkbox');
    selectedCertIds = new Set();

    checkboxes.forEach(cb => {
        cb.checked = checked;
        if (checked) {
            const id = cb.getAttribute('data-cert-id');
            if (id) selectedCertIds.add(id);
        }
    });

    updateCertBulkActionsState();
}

function handleCertRowCheckboxChange(certId, checked) {
    if (!certId) return;

    if (checked) {
        selectedCertIds.add(certId);
    } else {
        selectedCertIds.delete(certId);
    }

    const headerCheckbox = document.getElementById('cert-select-all');
    if (headerCheckbox) {
        const checkboxes = document.querySelectorAll('.cert-select-checkbox');
        const allChecked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
        headerCheckbox.checked = allChecked;
    }

    updateCertBulkActionsState();
}

function updateCertBulkActionsState() {
    const bulkActivateBtn = document.getElementById('cert-bulk-activate');
    const bulkDeactivateBtn = document.getElementById('cert-bulk-deactivate');
    const bulkDeleteBtn = document.getElementById('cert-bulk-delete');
    const bulkBar = document.getElementById('cert-bulk-bar');
    const selectionCountEl = document.getElementById('cert-selection-count');

    const hasSelection = selectedCertIds && selectedCertIds.size > 0;
    const count = selectedCertIds ? selectedCertIds.size : 0;

    [bulkActivateBtn, bulkDeactivateBtn, bulkDeleteBtn].forEach(btn => {
        if (!btn) return;
        btn.disabled = !hasSelection;
    });

    // Update selection count display
    if (selectionCountEl) {
        if (hasSelection) {
            selectionCountEl.textContent = `${count} selected`;
            selectionCountEl.classList.add('visible');
        } else {
            selectionCountEl.textContent = '';
            selectionCountEl.classList.remove('visible');
        }
    }

    // Highlight bulk bar when items are selected
    if (bulkBar) {
        if (hasSelection) {
            bulkBar.classList.add('has-selection');
        } else {
            bulkBar.classList.remove('has-selection');
        }
    }
}

async function bulkUpdateCertStatus(isActive) {
    if (!selectedCertIds || selectedCertIds.size === 0) {
        showToast('Please select at least one certification.', 'error');
        return;
    }

    const actionLabel = isActive ? 'activate' : 'deactivate';
    const confirmed = confirm(`Are you sure you want to ${actionLabel} ${selectedCertIds.size} certification(s)?`);
    if (!confirmed) return;

    const ids = Array.from(selectedCertIds);

    try {
        const { error } = await supabase
            .from('certifications')
            .update({
                is_active: isActive,
                updated_at: new Date().toISOString()
            })
            .in('id', ids);

        if (error) {
            console.error('Error updating certifications:', error);
            showToast('Failed to update certifications: ' + error.message, 'error');
            return;
        }

        showToast(isActive ? 'Selected certifications activated.' : 'Selected certifications deactivated.', 'success');
        await loadCertifications();

    } catch (err) {
        console.error('Unexpected error updating certifications:', err);
        showToast('Failed to update certifications', 'error');
    }
}

async function bulkDeleteCertifications() {
    if (!selectedCertIds || selectedCertIds.size === 0) {
        showToast('Please select at least one certification to delete.', 'error');
        return;
    }

    const confirmed = confirm(`Are you sure you want to delete ${selectedCertIds.size} certification(s)?\n\nThis action cannot be undone.`);
    if (!confirmed) return;

    const ids = Array.from(selectedCertIds);

    try {
        const { error } = await supabase
            .from('certifications')
            .delete()
            .in('id', ids);

        if (error) {
            console.error('Error deleting certifications:', error);
            showToast('Failed to delete certifications: ' + error.message, 'error');
            return;
        }

        showToast('Selected certifications deleted successfully.', 'success');
        await loadCertifications();

    } catch (err) {
        console.error('Unexpected error deleting certifications:', err);
        showToast('Failed to delete certifications', 'error');
    }
}

// ============================================
// Load Practice Exercises
// ============================================

async function loadExercises() {
    try {
        const { data: exercises, error } = await supabase
            .from('practice_exercises')
            .select('id, title, slug, category, difficulty, questions, is_published')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading exercises:', error);
            return;
        }

        allExercises = exercises || [];
        applyExercisesFilters();

    } catch (error) {
        console.error('Error loading exercises:', error);
    }
}

function renderExercisesTable(exercises) {
    const tableBody = document.getElementById('exercises-table-body');
    if (!tableBody) return;

    if (exercises && exercises.length > 0) {
        tableBody.innerHTML = exercises.map(exercise => {
            const questionCount = Array.isArray(exercise.questions) ? exercise.questions.length : 0;
            const badgeCategory = (exercise.category || 'General').toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const publishedBadge = exercise.is_published
                ? '<span class="status-badge status-active">Published</span>'
                : '<span class="status-badge status-inactive">Draft</span>';

            return `
                <tr>
                    <td>
                        <div class="table-title">${exercise.title}</div>
                        <div class="table-subtitle">${exercise.slug || ''}</div>
                    </td>
                    <td>
                        <span class="category-badge category-${badgeCategory}">${exercise.category || 'General'}</span>
                    </td>
                    <td><span style="text-transform: capitalize;">${exercise.difficulty || 'N/A'}</span></td>
                    <td><strong>${questionCount}</strong> questions</td>
                    <td>${publishedBadge}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-icon" onclick="editExercise('${exercise.id}')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon btn-danger" onclick="deleteExercise('${exercise.id}', '${exercise.title.replace(/'/g, "&apos;")}')" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    } else {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="loading-cell">
                    <div class="empty-state">
                        <i class="fas fa-dumbbell"></i>
                        <p>No practice exercises yet. Create your first one!</p>
                    </div>
                </td>
            </tr>
        `;
    }
}

function applyExercisesFilters() {
    let filtered = [...allExercises];

    // Category filter
    if (exerciseFilters.category) {
        filtered = filtered.filter(exercise => exercise.category === exerciseFilters.category);
    }

    // Difficulty filter
    if (exerciseFilters.difficulty) {
        filtered = filtered.filter(exercise =>
            exercise.difficulty && exercise.difficulty.toLowerCase() === exerciseFilters.difficulty.toLowerCase()
        );
    }

    renderExercisesTable(filtered);
}

// ============================================
// Search Users
// ============================================

async function searchUsers(searchTerm) {
    try {
        let query = supabase
            .from('profiles')
            .select('id, username, email, role, total_xp, created_at');

        if (searchTerm) {
            query = query.or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
        }

        const { data: users, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Error searching users:', error);
            return;
        }

        renderUsersTable(users);

    } catch (error) {
        console.error('Error searching users:', error);
    }
}

// ============================================
// User Edit Modal
// ============================================

async function openEditUserModal(userId) {
    try {
        const { data: user, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error loading user:', error);
            alert('Failed to load user data');
            return;
        }

        // Populate form
        document.getElementById('edit-user-id').value = user.id;
        document.getElementById('edit-username').value = user.username || '';
        document.getElementById('edit-full-name').value = user.full_name || '';
        document.getElementById('edit-email').value = user.email || '';
        document.getElementById('edit-role').value = user.role || 'user';
        document.getElementById('edit-total-xp').value = user.total_xp || 0;

        // Show modal
        const modal = document.getElementById('edit-user-modal');
        if (modal) {
            lockBodyScroll();
            modal.classList.add('active');
        }

    } catch (error) {
        console.error('Error opening edit modal:', error);
        alert('Failed to open edit modal');
    }
}

function closeEditUserModal() {
    const modal = document.getElementById('edit-user-modal');
    if (modal) modal.classList.remove('active');
    unlockBodyScroll();

    // Reset form
    const form = document.getElementById('edit-user-form');
    if (form) form.reset();
}

async function handleEditUserSubmit(e) {
    e.preventDefault();

    const userId = document.getElementById('edit-user-id').value;
    const username = document.getElementById('edit-username').value;
    const fullName = document.getElementById('edit-full-name').value;
    const role = document.getElementById('edit-role').value;
    const totalXP = parseInt(document.getElementById('edit-total-xp').value) || 0;

    // DEBUG: Log all values being submitted
    console.log('=== Edit User Debug ===');
    console.log('User ID:', userId);
    console.log('Username:', username);
    console.log('Full Name:', fullName);
    console.log('Role:', role);
    console.log('Total XP:', totalXP);
    console.log('=====================');

    try {
        const updateData = {
            username: username,
            full_name: fullName,
            role: role,
            total_xp: totalXP,
            updated_at: new Date().toISOString()
        };

        console.log('Update data object:', updateData);

        // First, check current value in database
        const { data: beforeData } = await supabase
            .from('profiles')
            .select('total_xp, username, role')
            .eq('id', userId)
            .single();

        console.log('Before update - DB values:', beforeData);

        // Perform the update without select
        const { error: updateError, count } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId);

        console.log('Update error:', updateError);
        console.log('Rows affected:', count);

        if (updateError) {
            console.error('Error updating user:', updateError);
            alert('Failed to update user: ' + updateError.message);
            return;
        }

        // Wait a moment for database to process
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify the update by fetching the user separately
        const { data: verifyData, error: verifyError } = await supabase
            .from('profiles')
            .select('id, username, full_name, role, total_xp, updated_at')
            .eq('id', userId)
            .single();

        console.log('Verification data:', verifyData);
        console.log('Verification error:', verifyError);

        // Check if the value actually changed
        if (verifyData && verifyData.total_xp !== totalXP) {
            console.error('WARNING: Value mismatch after update!');
            console.error(`Expected total_xp: ${totalXP}, Got: ${verifyData.total_xp}`);
            alert(`Warning: Update may have failed. Expected XP: ${totalXP}, but database shows: ${verifyData.total_xp}.\n\nThis could be due to:\n1. Database triggers resetting the value\n2. RLS policies blocking the update\n3. Database constraints\n\nPlease check your Supabase RLS policies and triggers.`);
            return;
        }

        if (verifyError) {
            console.warn('Could not verify update, but update command succeeded:', verifyError);
            alert('User updated successfully! (Could not verify changes)');
        } else {
            console.log('User updated and verified successfully:', verifyData);
            alert('User updated successfully!');
        }

        closeEditUserModal();

        // Reload users to reflect changes
        await loadUsers();

    } catch (error) {
        console.error('Unexpected error updating user:', error);
        alert('An unexpected error occurred: ' + error.message);
    }
}

// ============================================
// User Delete
// ============================================

async function confirmDeleteUser(userId, username) {
    const confirmed = confirm(`Are you sure you want to delete user "${username}"?\n\nThis action cannot be undone and will remove all associated data including:\n- Course enrollments\n- Practice attempts\n- Certifications\n- Badges\n\nType the username to confirm deletion.`);

    if (!confirmed) return;

    const typedUsername = prompt(`Type "${username}" to confirm deletion:`);

    if (typedUsername !== username) {
        alert('Username does not match. Deletion cancelled.');
        return;
    }

    try {
        // Delete user (this will cascade to related tables if foreign keys are set up properly)
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);

        if (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user: ' + error.message);
            return;
        }

        alert('User deleted successfully');

        // Reload users
        await loadUsers();

    } catch (error) {
        console.error('Error deleting user:', error);
        alert('An unexpected error occurred');
    }
}

// Make functions global
window.openEditUserModal = openEditUserModal;
window.closeEditUserModal = closeEditUserModal;
window.confirmDeleteUser = confirmDeleteUser;

async function editCourse(courseId) {
    try {
        // Load course data
        const { data: course, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();

        if (error) throw error;

        // Hide course list, show course edit view
        document.getElementById('course-list-view').style.display = 'none';
        document.getElementById('course-edit-view').style.display = 'block';

        // Store current course ID
        window.currentEditingCourseId = courseId;

        // Populate form
        document.getElementById('course-title-edit').value = course.title || '';
        document.getElementById('course-short-desc-edit').value = course.short_description || '';
        document.getElementById('course-description-edit').value = course.description || '';
        document.getElementById('course-category-edit').value = course.category || '';
        document.getElementById('course-difficulty-edit').value = course.difficulty || '';
        document.getElementById('course-slug-edit').value = course.slug || '';
        document.getElementById('course-thumbnail-edit').value = course.thumbnail_url || '';

        // Show image preview if URL exists
        if (course.thumbnail_url) {
            showImagePreview('thumbnail', course.thumbnail_url);
        }

        // Learning objectives
        if (Array.isArray(course.learning_objectives)) {
            document.getElementById('course-objectives-edit').value = course.learning_objectives.join('\n');
        }

        document.getElementById('course-published-edit').checked = course.is_published || false;
        document.getElementById('course-featured-edit').checked = course.is_featured || false;

        // Load lessons
        await loadCourseLessonsInline(courseId);

        // Scroll to top
        document.querySelector('.admin-content').scrollTop = 0;

    } catch (error) {
        console.error('Error loading course for editing:', error);
        showToast('Failed to load course: ' + error.message, 'error');
    }
}

// Add new course
async function addNewCourse() {
    try {
        // Create a new course with default values
        const newCourse = {
            title: 'New Course',
            slug: `new-course-${Date.now()}`,
            short_description: '',
            description: '',
            category: 'AI',
            difficulty: 'Beginner',
            is_published: false,
            is_featured: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data: createdCourse, error } = await supabase
            .from('courses')
            .insert([newCourse])
            .select()
            .single();

        if (error) throw error;

        showToast('New course created! Fill in the details.', 'success');

        // Open the course for editing
        await editCourse(createdCourse.id);

    } catch (error) {
        console.error('Error creating course:', error);
        showToast('Failed to create course: ' + error.message, 'error');
    }
}

// Back to courses list
function backToCoursesView() {
    document.getElementById('course-edit-view').style.display = 'none';
    document.getElementById('course-list-view').style.display = 'block';
    window.currentEditingCourseId = null;
    // Reload courses to show updated list
    loadCourses();
}

// Image preview functions
function previewCourseImage(type) {
    const inputId = type === 'thumbnail' ? 'course-thumbnail-edit' : 'course-cover-edit';
    const imageUrl = document.getElementById(inputId).value.trim();

    if (imageUrl) {
        showImagePreview(type, imageUrl);
    } else {
        hideImagePreview(type);
    }
}

function showImagePreview(type, imageUrl) {
    const previewContainer = document.getElementById(`${type}-preview-container`);
    const previewImg = document.getElementById(`${type}-preview`);

    if (previewContainer && previewImg) {
        previewImg.src = imageUrl;
        previewImg.onerror = function() {
            hideImagePreview(type);
            showToast('Failed to load image. Please check the URL.', 'error');
        };
        previewImg.onload = function() {
            previewContainer.style.display = 'block';
        };
    }
}

function hideImagePreview(type) {
    const previewContainer = document.getElementById(`${type}-preview-container`);
    if (previewContainer) {
        previewContainer.style.display = 'none';
    }
}

function removeCourseImagePreview(type) {
    const inputId = type === 'thumbnail' ? 'course-thumbnail-edit' : 'course-cover-edit';
    const fileInputId = type === 'thumbnail' ? 'course-thumbnail-file' : 'course-cover-file';
    document.getElementById(inputId).value = '';
    document.getElementById(fileInputId).value = '';
    hideImagePreview(type);
    // Clear pending upload
    if (window.pendingImageUploads) {
        delete window.pendingImageUploads[type];
    }
}

// Store pending file uploads
window.pendingImageUploads = {};

// Handle file upload and preview
async function handleImageUpload(type, file) {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
    }

    // Store the file for later upload
    window.pendingImageUploads[type] = file;

    // Show preview using FileReader
    const reader = new FileReader();
    reader.onload = function(e) {
        showImagePreview(type, e.target.result);
    };
    reader.onerror = function() {
        showToast('Failed to read image file', 'error');
    };
    reader.readAsDataURL(file);
}

// Upload image to Supabase Storage
async function uploadImageToSupabase(file, type, courseId) {
    try {
        // Create a unique filename
        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop();
        const fileName = `${courseId}_${type}_${timestamp}.${fileExt}`;
        const filePath = `course-images/${fileName}`;

        console.log('Uploading image to Supabase Storage:', filePath);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('course-assets')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            throw error;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('course-assets')
            .getPublicUrl(filePath);

        console.log('Image uploaded successfully:', urlData.publicUrl);
        return urlData.publicUrl;

    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

// Make functions globally accessible
window.previewCourseImage = previewCourseImage;
window.removeCourseImagePreview = removeCourseImagePreview;
window.handleImageUpload = handleImageUpload;

// Load lessons for inline editing
async function loadCourseLessonsInline(courseId) {
    try {
        const { data: lessons, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', courseId)
            .order('order_index', { ascending: true });

        if (error) throw error;

        renderLessonsAccordion(lessons || []);

    } catch (error) {
        console.error('Error loading lessons:', error);
        showToast('Failed to load lessons: ' + error.message, 'error');
    }
}

// Render lessons as accordion
function renderLessonsAccordion(lessons) {
    const container = document.getElementById('lessons-accordion-container');

    if (!lessons || lessons.length === 0) {
        container.innerHTML = `
            <div class="empty-state-inline">
                <i class="fas fa-book-open"></i>
                <p>No lessons yet. Click "Add Lesson" to create your first lesson.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = lessons.map((lesson, index) => `
        <div class="lesson-accordion-item" data-lesson-id="${lesson.id}" data-order-index="${lesson.order_index}">
            <div class="lesson-accordion-header">
                <div class="lesson-drag-handle" title="Drag to reorder">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <div class="lesson-accordion-left" onclick="toggleLessonAccordion('${lesson.id}')">
                    <span class="lesson-title-text">${escapeHtml(lesson.title)}</span>
                    <span class="lesson-type-tag lesson-type-${lesson.content_type}">
                        ${getLessonTypeIcon(lesson.content_type)} ${lesson.content_type}
                    </span>
                </div>
                <div class="lesson-accordion-right" onclick="toggleLessonAccordion('${lesson.id}')">
                    <span class="lesson-xp-badge"><i class="fas fa-award"></i> ${lesson.xp_reward || 10} XP</span>
                    <i class="fas fa-chevron-down accordion-arrow"></i>
                </div>
            </div>
            <div class="lesson-accordion-body" id="lesson-body-${lesson.id}" style="display: none;">
                ${renderLessonEditForm(lesson, index)}
            </div>
        </div>
    `).join('');

    // Initialize drag-and-drop after rendering
    initializeLessonDragDrop();
}

// Render lesson edit form
function renderLessonEditForm(lesson, index) {
    const contentType = lesson.content_type;

    // Build content type badge
    const contentTypeBadge = `
        <div class="lesson-type-badge-inline lesson-type-${contentType}">
            ${getLessonTypeIcon(contentType)} ${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Lesson
        </div>
    `;

    return `
        <div class="lesson-edit-form">
            <div class="form-grid">
                <div class="form-group span-2">
                    <label class="form-label">Lesson Title</label>
                    <input type="text" class="form-input" value="${escapeHtml(lesson.title)}" data-lesson-field="title" data-lesson-id="${lesson.id}">
                </div>

                <div class="form-group">
                    <label class="form-label">Content Type</label>
                    ${contentTypeBadge}
                    <p class="form-hint">Content type is set when creating the lesson and cannot be changed.</p>
                </div>

                <div class="form-group">
                    <label class="form-label">XP Reward</label>
                    <input type="number" class="form-input" value="${lesson.xp_reward || 10}" data-lesson-field="xp_reward" data-lesson-id="${lesson.id}">
                </div>
                <div class="form-group">
                    <label class="form-label">Module Name</label>
                    <input type="text" class="form-input" value="${lesson.module_name || ''}" placeholder="e.g., Module 1" data-lesson-field="module_name" data-lesson-id="${lesson.id}">
                </div>
                <div class="form-group">
                    <label class="form-label">Published</label>
                    <label class="toggle-item">
                        <input type="checkbox" ${lesson.is_published ? 'checked' : ''} data-lesson-field="is_published" data-lesson-id="${lesson.id}">
                        <span class="toggle-checkbox"></span>
                        <span class="toggle-label-text">Visible to users</span>
                    </label>
                </div>

                <!-- Content Type Specific Fields -->
                ${contentType === 'text' ? `
                    <div class="form-group span-2">
                        <label class="form-label">Text Content (Markdown/HTML)</label>
                        <textarea class="form-input" rows="8" data-lesson-field="text_content" data-lesson-id="${lesson.id}" placeholder="Enter lesson content...">${lesson.text_content || ''}</textarea>
                    </div>
                ` : ''}

                ${contentType === 'video' ? `
                    <div class="form-group span-2" style="display: flex; gap: 16px;">
                        <div class="form-group" style="flex: 2;">
                            <label class="form-label">Video URL</label>
                            <input type="text" class="form-input" value="${lesson.video_url || ''}" data-lesson-field="video_url" data-lesson-id="${lesson.id}" placeholder="https://youtube.com/watch?v=...">
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label class="form-label">Duration (minutes)</label>
                            <input type="number" class="form-input" value="${lesson.video_duration_minutes || ''}" data-lesson-field="video_duration_minutes" data-lesson-id="${lesson.id}">
                        </div>
                    </div>
                ` : ''}

                ${contentType === 'quiz' ? `
                    <div class="form-group span-2">
                        <div id="quiz-editor-${lesson.id}">
                            <!-- Quiz editor will be dynamically loaded here -->
                        </div>
                    </div>
                ` : ''}
            </div>

            <div class="lesson-actions-bar">
                <button class="btn-danger btn-sm" onclick="deleteLessonInline('${lesson.id}')">
                    <i class="fas fa-trash"></i> Delete Lesson
                </button>
                <button class="btn-primary btn-sm" onclick="saveLessonInline('${lesson.id}')">
                    <i class="fas fa-save"></i> Save Lesson
                </button>
            </div>
        </div>
    `;
}

// Initialize drag-and-drop for lessons
function initializeLessonDragDrop() {
    const container = document.getElementById('lessons-accordion-container');
    if (!container) return;

    // Destroy existing sortable instance if it exists
    if (container.sortableInstance) {
        container.sortableInstance.destroy();
    }

    // Create new sortable instance
    container.sortableInstance = Sortable.create(container, {
        animation: 200,
        handle: '.lesson-drag-handle',
        ghostClass: 'lesson-ghost',
        dragClass: 'lesson-dragging',
        chosenClass: 'lesson-chosen',
        forceFallback: true,
        onEnd: async function(evt) {
            // Get all lesson items in their new order
            const items = container.querySelectorAll('.lesson-accordion-item');
            const updates = [];

            items.forEach((item, index) => {
                const lessonId = item.dataset.lessonId;
                updates.push({
                    id: lessonId,
                    order_index: index
                });
            });

            // Update order in database
            await updateLessonOrder(updates);
        }
    });
}

// Update lesson order in database
async function updateLessonOrder(updates) {
    try {
        // First, set all to negative values to avoid duplicate constraint
        // This temporarily moves them out of the way
        for (let i = 0; i < updates.length; i++) {
            const update = updates[i];
            const { error } = await supabase
                .from('lessons')
                .update({
                    order_index: -(i + 1000), // Use negative numbers temporarily
                    updated_at: new Date().toISOString()
                })
                .eq('id', update.id);

            if (error) {
                console.error('Error setting temp order for lesson:', update.id, error);
                throw error;
            }
        }

        // Then, set to the actual new order
        for (const update of updates) {
            const { error } = await supabase
                .from('lessons')
                .update({
                    order_index: update.order_index,
                    updated_at: new Date().toISOString()
                })
                .eq('id', update.id);

            if (error) {
                console.error('Error updating lesson order:', update.id, error);
                throw error;
            }
        }

        showToast('Lesson order updated!', 'success');

    } catch (error) {
        console.error('Error updating lesson order:', error);
        showToast('Failed to update lesson order: ' + error.message, 'error');

        // Reload lessons to restore correct order
        await loadCourseLessonsInline(window.currentEditingCourseId);
    }
}

// Toggle lesson accordion
async function toggleLessonAccordion(lessonId) {
    const body = document.getElementById(`lesson-body-${lessonId}`);
    const item = document.querySelector(`[data-lesson-id="${lessonId}"]`);

    if (body.style.display === 'none') {
        // Close all other accordions
        document.querySelectorAll('.lesson-accordion-body').forEach(b => b.style.display = 'none');
        document.querySelectorAll('.lesson-accordion-item').forEach(i => i.classList.remove('active'));

        // Open this one
        body.style.display = 'block';
        item.classList.add('active');

        // Check if this lesson is a quiz type and load quiz editor
        const quizEditor = document.getElementById(`quiz-editor-${lessonId}`);
        if (quizEditor) {
            await loadQuizEditorForLesson(lessonId);
        }
    } else {
        body.style.display = 'none';
        item.classList.remove('active');
    }
}

// Save lesson inline
async function saveLessonInline(lessonId) {
    try {
        const fields = document.querySelectorAll(`[data-lesson-id="${lessonId}"]`);
        const lessonData = { updated_at: new Date().toISOString() };

        fields.forEach(field => {
            const fieldName = field.dataset.lessonField;
            if (!fieldName) return;

            if (field.type === 'checkbox') {
                lessonData[fieldName] = field.checked;
            } else if (field.type === 'number') {
                lessonData[fieldName] = parseInt(field.value) || null;
            } else {
                lessonData[fieldName] = field.value.trim() || null;
            }
        });

        const { error } = await supabase
            .from('lessons')
            .update(lessonData)
            .eq('id', lessonId);

        if (error) throw error;

        showToast('Lesson saved successfully!', 'success');
        await loadCourseLessonsInline(window.currentEditingCourseId);

    } catch (error) {
        console.error('Error saving lesson:', error);
        showToast('Failed to save lesson: ' + error.message, 'error');
    }
}

// Delete lesson inline
async function deleteLessonInline(lessonId) {
    if (!confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
        return;
    }

    try {
        const { error } = await supabase
            .from('lessons')
            .delete()
            .eq('id', lessonId);

        if (error) throw error;

        showToast('Lesson deleted successfully', 'success');
        await loadCourseLessonsInline(window.currentEditingCourseId);

    } catch (error) {
        console.error('Error deleting lesson:', error);
        showToast('Failed to delete lesson: ' + error.message, 'error');
    }
}

// Add new lesson inline
// Open lesson type selection modal
function addNewLessonInline() {
    if (!window.currentEditingCourseId) {
        showToast('No course selected', 'error');
        return;
    }
    openLessonTypeModal();
}

// Open lesson type modal
function openLessonTypeModal() {
    const modal = document.getElementById('lesson-type-modal');
    if (modal) {
        modal.classList.add('active');
        lockBodyScroll();
    }
}

// Close lesson type modal
function closeLessonTypeModal() {
    const modal = document.getElementById('lesson-type-modal');
    if (modal) {
        modal.classList.remove('active');
        unlockBodyScroll();
    }
}

// Create lesson with specific type
async function createLessonWithType(contentType) {
    if (!window.currentEditingCourseId) {
        showToast('No course selected', 'error');
        return;
    }

    try {
        closeLessonTypeModal();

        // Get current lessons count to determine order_index
        const { data: existingLessons, error: countError } = await supabase
            .from('lessons')
            .select('order_index')
            .eq('course_id', window.currentEditingCourseId)
            .order('order_index', { ascending: false })
            .limit(1);

        if (countError) throw countError;

        const nextOrderIndex = existingLessons && existingLessons.length > 0
            ? existingLessons[0].order_index + 1
            : 0;

        // Create new lesson with default values based on content type
        const newLesson = {
            course_id: window.currentEditingCourseId,
            title: `New ${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Lesson`,
            slug: `new-${contentType}-lesson-${Date.now()}`,
            content_type: contentType,
            order_index: nextOrderIndex,
            xp_reward: contentType === 'quiz' ? 20 : 10,
            is_published: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Set type-specific defaults
        if (contentType === 'text') {
            newLesson.text_content = '';
        } else if (contentType === 'video') {
            newLesson.video_url = '';
            newLesson.video_duration_minutes = null;
        }
        // For quiz, we'll create the quiz when the user saves it

        const { data: createdLesson, error } = await supabase
            .from('lessons')
            .insert([newLesson])
            .select()
            .single();

        if (error) throw error;

        showToast(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} lesson created!`, 'success');

        // Reload lessons
        await loadCourseLessonsInline(window.currentEditingCourseId);

        // Auto-expand the new lesson
        setTimeout(async () => {
            if (createdLesson && createdLesson.id) {
                await toggleLessonAccordion(createdLesson.id);
            }
        }, 300);

    } catch (error) {
        console.error('Error creating lesson:', error);
        showToast('Failed to create lesson: ' + error.message, 'error');
    }
}

// Save course (inline)
async function saveCourseInline() {
    const saveBtn = document.getElementById('save-course-btn-inline');
    const originalText = saveBtn.innerHTML;

    try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        const title = document.getElementById('course-title-edit').value.trim();
        const shortDesc = document.getElementById('course-short-desc-edit').value.trim();
        const description = document.getElementById('course-description-edit').value.trim();
        const category = document.getElementById('course-category-edit').value;
        const difficulty = document.getElementById('course-difficulty-edit').value;
        const slug = document.getElementById('course-slug-edit').value.trim();

        const objectives = document.getElementById('course-objectives-edit').value
            .split('\n')
            .map(o => o.trim())
            .filter(o => o.length > 0);
        const isPublished = document.getElementById('course-published-edit').checked;
        const isFeatured = document.getElementById('course-featured-edit').checked;

        if (!title || !category || !difficulty || !slug) {
            showToast('Title, category, difficulty, and slug are required', 'error');
            return;
        }

        // Handle image uploads
        let thumbnail = document.getElementById('course-thumbnail-edit').value.trim();

        // Upload pending images if any
        if (window.pendingImageUploads) {
            // Upload thumbnail if pending
            if (window.pendingImageUploads.thumbnail) {
                saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading thumbnail...';
                try {
                    thumbnail = await uploadImageToSupabase(
                        window.pendingImageUploads.thumbnail,
                        'thumbnail',
                        window.currentEditingCourseId
                    );
                    // Update the URL input field
                    document.getElementById('course-thumbnail-edit').value = thumbnail;
                    delete window.pendingImageUploads.thumbnail;
                } catch (uploadError) {
                    console.error('Thumbnail upload failed:', uploadError);
                    showToast('Thumbnail upload failed: ' + uploadError.message, 'error');
                    return;
                }
            }
        }

        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving course...';

        const courseData = {
            title,
            short_description: shortDesc || null,
            description: description || null,
            category,
            difficulty,
            slug,
            thumbnail_url: thumbnail || null,
            learning_objectives: objectives.length > 0 ? objectives : null,
            is_published: isPublished,
            is_featured: isFeatured,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('courses')
            .update(courseData)
            .eq('id', window.currentEditingCourseId);

        if (error) throw error;

        showToast('Course updated successfully!', 'success');
        await loadCourses(); // Refresh course list in background

    } catch (error) {
        console.error('Error saving course:', error);
        showToast('Failed to save course: ' + error.message, 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    }
}

// Helper functions
function getLessonTypeIcon(type) {
    const icons = {
        'text': '<i class="fas fa-file-alt"></i>',
        'video': '<i class="fas fa-video"></i>',
        'quiz': '<i class="fas fa-question-circle"></i>'
    };
    return icons[type] || '<i class="fas fa-file"></i>';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions global
window.addNewCourse = addNewCourse;
window.editCourse = editCourse;
window.backToCoursesView = backToCoursesView;
window.toggleLessonAccordion = toggleLessonAccordion;
window.saveLessonInline = saveLessonInline;
window.deleteLessonInline = deleteLessonInline;
// ============================================
// Quiz Management for Lessons
// ============================================

// Load quiz editor for a lesson
async function loadQuizEditorForLesson(lessonId) {
    try {
        const container = document.getElementById(`quiz-editor-${lessonId}`);
        if (!container) return;

        // Get lesson data to check if it has an existing quiz
        const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .select('quiz_id')
            .eq('id', lessonId)
            .single();

        if (lessonError) throw lessonError;

        let quizData = null;
        if (lesson.quiz_id) {
            // Load existing quiz
            const { data: quiz, error: quizError } = await supabase
                .from('quizzes')
                .select('*')
                .eq('id', lesson.quiz_id)
                .single();

            if (quizError) throw quizError;
            quizData = quiz;
        }

        // Render quiz editor
        renderQuizEditor(lessonId, quizData);

    } catch (error) {
        console.error('Error loading quiz editor:', error);
        showToast('Failed to load quiz editor: ' + error.message, 'error');
    }
}

// Render quiz editor UI
function renderQuizEditor(lessonId, quizData) {
    const container = document.getElementById(`quiz-editor-${lessonId}`);
    if (!container) return;

    // Parse questions if they're stored as JSON string
    let questions = [];
    if (quizData?.questions) {
        if (typeof quizData.questions === 'string') {
            try {
                questions = JSON.parse(quizData.questions);
            } catch (e) {
                console.error('Error parsing questions:', e);
                questions = [];
            }
        } else if (Array.isArray(quizData.questions)) {
            questions = quizData.questions;
        }
    }

    container.innerHTML = `
        <div class="quiz-editor-container">
            <div class="quiz-settings-section">
                <h4 class="quiz-section-title">
                    <i class="fas fa-cog"></i> Quiz Settings
                </h4>
                <div class="form-grid">
                    <div class="form-group span-2">
                        <label class="form-label">Quiz Title</label>
                        <input type="text" class="form-input" id="quiz-title-${lessonId}"
                               value="${escapeHtml(quizData?.title || '')}"
                               placeholder="Enter quiz title...">
                    </div>
                    <div class="form-group span-2">
                        <label class="form-label">Quiz Description</label>
                        <textarea class="form-input" id="quiz-description-${lessonId}"
                                  rows="2" placeholder="Brief description of the quiz...">${escapeHtml(quizData?.description || '')}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Passing Score (%)</label>
                        <input type="number" class="form-input" id="quiz-passing-score-${lessonId}"
                               value="${quizData?.passing_score || 70}" min="0" max="100">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Time Limit (minutes)</label>
                        <input type="number" class="form-input" id="quiz-time-limit-${lessonId}"
                               value="${quizData?.time_limit_minutes || ''}" placeholder="Optional">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Max Attempts</label>
                        <input type="number" class="form-input" id="quiz-max-attempts-${lessonId}"
                               value="${quizData?.max_attempts || ''}" placeholder="Unlimited">
                    </div>
                    <div class="form-group">
                        <label class="form-label">XP Reward</label>
                        <input type="number" class="form-input" id="quiz-xp-reward-${lessonId}"
                               value="${quizData?.xp_reward || 20}">
                    </div>
                </div>
            </div>

            <div class="quiz-questions-section">
                <div class="quiz-section-header">
                    <h4 class="quiz-section-title">
                        <i class="fas fa-question-circle"></i> Questions
                    </h4>
                    <button class="btn-primary btn-sm" onclick="addQuizQuestion('${lessonId}')">
                        <i class="fas fa-plus"></i> Add Question
                    </button>
                </div>

                <div id="quiz-questions-container-${lessonId}" class="quiz-questions-container">
                    ${questions.length === 0 ? `
                        <div class="empty-state-quiz">
                            <i class="fas fa-question-circle"></i>
                            <p>No questions yet. Click "Add Question" to create your first question.</p>
                        </div>
                    ` : renderQuizQuestions(lessonId, questions)}
                </div>
            </div>

            <div class="quiz-actions-bar">
                <button class="btn-secondary btn-sm" onclick="cancelQuizEdit('${lessonId}')">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button class="btn-primary btn-sm" onclick="saveQuizForLesson('${lessonId}')">
                    <i class="fas fa-save"></i> Save Quiz
                </button>
            </div>
        </div>
    `;

    // Store quiz ID if editing existing quiz
    if (quizData?.id) {
        container.dataset.quizId = quizData.id;
    }

    // Add event listeners for existing radio buttons
    setTimeout(() => {
        const questionItems = container.querySelectorAll('.quiz-question-item');
        questionItems.forEach((item, index) => {
            const radios = item.querySelectorAll('.option-radio');
            radios.forEach(radio => {
                radio.addEventListener('change', function() {
                    updateCorrectIndicators(lessonId, index);
                });
            });
        });
    }, 100);
}

// Render quiz questions
function renderQuizQuestions(lessonId, questions) {
    return questions.map((q, index) => `
        <div class="quiz-question-item" data-question-index="${index}">
            <div class="quiz-question-header">
                <span class="question-number">Question ${index + 1}</span>
                <button class="btn-icon btn-danger" onclick="deleteQuizQuestion('${lessonId}', ${index})" title="Delete question">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="quiz-question-body">
                <div class="form-group">
                    <label class="form-label">Question Text</label>
                    <textarea class="form-input question-text" rows="2"
                              placeholder="Enter your question...">${escapeHtml(q.question || '')}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Options</label>
                    <div class="quiz-options-list">
                        ${(q.options || ['', '', '', '']).map((opt, optIndex) => `
                            <div class="quiz-option-item">
                                <input type="radio"
                                       name="correct-answer-${lessonId}-${index}"
                                       value="${optIndex}"
                                       ${q.correct_answer === optIndex ? 'checked' : ''}
                                       class="option-radio">
                                <input type="text"
                                       class="form-input option-text"
                                       value="${escapeHtml(opt)}"
                                       placeholder="Option ${optIndex + 1}">
                                <span class="correct-indicator ${q.correct_answer === optIndex ? 'active' : ''}">
                                    <i class="fas fa-check-circle"></i> Correct
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Explanation (Optional)</label>
                    <textarea class="form-input question-explanation" rows="2"
                              placeholder="Explain why this is the correct answer...">${escapeHtml(q.explanation || '')}</textarea>
                </div>
            </div>
        </div>
    `).join('');
}

// Add new quiz question
function addQuizQuestion(lessonId) {
    const container = document.getElementById(`quiz-questions-container-${lessonId}`);
    if (!container) return;

    // Remove empty state if exists
    const emptyState = container.querySelector('.empty-state-quiz');
    if (emptyState) {
        emptyState.remove();
    }

    // Get current question count
    const questionCount = container.querySelectorAll('.quiz-question-item').length;

    // Add new question HTML
    const newQuestionHTML = `
        <div class="quiz-question-item" data-question-index="${questionCount}">
            <div class="quiz-question-header">
                <span class="question-number">Question ${questionCount + 1}</span>
                <button class="btn-icon btn-danger" onclick="deleteQuizQuestion('${lessonId}', ${questionCount})" title="Delete question">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="quiz-question-body">
                <div class="form-group">
                    <label class="form-label">Question Text</label>
                    <textarea class="form-input question-text" rows="2"
                              placeholder="Enter your question..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Options</label>
                    <div class="quiz-options-list">
                        ${[0, 1, 2, 3].map(optIndex => `
                            <div class="quiz-option-item">
                                <input type="radio"
                                       name="correct-answer-${lessonId}-${questionCount}"
                                       value="${optIndex}"
                                       ${optIndex === 0 ? 'checked' : ''}
                                       class="option-radio">
                                <input type="text"
                                       class="form-input option-text"
                                       placeholder="Option ${optIndex + 1}">
                                <span class="correct-indicator ${optIndex === 0 ? 'active' : ''}">
                                    <i class="fas fa-check-circle"></i> Correct
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Explanation (Optional)</label>
                    <textarea class="form-input question-explanation" rows="2"
                              placeholder="Explain why this is the correct answer..."></textarea>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', newQuestionHTML);

    // Add event listeners for radio buttons
    const newItem = container.querySelector(`[data-question-index="${questionCount}"]`);
    const radios = newItem.querySelectorAll('.option-radio');
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateCorrectIndicators(lessonId, questionCount);
        });
    });

    showToast('Question added', 'success');
}

// Delete quiz question
function deleteQuizQuestion(lessonId, questionIndex) {
    if (!confirm('Are you sure you want to delete this question?')) {
        return;
    }

    const container = document.getElementById(`quiz-questions-container-${lessonId}`);
    if (!container) return;

    const questionItem = container.querySelector(`[data-question-index="${questionIndex}"]`);
    if (questionItem) {
        questionItem.remove();
    }

    // Reindex remaining questions
    const allQuestions = container.querySelectorAll('.quiz-question-item');
    allQuestions.forEach((item, index) => {
        item.dataset.questionIndex = index;
        const questionNumber = item.querySelector('.question-number');
        if (questionNumber) {
            questionNumber.textContent = `Question ${index + 1}`;
        }
        // Update radio button names
        const radios = item.querySelectorAll('.option-radio');
        radios.forEach(radio => {
            radio.name = `correct-answer-${lessonId}-${index}`;
        });
    });

    // Show empty state if no questions left
    if (allQuestions.length === 0) {
        container.innerHTML = `
            <div class="empty-state-quiz">
                <i class="fas fa-question-circle"></i>
                <p>No questions yet. Click "Add Question" to create your first question.</p>
            </div>
        `;
    }

    showToast('Question deleted', 'success');
}

// Update correct answer indicators
function updateCorrectIndicators(lessonId, questionIndex) {
    const questionItem = document.querySelector(`[data-question-index="${questionIndex}"]`);
    if (!questionItem) return;

    const indicators = questionItem.querySelectorAll('.correct-indicator');
    const radios = questionItem.querySelectorAll('.option-radio');

    radios.forEach((radio, index) => {
        if (radio.checked) {
            indicators[index].classList.add('active');
        } else {
            indicators[index].classList.remove('active');
        }
    });
}

// Save quiz for lesson
async function saveQuizForLesson(lessonId) {
    try {
        const container = document.getElementById(`quiz-editor-${lessonId}`);
        if (!container) return;

        // Collect quiz data
        const title = document.getElementById(`quiz-title-${lessonId}`).value.trim();
        const description = document.getElementById(`quiz-description-${lessonId}`).value.trim();
        const passingScore = parseInt(document.getElementById(`quiz-passing-score-${lessonId}`).value) || 70;
        const timeLimit = parseInt(document.getElementById(`quiz-time-limit-${lessonId}`).value) || null;
        const maxAttempts = parseInt(document.getElementById(`quiz-max-attempts-${lessonId}`).value) || null;
        const xpReward = parseInt(document.getElementById(`quiz-xp-reward-${lessonId}`).value) || 20;

        if (!title) {
            showToast('Please enter a quiz title', 'error');
            return;
        }

        // Collect questions
        const questionItems = document.querySelectorAll(`#quiz-questions-container-${lessonId} .quiz-question-item`);
        const questions = [];

        questionItems.forEach((item, index) => {
            const questionText = item.querySelector('.question-text').value.trim();
            const optionInputs = item.querySelectorAll('.option-text');
            const options = Array.from(optionInputs).map(input => input.value.trim());
            const correctRadio = item.querySelector('.option-radio:checked');
            const correctAnswer = correctRadio ? parseInt(correctRadio.value) : 0;
            const explanation = item.querySelector('.question-explanation').value.trim();

            if (questionText && options.some(opt => opt)) {
                questions.push({
                    question: questionText,
                    options: options,
                    correct_answer: correctAnswer,
                    explanation: explanation || null
                });
            }
        });

        if (questions.length === 0) {
            showToast('Please add at least one question with options', 'error');
            return;
        }

        const quizData = {
            title,
            description,
            passing_score: passingScore,
            time_limit_minutes: timeLimit,
            max_attempts: maxAttempts,
            xp_reward: xpReward,
            questions: JSON.stringify(questions),
            updated_at: new Date().toISOString()
        };

        const existingQuizId = container.dataset.quizId;

        let quizId;
        if (existingQuizId) {
            // Update existing quiz
            const { error } = await supabase
                .from('quizzes')
                .update(quizData)
                .eq('id', existingQuizId);

            if (error) throw error;
            quizId = existingQuizId;
        } else {
            // Create new quiz
            quizData.created_at = new Date().toISOString();
            const { data: newQuiz, error } = await supabase
                .from('quizzes')
                .insert([quizData])
                .select()
                .single();

            if (error) throw error;
            quizId = newQuiz.id;
        }

        // Update lesson to link to quiz
        const { error: lessonError } = await supabase
            .from('lessons')
            .update({
                quiz_id: quizId,
                updated_at: new Date().toISOString()
            })
            .eq('id', lessonId);

        if (lessonError) throw lessonError;

        showToast('Quiz saved successfully!', 'success');

        // Reload the quiz editor to reflect saved state
        await loadQuizEditorForLesson(lessonId);

    } catch (error) {
        console.error('Error saving quiz:', error);
        showToast('Failed to save quiz: ' + error.message, 'error');
    }
}

// Cancel quiz edit
function cancelQuizEdit(lessonId) {
    // Just reload the quiz editor to reset any changes
    loadQuizEditorForLesson(lessonId);
}

// Make functions globally accessible
window.loadQuizEditorForLesson = loadQuizEditorForLesson;
window.addQuizQuestion = addQuizQuestion;
window.deleteQuizQuestion = deleteQuizQuestion;
window.saveQuizForLesson = saveQuizForLesson;
window.cancelQuizEdit = cancelQuizEdit;

window.addNewLessonInline = addNewLessonInline;
window.openLessonTypeModal = openLessonTypeModal;
window.closeLessonTypeModal = closeLessonTypeModal;
window.createLessonWithType = createLessonWithType;
window.saveCourseInline = saveCourseInline;

async function deleteCourse(courseId) {
    const confirmed = confirm('Are you sure you want to delete this course? This will also delete all associated lessons. This action cannot be undone.');
    if (!confirmed) return;

    try {
        // First, delete all lessons associated with this course
        const { error: lessonsError } = await supabase
            .from('lessons')
            .delete()
            .eq('course_id', courseId);

        if (lessonsError) {
            console.error('Error deleting lessons:', lessonsError);
            showToast('Failed to delete course lessons: ' + lessonsError.message, 'error');
            return;
        }

        // Then delete the course itself
        const { error: courseError } = await supabase
            .from('courses')
            .delete()
            .eq('id', courseId);

        if (courseError) {
            console.error('Error deleting course:', courseError);
            showToast('Failed to delete course: ' + courseError.message, 'error');
            return;
        }

        showToast('Course deleted successfully', 'success');

        // Reload courses list
        await loadCourses();

    } catch (error) {
        console.error('Unexpected error deleting course:', error);
        showToast('Failed to delete course: ' + error.message, 'error');
    }
}

async function editCertification(certId) {
    try {
        const { data: cert, error } = await supabase
            .from('certifications')
            .select('*')
            .eq('id', certId)
            .single();

        if (error) {
            console.error('Error loading certification:', error);
            showToast('Failed to load certification', 'error');
            return;
        }

        openCertModal(cert);

    } catch (err) {
        console.error('Unexpected error loading certification:', err);
        showToast('Failed to load certification', 'error');
    }
}

async function deleteCertification(certId) {
    const confirmed = confirm('Are you sure you want to delete this certification? This action cannot be undone.');
    if (!confirmed) return;

    try {
        const { error } = await supabase
            .from('certifications')
            .delete()
            .eq('id', certId);

        if (error) {
            console.error('Error deleting certification:', error);
            showToast('Failed to delete certification: ' + error.message, 'error');
            return;
        }

        showToast('Certification deleted successfully.', 'success');
        loadCertifications();

    } catch (err) {
        console.error('Unexpected error deleting certification:', err);
        showToast('Failed to delete certification', 'error');
    }
}

// ============================================
// Logout
// ============================================

async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error logging out:', error);
        alert('Failed to logout. Please try again.');
    }
}

// ============================================
// Helper Functions
// ============================================

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getTimeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return formatDate(date);
}

// ============================================
// Toast Notifications (Admin UI)
// ============================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) {
        // Fallback to alert if container is missing
        alert(message);
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Trigger fade-in
    requestAnimationFrame(() => {
        toast.classList.add('toast-visible');
    });

    // Auto-dismiss
    setTimeout(() => {
        toast.classList.remove('toast-visible');
    }, 2800);

    setTimeout(() => {
        if (toast.parentElement === container) {
            container.removeChild(toast);
        }
    }, 3400);
}

function generateSlugFromTitle(title) {
    if (!title) return '';
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// ============================================
// Practice Exercise Management
// ============================================

let exerciseQuestions = [];
let editingQuestionIndex = null;

// Load certifications and practice exercises on page load
if (document.getElementById('certifications-tab')) {
    loadCertifications();

    // Certification filter event listeners
    const certSearchInput = document.getElementById('cert-search');
    const certCategoryFilter = document.getElementById('cert-category-filter');
    const certStatusFilter = document.getElementById('cert-status-filter');

    if (certSearchInput) {
        certSearchInput.addEventListener('input', (e) => {
            certFilters.search = e.target.value;
            applyCertFilters();
        });
    }

    if (certCategoryFilter) {
        certCategoryFilter.addEventListener('change', (e) => {
            certFilters.category = e.target.value;
            applyCertFilters();
        });
    }

    if (certStatusFilter) {
        certStatusFilter.addEventListener('change', (e) => {
            certFilters.status = e.target.value;
            applyCertFilters();
        });
    }

    // Certification pagination event listeners
    const certPrevBtn = document.getElementById('cert-prev-btn');
    const certNextBtn = document.getElementById('cert-next-btn');
    const certPerPageSelect = document.getElementById('cert-per-page');

    if (certPrevBtn) {
        certPrevBtn.addEventListener('click', certPrevPage);
    }

    if (certNextBtn) {
        certNextBtn.addEventListener('click', certNextPage);
    }

    if (certPerPageSelect) {
        certPerPageSelect.addEventListener('change', (e) => {
            certPerPage = parseInt(e.target.value, 10);
            certCurrentPage = 1;
            applyCertFilters(false);
        });
    }
}

if (document.getElementById('exercises-tab')) {
    loadExercises();
}

// Open add certification modal
document.getElementById('add-cert-btn')?.addEventListener('click', () => {
    openCertModal(null);
});

// Open add exercise modal
document.getElementById('add-exercise-btn')?.addEventListener('click', () => {
    document.getElementById('exercise-modal-title').textContent = 'Add New Practice Exercise';
    document.getElementById('exercise-form').reset();
    document.getElementById('exercise-id').value = '';
    exerciseQuestions = [];
    renderQuestions();
    document.getElementById('exercise-modal').classList.add('active');
    lockBodyScroll();
});

// Edit exercise
async function editExercise(exerciseId) {
    try {
        const { data: exercise, error } = await supabase
            .from('practice_exercises')
            .select('*')
            .eq('id', exerciseId)
            .single();

        if (error) {
            console.error('Error loading exercise:', error);
            alert('Failed to load exercise');
            return;
        }

        // Populate form
        document.getElementById('exercise-modal-title').textContent = 'Edit Practice Exercise';
        document.getElementById('exercise-id').value = exercise.id;
        document.getElementById('exercise-title').value = exercise.title;
        document.getElementById('exercise-slug').value = exercise.slug;
        document.getElementById('exercise-description').value = exercise.description || '';
        document.getElementById('exercise-category').value = exercise.category;
        document.getElementById('exercise-difficulty').value = exercise.difficulty || '';
        document.getElementById('exercise-published').checked = exercise.is_published;
        document.getElementById('exercise-passing-score').value = exercise.passing_score || 70;
        document.getElementById('exercise-time-limit').value = exercise.time_limit_minutes || '';
        document.getElementById('exercise-xp-reward').value = exercise.xp_reward || 15;
        document.getElementById('exercise-tags').value = exercise.tags ? exercise.tags.join(', ') : '';

        // Load questions
        exerciseQuestions = Array.isArray(exercise.questions) ? exercise.questions : [];
        renderQuestions();

        // Open modal
        document.getElementById('exercise-modal').classList.add('active');
        lockBodyScroll();

    } catch (error) {
        console.error('Unexpected error editing exercise:', error);
        alert('Failed to load exercise');
    }
}

// Delete exercise
async function deleteExercise(exerciseId, exerciseTitle) {
    const confirmed = confirm(`Are you sure you want to delete the exercise "${exerciseTitle}"?\n\nThis action cannot be undone.`);
    if (!confirmed) return;

    try {
        const { error } = await supabase
            .from('practice_exercises')
            .delete()
            .eq('id', exerciseId);

        if (error) {
            console.error('Error deleting exercise:', error);
            alert('Failed to delete exercise: ' + error.message);
            return;
        }

        alert('Exercise deleted successfully!');
        loadExercises();

    } catch (error) {
        console.error('Unexpected error deleting exercise:', error);
        alert('Failed to delete exercise');
    }
}

// Close exercise modal
function closeExerciseModal() {
    document.getElementById('exercise-modal').classList.remove('active');
    unlockBodyScroll();
    document.getElementById('exercise-form').reset();
    exerciseQuestions = [];
    editingQuestionIndex = null;
}

// Handle certification form submission
document.getElementById('cert-form')?.addEventListener('submit', handleCertFormSubmit);

// Handle exercise form submission
document.getElementById('exercise-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const exerciseId = document.getElementById('exercise-id').value;
    const title = document.getElementById('exercise-title').value.trim();
    const slug = document.getElementById('exercise-slug').value.trim();
    const description = document.getElementById('exercise-description').value.trim();
    const category = document.getElementById('exercise-category').value;
    const difficulty = document.getElementById('exercise-difficulty').value;
    const isPublished = document.getElementById('exercise-published').checked;
    const passingScore = parseInt(document.getElementById('exercise-passing-score').value) || 70;
    const timeLimit = parseInt(document.getElementById('exercise-time-limit').value) || null;
    const xpReward = parseInt(document.getElementById('exercise-xp-reward').value) || 15;
    const tags = document.getElementById('exercise-tags').value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

    // Validation
    if (!title || !slug || !category) {
        alert('Please fill in all required fields (Title, Slug, Category)');
        return;
    }

    if (exerciseQuestions.length === 0) {
        alert('Please add at least one question to the exercise');
        return;
    }

    const exerciseData = {
        title,
        slug,
        description,
        category,
        difficulty,
        is_published: isPublished,
        passing_score: passingScore,
        time_limit_minutes: timeLimit,
        xp_reward: xpReward,
        tags,
        questions: exerciseQuestions,
        updated_at: new Date().toISOString()
    };

    try {
        let result;

        if (exerciseId) {
            // Update existing exercise
            result = await supabase
                .from('practice_exercises')
                .update(exerciseData)
                .eq('id', exerciseId);
        } else {
            // Create new exercise
            const { data: { user } } = await supabase.auth.getUser();
            exerciseData.created_by = user?.id;

            result = await supabase
                .from('practice_exercises')
                .insert([exerciseData]);
        }

        if (result.error) {
            console.error('Error saving exercise:', result.error);
            alert('Failed to save exercise: ' + result.error.message);
            return;
        }

        alert(exerciseId ? 'Exercise updated successfully!' : 'Exercise created successfully!');
        closeExerciseModal();
        loadExercises();

    } catch (error) {
        console.error('Unexpected error saving exercise:', error);
        alert('Failed to save exercise');
    }
});

// ============================================
// Question Management
// ============================================

function addQuestion() {
    const newQuestion = {
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        explanation: ''
    };

    exerciseQuestions.push(newQuestion);
    editingQuestionIndex = exerciseQuestions.length - 1;
    renderQuestions();
}

function renderQuestions() {
    const container = document.getElementById('questions-container');
    if (!container) return;

    if (exerciseQuestions.length === 0) {
        container.innerHTML = `
            <div class="empty-questions">
                <i class="fas fa-question-circle"></i>
                <p>No questions yet. Click "Add Question" to create your first question.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = exerciseQuestions.map((q, index) => {
        if (editingQuestionIndex === index) {
            return renderQuestionEditForm(q, index);
        } else {
            return renderQuestionCard(q, index);
        }
    }).join('');
}

function renderQuestionCard(question, index) {
    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

    return `
        <div class="question-card">
            <div class="question-card-header">
                <div class="question-number">
                    <div class="question-badge">${index + 1}</div>
                </div>
                <div class="question-card-actions">
                    <button type="button" class="btn-icon" onclick="startEditQuestion(${index})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn-icon btn-danger" onclick="deleteQuestion(${index})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="question-text">${question.question || '<em>Question text not set</em>'}</div>
            <div class="question-options">
                ${question.options.map((option, optIndex) => `
                    <div class="option-item ${optIndex === question.correct_answer ? 'correct' : ''}">
                        <div class="option-letter">${optionLetters[optIndex]}</div>
                        <div class="option-text">${option || '<em>Empty option</em>'}</div>
                    </div>
                `).join('')}
            </div>
            ${question.explanation ? `
                <div class="question-explanation">
                    <span class="explanation-label">Explanation:</span>
                    ${question.explanation}
                </div>
            ` : ''}
        </div>
    `;
}

function renderQuestionEditForm(question, index) {
    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

    return `
        <div class="question-edit-form">
            <div class="question-edit-header">
                <div class="question-edit-title">
                    <span>Question ${index + 1}</span>
                    <span class="edit-badge">EDITING</span>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Question Text <span class="required">*</span></label>
                <textarea class="form-input" id="q-text-${index}" rows="3" required>${question.question}</textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Answer Options <span class="required">*</span></label>
                <small class="form-hint">Select the correct answer using the radio button</small>
                <div id="options-container-${index}">
                    ${question.options.map((option, optIndex) => `
                        <div class="option-edit-item">
                            <div class="radio-wrapper">
                                <input type="radio" name="correct-${index}" value="${optIndex}"
                                    ${optIndex === question.correct_answer ? 'checked' : ''}>
                            </div>
                            <input type="text" class="form-input" placeholder="Option ${optionLetters[optIndex]}"
                                   value="${option}" data-option-index="${optIndex}">
                            ${question.options.length > 2 ? `
                                <button type="button" class="btn-remove-option" onclick="removeOption(${index}, ${optIndex})">
                                    <i class="fas fa-times"></i>
                                </button>
                            ` : '<div style="width: 32px;"></div>'}
                        </div>
                    `).join('')}
                </div>
                ${question.options.length < 6 ? `
                    <button type="button" class="btn-add-option" onclick="addOption(${index})">
                        <i class="fas fa-plus"></i> Add Option
                    </button>
                ` : ''}
            </div>

            <div class="form-group">
                <label class="form-label">Explanation</label>
                <textarea class="form-input" id="q-explanation-${index}" rows="2"
                          placeholder="Explain why this is the correct answer...">${question.explanation || ''}</textarea>
            </div>

            <div class="question-edit-actions">
                <button type="button" class="btn-secondary" onclick="cancelEditQuestion()">Cancel</button>
                <button type="button" class="btn-primary" onclick="saveQuestion(${index})">
                    <i class="fas fa-check"></i> Save Question
                </button>
            </div>
        </div>
    `;
}

function startEditQuestion(index) {
    editingQuestionIndex = index;
    renderQuestions();
}

function cancelEditQuestion() {
    // If question is incomplete, remove it
    const question = exerciseQuestions[editingQuestionIndex];
    if (!question.question && question.options.every(opt => !opt)) {
        exerciseQuestions.splice(editingQuestionIndex, 1);
    }
    editingQuestionIndex = null;
    renderQuestions();
}

function saveQuestion(index) {
    const questionText = document.getElementById(`q-text-${index}`).value.trim();
    const explanation = document.getElementById(`q-explanation-${index}`).value.trim();

    // Get options
    const optionInputs = document.querySelectorAll(`#options-container-${index} input[type="text"]`);
    const options = Array.from(optionInputs).map(input => input.value.trim());

    // Get correct answer
    const correctRadio = document.querySelector(`input[name="correct-${index}"]:checked`);
    const correctAnswer = correctRadio ? parseInt(correctRadio.value) : 0;

    // Validation
    if (!questionText) {
        alert('Please enter the question text');
        return;
    }

    if (options.some(opt => !opt)) {
        alert('Please fill in all answer options');
        return;
    }

    // Update question
    exerciseQuestions[index] = {
        question: questionText,
        options: options,
        correct_answer: correctAnswer,
        explanation: explanation
    };

    editingQuestionIndex = null;
    renderQuestions();
}

function deleteQuestion(index) {
    if (!confirm('Are you sure you want to delete this question?')) return;

    exerciseQuestions.splice(index, 1);
    if (editingQuestionIndex === index) {
        editingQuestionIndex = null;
    } else if (editingQuestionIndex > index) {
        editingQuestionIndex--;
    }
    renderQuestions();
}

function addOption(questionIndex) {
    const question = exerciseQuestions[questionIndex];
    if (question.options.length >= 6) {
        alert('Maximum 6 options allowed');
        return;
    }
    question.options.push('');
    renderQuestions();
}

function removeOption(questionIndex, optionIndex) {
    const question = exerciseQuestions[questionIndex];
    if (question.options.length <= 2) {
        alert('Minimum 2 options required');
        return;
    }

    question.options.splice(optionIndex, 1);

    // Adjust correct_answer if needed
    if (question.correct_answer === optionIndex) {
        question.correct_answer = 0;
    } else if (question.correct_answer > optionIndex) {
        question.correct_answer--;
    }

    renderQuestions();
}

// Make functions global for onclick handlers
window.editCourse = editCourse;
window.deleteCourse = deleteCourse;
window.editCertification = editCertification;
window.deleteCertification = deleteCertification;
window.handleCertHeaderCheckboxChange = handleCertHeaderCheckboxChange;
window.handleCertRowCheckboxChange = handleCertRowCheckboxChange;
window.editExercise = editExercise;
window.deleteExercise = deleteExercise;
window.closeExerciseModal = closeExerciseModal;
window.closeCertModal = closeCertModal;
window.addQuestion = addQuestion;
window.startEditQuestion = startEditQuestion;
window.cancelEditQuestion = cancelEditQuestion;
window.saveQuestion = saveQuestion;
window.deleteQuestion = deleteQuestion;
window.addOption = addOption;
window.removeOption = removeOption;
window.addStudyResource = addStudyResource;
window.removeStudyResource = removeStudyResource;
window.updateStudyResourceTitle = updateStudyResourceTitle;
window.updateStudyResourceUrl = updateStudyResourceUrl;
window.updateStudyResourceType = updateStudyResourceType;
window.goToCertPage = goToCertPage;

// ============================================
// Learning Paths Management
// ============================================

let learningPathCourses = []; // Courses in the current path being built
let allCoursesForPaths = []; // All available courses

// Initialize Learning Paths tab
async function initializeLearningPaths() {
    await loadCoursesForPaths();
    await loadExistingPaths();
    setupPathBuilderListeners();
}

// Load all courses for path building
async function loadCoursesForPaths() {
    try {
        const { data: courses, error } = await supabase
            .from('courses')
            .select('id, slug, title, category, difficulty, prerequisites, is_published')
            .eq('is_published', true)
            .order('title', { ascending: true });

        if (error) throw error;

        allCoursesForPaths = courses || [];
        renderAvailableCourses(allCoursesForPaths);
    } catch (error) {
        console.error('Error loading courses for paths:', error);
        document.getElementById('available-courses-list').innerHTML =
            '<div class="error-message"><i class="fas fa-exclamation-circle"></i>Error loading courses</div>';
    }
}

// Render available courses list
function renderAvailableCourses(courses, filterCategory = 'all') {
    const container = document.getElementById('available-courses-list');

    let filteredCourses = courses;
    if (filterCategory !== 'all') {
        filteredCourses = courses.filter(c => c.category === filterCategory);
    }

    if (filteredCourses.length === 0) {
        container.innerHTML = '<div class="empty-message">No courses available</div>';
        return;
    }

    container.innerHTML = filteredCourses.map(course => {
        const isInPath = learningPathCourses.some(c => c.id === course.id);
        const hasPrereqs = course.prerequisites && course.prerequisites.length > 0;

        return `
            <div class="available-course-item ${isInPath ? 'in-path' : ''}"
                 data-course-id="${course.id}"
                 onclick="addCourseToPath('${course.id}')">
                <div class="course-item-info">
                    <h6>${escapeHtml(course.title)}</h6>
                    <div class="course-item-meta">
                        <span class="category-badge">${course.category}</span>
                        <span class="difficulty-badge">${course.difficulty}</span>
                        ${hasPrereqs ? '<span class="has-prereq-badge"><i class="fas fa-lock"></i></span>' : ''}
                    </div>
                </div>
                ${isInPath ? '<i class="fas fa-check-circle course-added-icon"></i>' : '<i class="fas fa-plus-circle course-add-icon"></i>'}
            </div>
        `;
    }).join('');
}

// Add course to learning path
function addCourseToPath(courseId) {
    const course = allCoursesForPaths.find(c => c.id === courseId);
    if (!course) return;

    // Check if already in path
    if (learningPathCourses.some(c => c.id === courseId)) {
        showToast('Course already in path', 'warning');
        return;
    }

    // Add to path
    learningPathCourses.push(course);
    renderLearningPathSequence();
    renderAvailableCourses(allCoursesForPaths, document.getElementById('path-category-filter').value);

    // Enable buttons
    document.getElementById('clear-path-btn').disabled = false;
    document.getElementById('save-path-btn').disabled = learningPathCourses.length < 2;
}

// Remove course from path
function removeCourseFromPath(courseId) {
    learningPathCourses = learningPathCourses.filter(c => c.id !== courseId);
    renderLearningPathSequence();
    renderAvailableCourses(allCoursesForPaths, document.getElementById('path-category-filter').value);

    // Update buttons
    document.getElementById('clear-path-btn').disabled = learningPathCourses.length === 0;
    document.getElementById('save-path-btn').disabled = learningPathCourses.length < 2;
}

// Move course up in sequence
function moveCourseUp(index) {
    if (index === 0) return;
    [learningPathCourses[index], learningPathCourses[index - 1]] =
    [learningPathCourses[index - 1], learningPathCourses[index]];
    renderLearningPathSequence();
}

// Move course down in sequence
function moveCourseDown(index) {
    if (index === learningPathCourses.length - 1) return;
    [learningPathCourses[index], learningPathCourses[index + 1]] =
    [learningPathCourses[index + 1], learningPathCourses[index]];
    renderLearningPathSequence();
}

// Render learning path sequence
function renderLearningPathSequence() {
    const container = document.getElementById('learning-path-sequence');

    if (learningPathCourses.length === 0) {
        container.innerHTML = `
            <div class="empty-path-message">
                <i class="fas fa-route"></i>
                <p>Click courses from the left to build your path</p>
            </div>
        `;
        return;
    }

    container.innerHTML = learningPathCourses.map((course, index) => `
        <div class="path-course-item">
            <div class="path-course-number">${index + 1}</div>
            <div class="path-course-info">
                <h6>${escapeHtml(course.title)}</h6>
                <div class="path-course-meta">
                    <span class="category-badge">${course.category}</span>
                    <span class="difficulty-badge">${course.difficulty}</span>
                    ${index > 0 ? `<span class="prerequisite-tag">Requires: ${learningPathCourses[index - 1].title}</span>` : '<span class="start-tag">Starting Course</span>'}
                </div>
            </div>
            <div class="path-course-actions">
                ${index > 0 ? `<button class="btn-icon" onclick="moveCourseUp(${index})" title="Move up"><i class="fas fa-arrow-up"></i></button>` : ''}
                ${index < learningPathCourses.length - 1 ? `<button class="btn-icon" onclick="moveCourseDown(${index})" title="Move down"><i class="fas fa-arrow-down"></i></button>` : ''}
                <button class="btn-icon btn-delete" onclick="removeCourseFromPath('${course.id}')" title="Remove"><i class="fas fa-times"></i></button>
            </div>
        </div>
        ${index < learningPathCourses.length - 1 ? '<div class="path-arrow-down"><i class="fas fa-arrow-down"></i></div>' : ''}
    `).join('');
}

// Clear learning path
function clearLearningPath() {
    if (learningPathCourses.length === 0) return;

    if (!confirm('Are you sure you want to clear this learning path?')) return;

    learningPathCourses = [];
    renderLearningPathSequence();
    renderAvailableCourses(allCoursesForPaths, document.getElementById('path-category-filter').value);

    document.getElementById('clear-path-btn').disabled = true;
    document.getElementById('save-path-btn').disabled = true;
}

// Save learning path
async function saveLearningPath() {
    if (learningPathCourses.length < 2) {
        showToast('Add at least 2 courses to create a learning path', 'error');
        return;
    }

    const saveBtn = document.getElementById('save-path-btn');
    const originalText = saveBtn.innerHTML;

    try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        // Update prerequisites for each course in the path
        for (let i = 0; i < learningPathCourses.length; i++) {
            const course = learningPathCourses[i];
            const prerequisites = i === 0 ? [] : [learningPathCourses[i - 1].slug];

            const { error } = await supabase
                .from('courses')
                .update({
                    prerequisites: prerequisites,
                    updated_at: new Date().toISOString()
                })
                .eq('id', course.id);

            if (error) throw error;
        }

        showToast(`Learning path saved! ${learningPathCourses.length} courses updated.`, 'success');

        // Clear the path and reload
        learningPathCourses = [];
        await loadCoursesForPaths();
        await loadExistingPaths();
        renderLearningPathSequence();

        document.getElementById('clear-path-btn').disabled = true;
        document.getElementById('save-path-btn').disabled = true;

    } catch (error) {
        console.error('Error saving learning path:', error);
        showToast('Failed to save learning path: ' + error.message, 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    }
}

// Load and display existing paths
async function loadExistingPaths() {
    try {
        const { data: courses, error } = await supabase
            .from('courses')
            .select('id, slug, title, category, difficulty, prerequisites')
            .order('title', { ascending: true });

        if (error) throw error;

        // Find courses that are prerequisites for others
        const paths = extractLearningPaths(courses || []);
        renderExistingPaths(paths);

    } catch (error) {
        console.error('Error loading existing paths:', error);
        document.getElementById('existing-paths-list').innerHTML =
            '<div class="error-message"><i class="fas fa-exclamation-circle"></i>Error loading paths</div>';
    }
}

// Extract learning paths from courses
function extractLearningPaths(courses) {
    const paths = [];
    const processedCourses = new Set();

    courses.forEach(course => {
        if (processedCourses.has(course.id)) return;
        if (!course.prerequisites || course.prerequisites.length === 0) return;

        // Build the path chain
        const path = [course];
        processedCourses.add(course.id);

        // Trace back prerequisites
        let currentPrereq = course.prerequisites[0];
        while (currentPrereq) {
            const prereqCourse = courses.find(c => c.slug === currentPrereq);
            if (!prereqCourse) break;

            path.unshift(prereqCourse);
            processedCourses.add(prereqCourse.id);
            currentPrereq = prereqCourse.prerequisites && prereqCourse.prerequisites[0];
        }

        if (path.length > 1) {
            paths.push(path);
        }
    });

    return paths;
}

// Render existing paths
function renderExistingPaths(paths) {
    const container = document.getElementById('existing-paths-list');
    const deleteAllBtn = document.getElementById('delete-all-paths-btn');

    if (paths.length === 0) {
        container.innerHTML = `
            <div class="empty-message" style="text-align: center; padding: 60px 20px; color: #9ca3af;">
                <i class="fas fa-route" style="font-size: 64px; color: #d1d5db; margin-bottom: 16px;"></i>
                <p style="font-size: 18px; font-weight: 600; color: #6b7280; margin-bottom: 8px;">No learning paths created yet</p>
                <p style="font-size: 14px; margin: 0;">Create your first learning path using the builder above</p>
            </div>
        `;
        if (deleteAllBtn) deleteAllBtn.style.display = 'none';
        return;
    }

    // Show delete all button
    if (deleteAllBtn) deleteAllBtn.style.display = 'flex';

    const categoryColors = {
        'AI': '#8b5cf6',
        'Cloud': '#3b82f6',
        'Cybersecurity': '#ef4444',
        'Data': '#10b981'
    };

    const categoryIcons = {
        'AI': 'fa-brain',
        'Cloud': 'fa-cloud',
        'Cybersecurity': 'fa-shield-halved',
        'Data': 'fa-database'
    };

    container.innerHTML = paths.map((path, pathIndex) => {
        const category = path[0].category;
        const color = categoryColors[category] || '#6b7280';
        const icon = categoryIcons[category] || 'fa-book';

        return `
        <div class="existing-path-card" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 20px; transition: all 0.2s;">
            <div class="existing-path-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 48px; height: 48px; border-radius: 12px; background: ${color}15; display: flex; align-items: center; justify-content: center;">
                        <i class="fas ${icon}" style="font-size: 24px; color: ${color};"></i>
                    </div>
                    <div>
                        <h5 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 700; color: #111827;">
                            ${category} Learning Journey
                        </h5>
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">
                            <i class="fas fa-layer-group" style="margin-right: 4px;"></i>
                            ${path.length} courses • Path ${pathIndex + 1}
                        </p>
                    </div>
                </div>
                <button class="btn-danger btn-sm" onclick="deleteLearningPath([${path.map(c => `'${c.id}'`).join(',')}])"
                        style="opacity: 0.8;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>

            <div class="existing-path-sequence" style="display: flex; flex-direction: column; gap: 12px;">
                ${path.map((course, index) => `
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="flex-shrink: 0; width: 32px; height: 32px; border-radius: 8px; background: ${color}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">
                            ${index + 1}
                        </div>
                        <div style="flex: 1; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">
                                    ${escapeHtml(course.title)}
                                </div>
                                <div style="font-size: 12px; color: #6b7280;">
                                    <span style="display: inline-flex; align-items: center; gap: 4px; background: white; padding: 2px 8px; border-radius: 4px; border: 1px solid #e5e7eb;">
                                        <i class="fas fa-signal" style="font-size: 10px;"></i>
                                        ${course.difficulty}
                                    </span>
                                </div>
                            </div>
                            ${index === 0 ? '<span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;"><i class="fas fa-flag"></i> Start Here</span>' : ''}
                            ${index === path.length - 1 ? '<span style="background: #dcfce7; color: #15803d; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;"><i class="fas fa-trophy"></i> Final</span>' : ''}
                        </div>
                    </div>
                    ${index < path.length - 1 ? `
                        <div style="margin-left: 16px; padding-left: 16px; border-left: 2px dashed ${color}; height: 16px; display: flex; align-items: center;">
                            <i class="fas fa-arrow-down" style="color: ${color}; font-size: 16px; margin-left: -9px;"></i>
                        </div>
                    ` : ''}
                `).join('')}
            </div>
        </div>
    `}).join('');
}

// Delete learning path
async function deleteLearningPath(courseIds) {
    if (!confirm('Delete this learning path? This will remove all prerequisites from these courses.')) return;

    try {
        for (const courseId of courseIds) {
            const { error } = await supabase
                .from('courses')
                .update({
                    prerequisites: [],
                    updated_at: new Date().toISOString()
                })
                .eq('id', courseId);

            if (error) throw error;
        }

        showToast('Learning path deleted', 'success');
        await loadCoursesForPaths();
        await loadExistingPaths();

    } catch (error) {
        console.error('Error deleting path:', error);
        showToast('Failed to delete path: ' + error.message, 'error');
    }
}

// Delete all learning paths
async function deleteAllLearningPaths() {
    const confirmed = confirm(
        '⚠️ WARNING: This will delete ALL learning paths and remove all course prerequisites.\n\n' +
        'This action cannot be undone. Are you sure you want to continue?'
    );

    if (!confirmed) return;

    const doubleConfirm = confirm(
        'Please confirm one more time:\n\n' +
        'Delete ALL learning paths permanently?'
    );

    if (!doubleConfirm) return;

    const deleteBtn = document.getElementById('delete-all-paths-btn');
    const originalText = deleteBtn.innerHTML;

    try {
        deleteBtn.disabled = true;
        deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';

        // Get all courses with prerequisites
        const { data: courses, error: fetchError } = await supabase
            .from('courses')
            .select('id, prerequisites')
            .not('prerequisites', 'is', null);

        if (fetchError) throw fetchError;

        // Clear prerequisites from all courses
        const updates = courses
            .filter(c => c.prerequisites && c.prerequisites.length > 0)
            .map(course =>
                supabase
                    .from('courses')
                    .update({
                        prerequisites: [],
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', course.id)
            );

        await Promise.all(updates);

        showToast(`Successfully deleted all learning paths (${updates.length} courses updated)`, 'success');
        await loadCoursesForPaths();
        await loadExistingPaths();

    } catch (error) {
        console.error('Error deleting all paths:', error);
        showToast('Failed to delete all paths: ' + error.message, 'error');
    } finally {
        deleteBtn.disabled = false;
        deleteBtn.innerHTML = originalText;
    }
}

// Setup event listeners for path builder
function setupPathBuilderListeners() {
    // Delete all paths button
    const deleteAllBtn = document.getElementById('delete-all-paths-btn');
    if (deleteAllBtn) {
        deleteAllBtn.addEventListener('click', deleteAllLearningPaths);
    }

    // Category filter
    const categoryFilter = document.getElementById('path-category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            renderAvailableCourses(allCoursesForPaths, e.target.value);
        });
    }

    // Clear button
    const clearBtn = document.getElementById('clear-path-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearLearningPath);
    }

    // Save button
    const saveBtn = document.getElementById('save-path-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveLearningPath);
    }
}

// Make functions global for onclick handlers
window.addCourseToPath = addCourseToPath;
window.removeCourseFromPath = removeCourseFromPath;
window.moveCourseUp = moveCourseUp;
window.moveCourseDown = moveCourseDown;
window.deleteLearningPath = deleteLearningPath;

// ============================================
// Badge Management System
// ============================================

let allBadges = [];

// Initialize badges when gamification section is loaded
async function initializeGamification() {
    await loadBadges();
    await initializeRanks();
    setupBadgeEventListeners();
}

// Load all badges
async function loadBadges() {
    try {
        const { data: badges, error } = await supabase
            .from('badges')
            .select('*')
            .order('created_at', { ascending: false});

        if (error) throw error;

        allBadges = badges || [];
        renderBadges();

    } catch (error) {
        console.error('Error loading badges:', error);
        showToast('Failed to load badges', 'error');
    }
}

// Render badges grid
function renderBadges() {
    const tbody = document.getElementById('badges-table-body');
    if (!tbody) return;

    if (allBadges.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px;">
                    <i class="fas fa-trophy" style="font-size: 48px; color: #d1d5db; display: block; margin-bottom: 12px;"></i>
                    <p style="color: #6b7280; margin: 0;">No badges created yet</p>
                </td>
            </tr>
        `;
        return;
    }

    const rarityColors = {
        common: '#6b7280',
        rare: '#3b82f6',
        epic: '#8b5cf6',
        legendary: '#fbbf24'
    };

    tbody.innerHTML = allBadges.map(badge => {
        const rarityColor = rarityColors[badge.rarity] || '#6b7280';
        const iconDisplay = badge.icon_url ?
            `<img src="${badge.icon_url}" alt="${badge.name}" style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover;" onerror="console.error('Failed to load badge icon:', '${badge.icon_url}'); this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div style="width: 48px; height: 48px; border-radius: 8px; background: ${badge.color || '#6b7280'}15; display: none; align-items: center; justify-content: center;">
                 <i class="fas fa-exclamation-triangle" style="color: #ef4444; font-size: 20px;" title="Image failed to load"></i>
             </div>` :
            `<div style="width: 48px; height: 48px; border-radius: 8px; background: ${badge.color}15; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-trophy" style="color: ${badge.color}; font-size: 24px;"></i>
            </div>`;

        return `
            <tr>
                <td>${iconDisplay}</td>
                <td style="font-weight: 600;">${badge.name}</td>
                <td style="max-width: 250px;">${badge.description}</td>
                <td style="font-size: 13px; color: #6b7280;">${getCriteriaDescription(badge)}</td>
                <td>
                    <span style="display: inline-flex; align-items: center; gap: 4px; background: ${rarityColor}15; color: ${rarityColor}; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase;">
                        ${badge.rarity}
                    </span>
                </td>
                <td style="font-weight: 600; color: #f59e0b;">${badge.xp_reward || 0}</td>
                <td>
                    <span style="color: ${badge.is_active ? '#10b981' : '#6b7280'}; font-weight: 600;">
                        ${badge.is_active ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <div style="display: flex; gap: 4px;">
                        <button onclick="editBadge('${badge.id}')" class="btn-sm btn-secondary" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteBadge('${badge.id}')" class="btn-sm btn-danger" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Get human-readable criteria description
function getCriteriaDescription(badge) {
    const criteria = badge.criteria || {};

    switch (criteria.type) {
        case 'course_complete':
            return 'Complete course: ' + (criteria.course_name || 'Any course');
        case 'courses_count':
            return 'Complete ' + criteria.count + ' courses';
        case 'lessons_count':
            return 'Complete ' + criteria.lessons_count + ' lessons';
        case 'practice_exercises_count':
            return 'Complete ' + criteria.exercises_count + ' practice exercises';
        case 'xp_threshold':
            return 'Reach ' + criteria.xp_amount + ' total XP';
        case 'streak_days':
            return 'Maintain ' + criteria.days + ' day learning streak';
        case 'category_master':
            return 'Complete all courses in ' + criteria.category;
        case 'course_speed':
            return 'Complete any course within ' + criteria.speed_days + ' days';
        case 'early_user':
            return 'Be among the first ' + criteria.user_number + ' users';
        case 'community_engagement':
            return 'Get ' + criteria.upvotes + ' upvotes (future feature)';
        case 'perfect_score':
            return 'Get 100% on any assessment';
        case 'first_enrollment':
            return 'Enroll in first course';
        default:
            return 'Custom criteria';
    }
}

// Open badge modal (create or edit)
function openBadgeModal(badge) {
    badge = badge || null;
    const modal = document.getElementById('badge-modal');
    const title = document.getElementById('badge-modal-title');

    if (badge) {
        title.textContent = 'Edit Badge';
        document.getElementById('badge-id').value = badge.id;
        document.getElementById('badge-name').value = badge.name;
        document.getElementById('badge-icon-url').value = badge.icon_url || '';
        document.getElementById('badge-description').value = badge.description;
        document.getElementById('badge-color').value = badge.color;
        document.getElementById('badge-xp').value = badge.xp_reward || 0;
        document.getElementById('badge-rarity').value = badge.rarity;
        document.getElementById('badge-active').checked = badge.is_active;

        // Show icon preview if available
        const preview = document.getElementById('badge-icon-preview');
        if (badge.icon_url) {
            preview.src = badge.icon_url;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }

        const criteria = badge.criteria || {};
        document.getElementById('badge-criteria-type').value = criteria.type || '';
        updateCriteriaFields(criteria);
    } else {
        title.textContent = 'Create Badge';
        document.getElementById('badge-form').reset();
        document.getElementById('badge-id').value = '';
        document.getElementById('badge-icon-url').value = '';
        document.getElementById('badge-icon-preview').style.display = 'none';
        document.getElementById('criteria-fields').innerHTML = '';
        document.getElementById('criteria-fields').style.display = 'none';
    }

    modal.classList.add('active');
    lockBodyScroll();
}

function closeBadgeModal() {
    const modal = document.getElementById('badge-modal');
    modal.classList.remove('active');
    unlockBodyScroll();
}

// Update criteria fields based on selected type
function updateCriteriaFields(existingCriteria) {
    existingCriteria = existingCriteria || {};
    const type = document.getElementById('badge-criteria-type').value;
    const container = document.getElementById('criteria-fields');

    if (!type) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }

    container.style.display = 'block';

    let html = '';

    switch (type) {
        case 'course_complete':
            html = `
                <div class="form-group">
                    <label class="form-label">Course</label>
                    <select id="criteria-course-id" class="form-input">
                        <option value="">Any course</option>
                    </select>
                    <small>Leave blank for any course completion</small>
                </div>
            `;
            break;
        case 'courses_count':
            html = `
                <div class="form-group">
                    <label class="form-label">Number of Courses <span class="required">*</span></label>
                    <input type="number" id="criteria-count" class="form-input" min="1" value="${existingCriteria.count || 1}" required>
                </div>
            `;
            break;
        case 'lessons_count':
            html = `
                <div class="form-group">
                    <label class="form-label">Number of Lessons <span class="required">*</span></label>
                    <input type="number" id="criteria-lessons-count" class="form-input" min="1" value="${existingCriteria.lessons_count || 10}" required>
                </div>
            `;
            break;
        case 'practice_exercises_count':
            html = `
                <div class="form-group">
                    <label class="form-label">Number of Practice Exercises <span class="required">*</span></label>
                    <input type="number" id="criteria-exercises-count" class="form-input" min="1" value="${existingCriteria.exercises_count || 10}" required>
                </div>
            `;
            break;
        case 'xp_threshold':
            html = `
                <div class="form-group">
                    <label class="form-label">XP Amount <span class="required">*</span></label>
                    <input type="number" id="criteria-xp-amount" class="form-input" min="1" value="${existingCriteria.xp_amount || 100}" required>
                </div>
            `;
            break;
        case 'streak_days':
            html = `
                <div class="form-group">
                    <label class="form-label">Number of Days <span class="required">*</span></label>
                    <input type="number" id="criteria-days" class="form-input" min="1" value="${existingCriteria.days || 7}" required>
                </div>
            `;
            break;
        case 'category_master':
            html = `
                <div class="form-group">
                    <label class="form-label">Category <span class="required">*</span></label>
                    <select id="criteria-category" class="form-input" required>
                        <option value="AI">AI</option>
                        <option value="Cloud">Cloud</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="Data">Data</option>
                    </select>
                </div>
            `;
            break;
        case 'course_speed':
            html = `
                <div class="form-group">
                    <label class="form-label">Complete Course Within (Days) <span class="required">*</span></label>
                    <input type="number" id="criteria-speed-days" class="form-input" min="1" value="${existingCriteria.speed_days || 14}" required>
                    <small>Award badge for completing any course within this timeframe</small>
                </div>
            `;
            break;
        case 'early_user':
            html = `
                <div class="form-group">
                    <label class="form-label">User Number Threshold <span class="required">*</span></label>
                    <input type="number" id="criteria-user-number" class="form-input" min="1" value="${existingCriteria.user_number || 100}" required>
                    <small>Award badge to first X users who register</small>
                </div>
            `;
            break;
        case 'community_engagement':
            html = `
                <div class="form-group">
                    <label class="form-label">Minimum Upvotes <span class="required">*</span></label>
                    <input type="number" id="criteria-upvotes" class="form-input" min="1" value="${existingCriteria.upvotes || 10}" required>
                    <small>🚧 Future feature - not yet implemented</small>
                </div>
            `;
            break;
    }

    container.innerHTML = html;

    // Set existing values if editing
    if (existingCriteria.course_id) {
        const courseSelect = document.getElementById('criteria-course-id');
        if (courseSelect) courseSelect.value = existingCriteria.course_id;
    }
    if (existingCriteria.category) {
        const categorySelect = document.getElementById('criteria-category');
        if (categorySelect) categorySelect.value = existingCriteria.category;
    }
}

// Handle badge form submission
async function handleBadgeSubmit(event) {
    event.preventDefault();

    const badgeId = document.getElementById('badge-id').value;
    const name = document.getElementById('badge-name').value.trim();
    const iconUrl = document.getElementById('badge-icon-url').value.trim();
    const description = document.getElementById('badge-description').value.trim();
    const color = document.getElementById('badge-color').value;
    const xpReward = parseInt(document.getElementById('badge-xp').value) || 0;
    const rarity = document.getElementById('badge-rarity').value;
    const isActive = document.getElementById('badge-active').checked;
    const criteriaType = document.getElementById('badge-criteria-type').value;

    // Build criteria object
    const criteria = { type: criteriaType };

    switch (criteriaType) {
        case 'course_complete':
            const courseId = document.getElementById('criteria-course-id')?.value;
            if (courseId) criteria.course_id = courseId;
            break;
        case 'courses_count':
            criteria.count = parseInt(document.getElementById('criteria-count').value);
            break;
        case 'lessons_count':
            criteria.lessons_count = parseInt(document.getElementById('criteria-lessons-count').value);
            break;
        case 'practice_exercises_count':
            criteria.exercises_count = parseInt(document.getElementById('criteria-exercises-count').value);
            break;
        case 'xp_threshold':
            criteria.xp_amount = parseInt(document.getElementById('criteria-xp-amount').value);
            break;
        case 'streak_days':
            criteria.days = parseInt(document.getElementById('criteria-days').value);
            break;
        case 'category_master':
            criteria.category = document.getElementById('criteria-category').value;
            break;
        case 'course_speed':
            criteria.speed_days = parseInt(document.getElementById('criteria-speed-days').value);
            break;
        case 'early_user':
            criteria.user_number = parseInt(document.getElementById('criteria-user-number').value);
            break;
        case 'community_engagement':
            criteria.upvotes = parseInt(document.getElementById('criteria-upvotes').value);
            break;
    }

    const badgeData = {
        name,
        icon_url: iconUrl,
        description,
        color,
        xp_reward: xpReward,
        rarity,
        is_active: isActive,
        criteria,
        updated_at: new Date().toISOString()
    };

    try {
        if (badgeId) {
            // Update existing badge
            const { error } = await supabase
                .from('badges')
                .update(badgeData)
                .eq('id', badgeId);

            if (error) throw error;
            showToast('Badge updated successfully', 'success');
        } else {
            // Create new badge
            badgeData.created_at = new Date().toISOString();
            const { error } = await supabase
                .from('badges')
                .insert([badgeData]);

            if (error) throw error;
            showToast('Badge created successfully', 'success');
        }

        closeBadgeModal();
        await loadBadges();

    } catch (error) {
        console.error('Error saving badge:', error);
        showToast('Failed to save badge: ' + error.message, 'error');
    }
}

// Edit badge
function editBadge(badgeId) {
    const badge = allBadges.find(b => b.id === badgeId);
    if (badge) {
        openBadgeModal(badge);
    }
}

// Delete badge
async function deleteBadge(badgeId) {
    if (!confirm('Delete this badge? Users who earned it will lose it.')) return;

    try {
        const { error } = await supabase
            .from('badges')
            .delete()
            .eq('id', badgeId);

        if (error) throw error;

        showToast('Badge deleted successfully', 'success');
        await loadBadges();

    } catch (error) {
        console.error('Error deleting badge:', error);
        showToast('Failed to delete badge: ' + error.message, 'error');
    }
}

// Setup event listeners
function setupBadgeEventListeners() {
    const createBtn = document.getElementById('create-badge-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => openBadgeModal());
    }

    // Badge icon upload functionality
    const badgeIconUploadBtn = document.getElementById('badge-icon-upload-btn');
    const badgeIconFile = document.getElementById('badge-icon-file');
    const badgeIconUrl = document.getElementById('badge-icon-url');
    const badgeIconPreview = document.getElementById('badge-icon-preview');

    if (badgeIconUploadBtn) {
        badgeIconUploadBtn.addEventListener('click', () => {
            badgeIconFile?.click();
        });
    }

    if (badgeIconFile) {
        badgeIconFile.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                showToast('Please select an image file', 'error');
                return;
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                showToast('File too large. Please choose an image under 5MB', 'error');
                return;
            }

            try {
                badgeIconUploadBtn.disabled = true;
                badgeIconUploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

                // Create unique filename
                const fileExt = file.name.split('.').pop();
                const fileName = `badge-icon-${Date.now()}.${fileExt}`;

                // Upload to Supabase Storage
                const { data, error } = await supabase.storage
                    .from('badge-icons')
                    .upload(fileName, file);

                if (error) {
                    console.error('Upload error:', error);
                    throw error;
                }

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('badge-icons')
                    .getPublicUrl(fileName);

                console.log('📸 Badge icon uploaded successfully!');
                console.log('📄 File name:', fileName);
                console.log('🔗 Public URL:', publicUrl);
                console.log('🧪 Testing URL access...');
                
                // Test if the URL is accessible
                const testImg = new Image();
                testImg.onload = () => {
                    console.log('✅ Badge icon URL is accessible');
                };
                testImg.onerror = () => {
                    console.error('❌ Badge icon URL is NOT accessible - check storage bucket permissions');
                    console.error('💡 Make sure the badge-icons bucket is public in Supabase Dashboard');
                };
                testImg.src = publicUrl;

                // Update the input field and preview
                badgeIconUrl.value = publicUrl;
                badgeIconPreview.src = publicUrl;
                badgeIconPreview.style.display = 'block';

                showToast('Badge icon uploaded successfully', 'success');

            } catch (error) {
                console.error('Error uploading badge icon:', error);
                showToast('Failed to upload badge icon: ' + error.message, 'error');
            } finally {
                badgeIconUploadBtn.disabled = false;
                badgeIconUploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Icon';
            }
        });
    }

    // Badge icon URL input change handler for preview
    if (badgeIconUrl && badgeIconPreview) {
        badgeIconUrl.addEventListener('input', (e) => {
            const url = e.target.value.trim();
            if (url) {
                badgeIconPreview.src = url;
                badgeIconPreview.style.display = 'block';
                badgeIconPreview.onerror = () => {
                    badgeIconPreview.style.display = 'none';
                };
            } else {
                badgeIconPreview.style.display = 'none';
            }
        });
    }
}

// Make functions global
window.openBadgeModal = openBadgeModal;
window.closeBadgeModal = closeBadgeModal;
window.updateCriteriaFields = updateCriteriaFields;
window.handleBadgeSubmit = handleBadgeSubmit;
window.editBadge = editBadge;
window.deleteBadge = deleteBadge;

// ============================================
// Rank Management System
// ============================================

let allRanks = [];

// Initialize ranks when gamification section is loaded
async function initializeRanks() {
    await loadRanks();
    setupRankEventListeners();
}

// Load all ranks
async function loadRanks() {
    try {
        const { data: ranks, error } = await supabase
            .from('ranks')
            .select('*')
            .order('rank_order', { ascending: true });

        if (error) throw error;

        allRanks = ranks || [];
        renderRanks();

    } catch (error) {
        console.error('Error loading ranks:', error);
        showToast('Failed to load ranks', 'error');
    }
}

// Render ranks table
function renderRanks() {
    const tbody = document.getElementById('ranks-table-body');
    if (!tbody) return;

    if (allRanks.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    <i class="fas fa-crown" style="font-size: 48px; color: #d1d5db; display: block; margin-bottom: 12px;"></i>
                    <p style="color: #6b7280; margin: 0;">No ranks created yet</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = allRanks.map(rank => {
        const xpRange = rank.max_xp ? 
            `${rank.min_xp.toLocaleString()} - ${rank.max_xp.toLocaleString()}` : 
            `${rank.min_xp.toLocaleString()}+`;

        const iconDisplay = `
            <div style="display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 8px; background: ${rank.icon_color}15;">
                <i class="${rank.icon}" style="color: ${rank.icon_color}; font-size: 24px;"></i>
            </div>
        `;

        return `
            <tr>
                <td>${iconDisplay}</td>
                <td style="font-weight: 600;">${rank.name}</td>
                <td style="max-width: 250px;">${rank.description || ''}</td>
                <td style="font-weight: 600; color: #059669;">${xpRange}</td>
                <td>
                    <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-weight: 600; color: #374151;">
                        ${rank.rank_order}
                    </span>
                </td>
                <td>
                    <span style="color: ${rank.is_active ? '#10b981' : '#6b7280'}; font-weight: 600;">
                        ${rank.is_active ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <div style="display: flex; gap: 4px;">
                        <button onclick="editRank('${rank.id}')" class="btn-sm btn-secondary" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteRank('${rank.id}')" class="btn-sm btn-danger" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Open rank modal (create or edit)
function openRankModal(rank) {
    rank = rank || null;
    const modal = document.getElementById('rank-modal');
    const title = document.getElementById('rank-modal-title');
    const submitText = document.getElementById('rank-submit-text');

    if (rank) {
        title.textContent = 'Edit Rank';
        submitText.textContent = 'Update Rank';
        document.getElementById('rank-id').value = rank.id;
        document.getElementById('rank-name').value = rank.name;
        document.getElementById('rank-description').value = rank.description || '';
        document.getElementById('rank-icon').value = rank.icon;
        document.getElementById('rank-icon-color').value = rank.icon_color;
        document.getElementById('rank-min-xp').value = rank.min_xp;
        document.getElementById('rank-max-xp').value = rank.max_xp || '';
        document.getElementById('rank-order').value = rank.rank_order;
        document.getElementById('rank-active').checked = rank.is_active;
    } else {
        title.textContent = 'Create Rank';
        submitText.textContent = 'Create Rank';
        document.getElementById('rank-form').reset();
        document.getElementById('rank-id').value = '';
        document.getElementById('rank-icon').value = 'fas fa-star';
        document.getElementById('rank-icon-color').value = '#f59e0b';
        document.getElementById('rank-active').checked = true;
        
        // Suggest next rank order
        const nextOrder = allRanks.length > 0 ? Math.max(...allRanks.map(r => r.rank_order)) + 1 : 1;
        document.getElementById('rank-order').value = nextOrder;
    }

    modal.classList.add('active');
    lockBodyScroll();
}

function closeRankModal() {
    const modal = document.getElementById('rank-modal');
    modal.classList.remove('active');
    unlockBodyScroll();
}

// Handle rank form submission
async function handleRankSubmit(event) {
    event.preventDefault();

    const rankId = document.getElementById('rank-id').value;
    const name = document.getElementById('rank-name').value.trim();
    const description = document.getElementById('rank-description').value.trim();
    const icon = document.getElementById('rank-icon').value.trim();
    const iconColor = document.getElementById('rank-icon-color').value;
    const minXp = parseInt(document.getElementById('rank-min-xp').value);
    const maxXp = document.getElementById('rank-max-xp').value.trim();
    const rankOrder = parseInt(document.getElementById('rank-order').value);
    const isActive = document.getElementById('rank-active').checked;

    const rankData = {
        name,
        description: description || null,
        icon,
        icon_color: iconColor,
        min_xp: minXp,
        max_xp: maxXp ? parseInt(maxXp) : null,
        rank_order: rankOrder,
        is_active: isActive,
        updated_at: new Date().toISOString()
    };

    try {
        if (rankId) {
            // Update existing rank
            const { error } = await supabase
                .from('ranks')
                .update(rankData)
                .eq('id', rankId);

            if (error) throw error;
            showToast('Rank updated successfully', 'success');
        } else {
            // Create new rank
            rankData.created_at = new Date().toISOString();
            const { error } = await supabase
                .from('ranks')
                .insert([rankData]);

            if (error) throw error;
            showToast('Rank created successfully', 'success');
        }

        closeRankModal();
        await loadRanks();

        // Update all user ranks after rank changes
        await updateAllUserRanks();

    } catch (error) {
        console.error('Error saving rank:', error);
        showToast('Failed to save rank: ' + error.message, 'error');
    }
}

// Edit rank
function editRank(rankId) {
    const rank = allRanks.find(r => r.id === rankId);
    if (rank) {
        openRankModal(rank);
    }
}

// Delete rank
async function deleteRank(rankId) {
    const rank = allRanks.find(r => r.id === rankId);
    if (!rank) return;
    
    if (!confirm(`Delete the "${rank.name}" rank? Users with this rank will need to be reassigned.`)) return;

    try {
        const { error } = await supabase
            .from('ranks')
            .delete()
            .eq('id', rankId);

        if (error) throw error;

        showToast('Rank deleted successfully', 'success');
        await loadRanks();

        // Update all user ranks after deletion
        await updateAllUserRanks();

    } catch (error) {
        console.error('Error deleting rank:', error);
        showToast('Failed to delete rank: ' + error.message, 'error');
    }
}

// Update all user ranks (call this after rank changes)
async function updateAllUserRanks() {
    try {
        const { error } = await supabase.rpc('update_all_user_ranks');
        if (error) throw error;
        console.log('Updated all user ranks');
    } catch (error) {
        console.error('Error updating user ranks:', error);
    }
}

// Setup event listeners
function setupRankEventListeners() {
    const createBtn = document.getElementById('create-rank-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => openRankModal());
    }
}

// Make functions global
window.openRankModal = openRankModal;
window.closeRankModal = closeRankModal;
window.handleRankSubmit = handleRankSubmit;
window.editRank = editRank;
window.deleteRank = deleteRank;
