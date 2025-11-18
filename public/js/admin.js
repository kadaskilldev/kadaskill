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
});

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

    // Content tabs
    const contentTabs = document.querySelectorAll('.content-tab[data-content-tab]');
    contentTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.contentTab;
            switchContentTab(tabName);
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
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeEditUserModal);
    }
}

// ============================================
// Section Switching
// ============================================

function switchSection(sectionName) {
    // Update nav items
    const navItems = document.querySelectorAll('.admin-nav-item[data-section]');
    navItems.forEach(item => {
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

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
        'content': 'Content Management',
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
    } else if (sectionName === 'content') {
        loadCourses();
        loadCertifications();
        loadExercises();
    }
}

// ============================================
// Content Tab Switching
// ============================================

function switchContentTab(tabName) {
    // Update tab buttons
    const tabs = document.querySelectorAll('.content-tab');
    tabs.forEach(tab => {
        if (tab.dataset.contentTab === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Update tab panels
    const panels = document.querySelectorAll('.content-tab-panel');
    panels.forEach(panel => {
        panel.classList.remove('active');
    });

    const activePanel = document.getElementById(`${tabName}-tab`);
    if (activePanel) {
        activePanel.classList.add('active');
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
        const { data: recentEnrollments, error } = await supabase
            .from('enrollments')
            .select(`
                id,
                created_at,
                profiles (username, full_name),
                courses (title)
            `)
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) {
            console.error('Error loading recent activity:', error);
            return;
        }

        const activityContainer = document.getElementById('recent-activity');
        if (!activityContainer) return;

        if (recentEnrollments && recentEnrollments.length > 0) {
            activityContainer.innerHTML = recentEnrollments.map(enrollment => {
                const username = enrollment.profiles?.full_name || enrollment.profiles?.username || 'Unknown User';
                const courseTitle = enrollment.courses?.title || 'Unknown Course';
                const timeAgo = getTimeAgo(new Date(enrollment.created_at));

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
            activityContainer.innerHTML = '<p style="text-align: center; color: #666;">No recent activity</p>';
        }

    } catch (error) {
        console.error('Error loading recent activity:', error);
    }
}

// ============================================
// Load Engagement Chart
// ============================================

async function loadEngagementChart() {
    try {
        // Get last 7 days of enrollment data
        const days = [];
        const enrollmentCounts = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const { count } = await supabase
                .from('enrollments')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', date.toISOString())
                .lt('created_at', nextDate.toISOString());

            days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            enrollmentCounts.push(count || 0);
        }

        const ctx = document.getElementById('engagement-chart');
        if (!ctx) return;

        if (engagementChart) {
            engagementChart.destroy();
        }

        engagementChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Daily Active Users',
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

    } catch (error) {
        console.error('Error loading engagement chart:', error);
    }
}

// ============================================
// Load Category Chart
// ============================================

async function loadCategoryChart() {
    try {
        const { data: enrollments, error } = await supabase
            .from('enrollments')
            .select(`
                id,
                courses (category)
            `);

        if (error) {
            console.error('Error loading category data:', error);
            return;
        }

        const categoryCounts = {};
        enrollments?.forEach(enrollment => {
            const category = enrollment.courses?.category || 'Other';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        const categories = Object.keys(categoryCounts);
        const counts = Object.values(categoryCounts);

        const colors = [
            '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899'
        ];

        const ctx = document.getElementById('category-chart');
        if (!ctx) return;

        if (categoryChart) {
            categoryChart.destroy();
        }

        categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
                datasets: [{
                    data: counts,
                    backgroundColor: colors.slice(0, categories.length),
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
// Load Course Performance
// ============================================

async function loadCoursePerformance() {
    try {
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
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error loading course performance:', error);
            return;
        }

        const tableBody = document.getElementById('course-performance-body');
        if (!tableBody) return;

        if (courses && courses.length > 0) {
            tableBody.innerHTML = courses.map(course => {
                const enrollments = course.enrollments || [];
                const enrollmentCount = enrollments.length;
                const avgProgress = enrollmentCount > 0
                    ? (enrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / enrollmentCount).toFixed(1)
                    : 0;
                const completedCount = enrollments.filter(e => e.status === 'completed').length;
                const completionRate = enrollmentCount > 0
                    ? ((completedCount / enrollmentCount) * 100).toFixed(1)
                    : 0;

                return `
                    <tr>
                        <td>${course.title}</td>
                        <td>${enrollmentCount}</td>
                        <td>${avgProgress}%</td>
                        <td>
                            <span style="color: ${completionRate >= 50 ? '#10b981' : completionRate >= 25 ? '#f59e0b' : '#ef4444'}; font-weight: 600;">
                                ${completionRate}%
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
            tableBody.innerHTML = '<tr><td colspan="5" class="loading-cell">No course data available</td></tr>';
        }

    } catch (error) {
        console.error('Error loading course performance:', error);
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
        const { data: courses, error } = await supabase
            .from('courses')
            .select('id, title, category, level, is_published, lessons (count)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading courses:', error);
            return;
        }

        renderCoursesTable(courses);

    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

function renderCoursesTable(courses) {
    const tableBody = document.getElementById('courses-table-body');
    if (!tableBody) return;

    if (courses && courses.length > 0) {
        tableBody.innerHTML = courses.map(course => {
            const lessonCount = course.lessons?.length || 0;
            return `
                <tr>
                    <td>${course.title}</td>
                    <td><span style="text-transform: capitalize;">${course.category || 'N/A'}</span></td>
                    <td><span style="text-transform: capitalize;">${course.level || 'N/A'}</span></td>
                    <td>${lessonCount}</td>
                    <td><span style="color: ${course.is_published ? '#10b981' : '#ef4444'}; font-weight: 600;">${course.is_published ? 'Yes' : 'No'}</span></td>
                    <td>
                        <button class="btn-edit" onclick="editCourse('${course.id}')">Edit</button>
                        <button class="btn-delete" onclick="deleteCourse('${course.id}')">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    } else {
        tableBody.innerHTML = '<tr><td colspan="6" class="loading-cell">No courses found</td></tr>';
    }
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

        renderCertificationsTable(certifications);

    } catch (error) {
        console.error('Error loading certifications:', error);
    }
}

function renderCertificationsTable(certifications) {
    const tableBody = document.getElementById('certifications-table-body');
    if (!tableBody) return;

    if (certifications && certifications.length > 0) {
        tableBody.innerHTML = certifications.map(cert => `
            <tr>
                <td>${cert.title}</td>
                <td>${cert.provider || 'N/A'}</td>
                <td><span style="text-transform: capitalize;">${cert.category || 'N/A'}</span></td>
                <td><span style="text-transform: capitalize;">${cert.level || 'N/A'}</span></td>
                <td><span style="color: ${cert.is_active ? '#10b981' : '#ef4444'}; font-weight: 600;">${cert.is_active ? 'Yes' : 'No'}</span></td>
                <td>
                    <button class="btn-edit" onclick="editCertification('${cert.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteCertification('${cert.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } else {
        tableBody.innerHTML = '<tr><td colspan="6" class="loading-cell">No certifications found</td></tr>';
    }
}

// ============================================
// Load Practice Exercises
// ============================================

async function loadExercises() {
    try {
        const { data: exercises, error } = await supabase
            .from('practice_exercises')
            .select('id, title, category, difficulty, questions, is_published')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading exercises:', error);
            return;
        }

        renderExercisesTable(exercises);

    } catch (error) {
        console.error('Error loading exercises:', error);
    }
}

function renderExercisesTable(exercises) {
    const tableBody = document.getElementById('exercises-table-body');
    if (!tableBody) return;

    if (exercises && exercises.length > 0) {
        tableBody.innerHTML = exercises.map(exercise => {
            const questionCount = exercise.questions?.length || 0;
            return `
                <tr>
                    <td>${exercise.title}</td>
                    <td><span style="text-transform: capitalize;">${exercise.category || 'N/A'}</span></td>
                    <td><span style="text-transform: capitalize;">${exercise.difficulty || 'N/A'}</span></td>
                    <td>${questionCount}</td>
                    <td><span style="color: ${exercise.is_published ? '#10b981' : '#ef4444'}; font-weight: 600;">${exercise.is_published ? 'Yes' : 'No'}</span></td>
                    <td>
                        <button class="btn-edit" onclick="editExercise('${exercise.id}')">Edit</button>
                        <button class="btn-delete" onclick="deleteExercise('${exercise.id}')">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    } else {
        tableBody.innerHTML = '<tr><td colspan="6" class="loading-cell">No exercises found</td></tr>';
    }
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
        if (modal) modal.classList.add('active');

    } catch (error) {
        console.error('Error opening edit modal:', error);
        alert('Failed to open edit modal');
    }
}

function closeEditUserModal() {
    const modal = document.getElementById('edit-user-modal');
    if (modal) modal.classList.remove('active');

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

function editCourse(courseId) {
    alert(`Edit course functionality coming soon! Course ID: ${courseId}`);
    // TODO: Implement course editing modal/form
}

function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
        alert(`Delete course functionality coming soon! Course ID: ${courseId}`);
        // TODO: Implement course deletion
    }
}

function editCertification(certId) {
    alert(`Edit certification functionality coming soon! Certification ID: ${certId}`);
    // TODO: Implement certification editing modal/form
}

function deleteCertification(certId) {
    if (confirm('Are you sure you want to delete this certification? This action cannot be undone.')) {
        alert(`Delete certification functionality coming soon! Certification ID: ${certId}`);
        // TODO: Implement certification deletion
    }
}

function editExercise(exerciseId) {
    alert(`Edit exercise functionality coming soon! Exercise ID: ${exerciseId}`);
    // TODO: Implement exercise editing modal/form
}

function deleteExercise(exerciseId) {
    if (confirm('Are you sure you want to delete this exercise? This action cannot be undone.')) {
        alert(`Delete exercise functionality coming soon! Exercise ID: ${exerciseId}`);
        // TODO: Implement exercise deletion
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

// Make functions global for onclick handlers
window.editCourse = editCourse;
window.deleteCourse = deleteCourse;
window.editCertification = editCertification;
window.deleteCertification = deleteCertification;
window.editExercise = editExercise;
window.deleteExercise = deleteExercise;
