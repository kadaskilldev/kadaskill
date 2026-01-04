// ============================================
// Home Page - Database Integration
// Dynamically loads user data from Supabase
// ============================================

// Use the supabase client from script.js (already initialized)
// SUPABASE_URL and SUPABASE_ANON_KEY are declared in script.js

let currentUser = null;
let userProfile = null;

// ============================================
// Initialize Page
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadUserData();
    await loadEnrolledCourses();
    await loadPracticeExercises();
    await loadCertificationCallouts();
    await loadUserBadges();
    await loadLeaderboard();
});

// ============================================
// Load User Data
// ============================================

async function loadUserData() {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.log('No user logged in, redirecting to login');
            window.location.href = 'index.html';
            return;
        }

        currentUser = user;

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('Error loading profile:', profileError);
            return;
        }

        userProfile = profile;
        updateProfileUI(profile);

    } catch (error) {
        console.error('Unexpected error loading user data:', error);
    }
}

// ============================================
// Update Profile UI
// ============================================

function updateProfileUI(profile) {
    // Update welcome message
    const welcomeName = document.querySelector('.text-wrapper-37');
    if (welcomeName) {
        welcomeName.textContent = profile.full_name || profile.username || 'Learner!';
    }

    // Update sidebar profile
    const sidebarUsername = document.querySelector('.profile-content .text-wrapper');
    if (sidebarUsername) {
        sidebarUsername.textContent = `@${profile.username}`;
    }

    // Update avatar
    const avatarImages = document.querySelectorAll('.profile-icon');
    avatarImages.forEach(img => {
        if (profile.avatar_url) {
            img.src = profile.avatar_url;
        }
    });

    // Update level (calculated as floor(sqrt(total_xp / 100)))
    const level = Math.floor(Math.sqrt(profile.total_xp / 100)) || 1;
    const levelElement = document.querySelector('.text-wrapper-2');
    if (levelElement) {
        levelElement.textContent = `Level ${level}`;
    }

    // Update total XP
    const xpElement = document.querySelector('.text-wrapper-3');
    if (xpElement) {
        xpElement.textContent = formatNumber(profile.total_xp || 0);
    }

    // Update streak
    const streakElement = document.querySelector('.text-wrapper-9');
    if (streakElement) {
        streakElement.textContent = profile.current_streak || 0;
    }

    // Update rank (based on level)
    const rank = getRankFromLevel(level);
    const rankElement = document.querySelector('.text-wrapper-5');
    if (rankElement) {
        rankElement.textContent = rank;
    }
}

// ============================================
// Load Enrolled Courses
// ============================================

async function loadEnrolledCourses() {
    try {
        if (!currentUser) return;

        const { data: enrollments, error } = await supabase
            .from('enrollments')
            .select(`
                id,
                progress_percentage,
                last_accessed_at,
                courses (
                    id,
                    title,
                    slug,
                    thumbnail_url
                )
            `)
            .eq('user_id', currentUser.id)
            .eq('status', 'active')
            .order('last_accessed_at', { ascending: false })
            .limit(2);

        if (error) {
            console.error('Error loading enrollments:', error);
            return;
        }

        const courseCard = document.querySelector('.learning-card-course');
        const trackCard = document.querySelector('.learning-card-track');

        if (enrollments && enrollments.length > 0) {
            // Update current course card
            const currentCourse = enrollments[0];
            const courseTitle = document.querySelector('.learning-card-course .learning-card-title');
            if (courseTitle && currentCourse.courses) {
                courseTitle.textContent = currentCourse.courses.title;
            }
            // Remove loading state
            if (courseCard) courseCard.classList.remove('learning-card-loading');

            // Update continue button to redirect to actual course
            const continueBtn = document.querySelector('.learning-action-continue');
            if (continueBtn && currentCourse.courses) {
                continueBtn.onclick = () => {
                    window.location.href = `learning.html?course=${currentCourse.courses.slug}`;
                };
            }

            // Update enrolled track (second course or certification)
            if (enrollments.length > 1) {
                const trackCourse = enrollments[1];
                const trackTitle = document.querySelector('.learning-card-track .learning-card-title');
                if (trackTitle && trackCourse.courses) {
                    trackTitle.textContent = trackCourse.courses.title;
                }

                const trackLink = document.querySelector('.learning-card-link');
                if (trackLink && trackCourse.courses) {
                    trackLink.href = `learning.html?course=${trackCourse.courses.slug}`;
                }
                // Remove loading state
                if (trackCard) trackCard.classList.remove('learning-card-loading');
            } else {
                // No second course - show placeholder
                const trackTitle = document.querySelector('.learning-card-track .learning-card-title');
                if (trackTitle) trackTitle.textContent = 'No track enrolled';
                if (trackCard) trackCard.classList.remove('learning-card-loading');
            }
        } else {
            // No enrolled courses - show message
            const courseTitle = document.querySelector('.learning-card-course .learning-card-title');
            if (courseTitle) {
                courseTitle.textContent = 'No courses yet';
            }
            if (courseCard) courseCard.classList.remove('learning-card-loading');

            // Also update track card
            const trackTitle = document.querySelector('.learning-card-track .learning-card-title');
            if (trackTitle) trackTitle.textContent = 'No track enrolled';
            if (trackCard) trackCard.classList.remove('learning-card-loading');

            const continueBtn = document.querySelector('.learning-action-continue');
            if (continueBtn) {
                continueBtn.textContent = 'Browse Courses';
                continueBtn.onclick = () => {
                    window.location.href = 'learn.html';
                };
            }
        }

    } catch (error) {
        console.error('Unexpected error loading courses:', error);
    }
}

// ============================================
// Load Practice Exercises (Recent)
// ============================================

async function loadPracticeExercises() {
    const practiceGrid = document.querySelector('.practice-review-grid');
    
    try {
        const { data: exercises, error } = await supabase
            .from('practice_exercises')
            .select('id, slug, title, xp_reward')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(3);

        if (error) {
            console.error('Error loading practice exercises:', error);
            showNoPracticesMessage(practiceGrid, 'Failed to load practices');
            return;
        }

        if (!exercises || exercises.length === 0) {
            showNoPracticesMessage(practiceGrid, 'No practices available');
            return;
        }

        // Clear loading skeletons and render real cards
        practiceGrid.innerHTML = exercises.map(exercise => `
            <article class="practice-card" style="cursor: pointer;" data-exercise-id="${exercise.id}">
                <div class="practice-card-body">
                    <span class="practice-card-label">Practice</span>
                    <h3 class="practice-card-title">${exercise.title}</h3>
                </div>
                <div class="practice-card-meta">
                    <span class="practice-card-xp">${exercise.xp_reward || 0} XP</span>
                    <span class="practice-card-chevron" aria-hidden="true"></span>
                </div>
            </article>
        `).join('');

        // Add click handlers
        practiceGrid.querySelectorAll('.practice-card').forEach((card, index) => {
            card.onclick = () => {
                const exercise = exercises[index];
                const targetUrl = exercise.id
                    ? `practice-session.html?id=${exercise.id}`
                    : `practice-session.html?slug=${encodeURIComponent(exercise.slug)}`;
                window.location.href = targetUrl;
            };
        });

    } catch (error) {
        console.error('Unexpected error loading practice exercises:', error);
        showNoPracticesMessage(practiceGrid, 'An error occurred');
    }
}

function showNoPracticesMessage(container, message) {
    if (container) {
        container.innerHTML = `
            <div class="no-practices-message">
                <i class="fas fa-dumbbell"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

// ============================================
// Load Certification Callouts (Featured)
// ============================================

async function loadCertificationCallouts() {
    const certContainer = document.querySelector('.certification-callouts');
    
    try {
        const { data: certifications, error } = await supabase
            .from('certifications')
            .select('id, slug, title, description, badge_url, icon_url')
            .eq('is_active', true)
            .order('updated_at', { ascending: false })
            .limit(2);

        if (error) {
            console.error('Error loading certifications:', error);
            showNoCertificationsMessage(certContainer, 'Failed to load certifications');
            return;
        }

        if (!certifications || certifications.length === 0) {
            showNoCertificationsMessage(certContainer, 'No certifications available');
            return;
        }

        // Clear loading skeletons and render real cards
        certContainer.innerHTML = certifications.map(cert => {
            // Use icon_url from database (same as certification.html), fallback to badge_url, then placeholder
            const imageUrl = cert.icon_url || cert.badge_url || 'images/certifications/placeholder.png';
            return `
                <article class="certification-callout">
                    <div class="certification-callout__media">
                        <img src="${imageUrl}" alt="${cert.title} badge" class="certification-callout__image" onerror="this.src='images/certifications/placeholder.png'; this.onerror=null;">
                    </div>
                    <div class="certification-callout__content">
                        <h3 class="certification-callout__title">${cert.title}</h3>
                        <p class="certification-callout__description">${cert.description || ''}</p>
                        <a href="cert-guide.html?cert=${cert.slug}" class="certification-callout__cta">
                            <span>Get Started</span>
                        </a>
                    </div>
                </article>
            `;
        }).join('');

    } catch (error) {
        console.error('Unexpected error loading certifications:', error);
        showNoCertificationsMessage(certContainer, 'An error occurred');
    }
}

function showNoCertificationsMessage(container, message) {
    if (container) {
        container.innerHTML = `
            <div class="no-certifications-message">
                <i class="fas fa-certificate"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

// ============================================
// Load User Badges
// ============================================

async function loadUserBadges() {
    try {
        if (!currentUser) return;

        const { data: userBadges, error } = await supabase
            .from('user_badges')
            .select(`
                earned_at,
                badges (
                    id,
                    name,
                    icon_url,
                    tier
                )
            `)
            .eq('user_id', currentUser.id)
            .order('earned_at', { ascending: false })
            .limit(6);

        if (error) {
            console.error('Error loading badges:', error);
            return;
        }

        // Update badge count in sidebar
        const badgeCountEl = document.querySelector('.text-wrapper-7');
        if (badgeCountEl) {
            badgeCountEl.textContent = userBadges?.length || 0;
        }

        // Update badge images
        if (userBadges && userBadges.length > 0) {
            const badgeItems = document.querySelectorAll('.badge-item');

            userBadges.forEach((userBadge, index) => {
                if (badgeItems[index] && userBadge.badges) {
                    const badgeImg = badgeItems[index].querySelector('.badge-icon');
                    if (badgeImg && userBadge.badges.icon_url) {
                        badgeImg.src = userBadge.badges.icon_url;
                        badgeImg.alt = userBadge.badges.name;
                    }
                }
            });

            // Show first badge in profile section
            const profileBadge = document.querySelector('.untitled-design');
            if (profileBadge && userBadges[0]?.badges?.icon_url) {
                profileBadge.src = userBadges[0].badges.icon_url;
                profileBadge.alt = userBadges[0].badges.name;
            }
        }

    } catch (error) {
        console.error('Unexpected error loading badges:', error);
    }
}

// ============================================
// Load Leaderboard
// ============================================

async function loadLeaderboard() {
    try {
        const { data: leaderboard, error } = await supabase
            .from('leaderboard')
            .select('*')
            .order('rank', { ascending: true })
            .limit(10);

        if (error) {
            console.error('Error loading leaderboard:', error);
            return;
        }

        if (leaderboard && leaderboard.length > 0) {
            const leaderboardList = document.querySelector('.leaderboard-card__list');
            if (!leaderboardList) return;

            leaderboardList.innerHTML = leaderboard.map((entry, index) => {
                const isCurrentUser = currentUser && entry.user_id === currentUser.id;
                const entryClass = isCurrentUser ? 'leaderboard-entry current-user' : 'leaderboard-entry';

                return `
                    <li class="${entryClass}">
                        <div class="leaderboard-entry__profile">
                            <img class="leaderboard-entry__avatar"
                                 src="${entry.avatar_url || 'images/profile/default-avatar.svg'}"
                                 alt="${entry.username} avatar" />
                            <span class="leaderboard-entry__name">@${entry.username}</span>
                        </div>
                        <span class="leaderboard-entry__score">${formatNumber(entry.total_xp)}</span>
                    </li>
                `;
            }).join('');
        }

    } catch (error) {
        console.error('Unexpected error loading leaderboard:', error);
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

function getRankFromLevel(level) {
    if (level >= 100) return 'Mythical';
    if (level >= 75) return 'Legendary';
    if (level >= 50) return 'Epic';
    if (level >= 25) return 'Rare';
    if (level >= 10) return 'Uncommon';
    return 'Common';
}
