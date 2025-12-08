// ============================================
// Profile Page - Database Integration
// Dynamically loads user profile data from Supabase
// ============================================

// Use the supabase client from script.js (already initialized)
// SUPABASE_URL and SUPABASE_ANON_KEY are declared in script.js

let currentUser = null;
let userProfile = null;

// ============================================
// Initialize Page
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadUserProfile();
    await loadUserStats();
    await loadUserCourses();
    await loadPinnedCertifications();
});

// ============================================
// Load User Profile
// ============================================

async function loadUserProfile() {
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
        updateProfileHero(profile);
        updateBioSection(profile);
        updateSkillsSection(profile); // Load skills dynamically

    } catch (error) {
        console.error('Unexpected error loading user profile:', error);
    }
}

// ============================================
// Update Skills Section
// ============================================

function updateSkillsSection(profile) {
    const skillsList = document.getElementById('profileSkillsList');
    if (!skillsList) return;
    
    // Clear existing skills
    skillsList.innerHTML = '';
    
    // Check if profile has skills
    if (profile.skills && Array.isArray(profile.skills) && profile.skills.length > 0) {
        profile.skills.forEach(skillName => {
            const chip = document.createElement('span');
            chip.className = 'profile-skills-card__chip';
            chip.setAttribute('role', 'listitem');
            chip.textContent = skillName;
            skillsList.appendChild(chip);
        });
    } else {
        // Show a placeholder message if no skills
        const placeholder = document.createElement('span');
        placeholder.className = 'profile-skills-card__chip profile-skills-card__chip--empty';
        placeholder.textContent = 'No skills added yet';
        placeholder.style.opacity = '0.6';
        placeholder.style.fontStyle = 'italic';
        skillsList.appendChild(placeholder);
    }
}

// ============================================
// Update Profile Hero Section
// ============================================

function updateProfileHero(profile) {
    // Update avatar
    const avatarImg = document.querySelector('.profile-hero__avatar-image');
    if (avatarImg && profile.avatar_url) {
        avatarImg.src = profile.avatar_url;
        avatarImg.alt = `${profile.username} avatar`;
    }

    // Update name
    const nameEl = document.querySelector('.profile-hero__name');
    if (nameEl) {
        nameEl.textContent = profile.full_name || profile.username;
    }

    // Update handle
    const handleEl = document.querySelector('.profile-hero__handle');
    if (handleEl) {
        handleEl.textContent = `@${profile.username}`;
    }

    // Note: followers/following will be implemented later if we add social features
    // For now, we'll hide or show as 0
    const followersEl = document.querySelector('.profile-hero__stat');
    if (followersEl) {
        followersEl.textContent = '0 followers';
    }

    const followingStats = document.querySelectorAll('.profile-hero__stat');
    if (followingStats[1]) {
        followingStats[1].textContent = '0 following';
    }
}

// ============================================
// Update Bio Section
// ============================================

function updateBioSection(profile) {
    // Calculate level from total XP
    const level = Math.floor(Math.sqrt(profile.total_xp / 100)) || 1;
    const rank = getRankFromLevel(level);

    // Update badge level
    const badgeLabel = document.querySelector('.profile-bio-card__badge-label');
    if (badgeLabel) {
        badgeLabel.textContent = rank;
    }

    const badgeLevel = document.querySelector('.profile-bio-card__badge-level');
    if (badgeLevel) {
        badgeLevel.textContent = `level ${level}`;
    }

    // Update bio text
    const bioText = document.querySelector('.profile-bio-card__copy');
    if (bioText) {
        bioText.textContent = profile.bio || 'No bio yet. Add one from your profile settings.';
    }
}

// ============================================
// Load User Stats
// ============================================

async function loadUserStats() {
    try {
        if (!currentUser) return;

        // Get practice exercises completed count
        const { count: exerciseCount, error: exerciseError } = await supabase
            .from('practice_attempts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', currentUser.id)
            .eq('passed', true);

        if (exerciseError) console.error('Error loading exercise count:', exerciseError);

        // Get badges count
        const { count: badgeCount, error: badgeError } = await supabase
            .from('user_badges')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', currentUser.id);

        if (badgeError) console.error('Error loading badge count:', badgeError);

        // Update status cards
        const statusCards = document.querySelectorAll('.profile-status-card');

        if (statusCards[0]) {
            // Exercises
            const exercisesValue = statusCards[0].querySelector('.profile-status-card__value');
            if (exercisesValue) {
                exercisesValue.textContent = exerciseCount || 0;
            }
        }

        if (statusCards[1]) {
            // Total XP
            const xpValue = statusCards[1].querySelector('.profile-status-card__value');
            if (xpValue) {
                xpValue.textContent = formatNumber(userProfile?.total_xp || 0);
            }
        }

        if (statusCards[2]) {
            // Course Badges
            const badgesValue = statusCards[2].querySelector('.profile-status-card__value');
            if (badgesValue) {
                badgesValue.textContent = badgeCount || 0;
            }
        }

        if (statusCards[3]) {
            // Daily Streak
            const streakValue = statusCards[3].querySelector('.profile-status-card__value');
            if (streakValue) {
                streakValue.textContent = userProfile?.current_streak || 0;
            }
        }

    } catch (error) {
        console.error('Unexpected error loading user stats:', error);
    }
}

// ============================================
// Load User Courses
// ============================================

async function loadUserCourses() {
    try {
        if (!currentUser) return;

        const { data: enrollments, error } = await supabase
            .from('enrollments')
            .select(`
                id,
                progress_percentage,
                status,
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
            .limit(6);

        if (error) {
            console.error('Error loading enrollments:', error);
            return;
        }

        if (enrollments && enrollments.length > 0) {
            const coursesGrid = document.querySelector('.profile-courses__grid');
            if (!coursesGrid) return;

            coursesGrid.innerHTML = enrollments.map(enrollment => {
                const course = enrollment.courses;
                if (!course) return '';

                return `
                    <article class="profile-course-card" aria-label="${course.title} course">
                        <div class="profile-course-card__background" style="background-image: url('${course.thumbnail_url || ''}');"></div>
                        <div class="profile-course-card__content">
                            <span class="profile-course-card__eyebrow">Course - ${enrollment.progress_percentage}% complete</span>
                            <h3 class="profile-course-card__title">${course.title}</h3>
                            <a href="learning.html?course=${course.slug}" class="profile-course-card__cta cta-pill" role="button">Continue</a>
                        </div>
                    </article>
                `;
            }).join('');
        } else {
            // No enrolled courses
            const coursesGrid = document.querySelector('.profile-courses__grid');
            if (coursesGrid) {
                coursesGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
                        <p style="font-size: 16px; margin-bottom: 16px;">You haven't enrolled in any courses yet.</p>
                        <a href="learn.html" class="cta-pill" style="display: inline-block;">Browse Courses</a>
                    </div>
                `;
            }
        }

    } catch (error) {
        console.error('Unexpected error loading courses:', error);
    }
}

// ============================================
// Helper Functions
// ============================================

function getRankFromLevel(level) {
    if (level >= 100) return 'Mythical';
    if (level >= 75) return 'Legendary';
    if (level >= 50) return 'Epic';
    if (level >= 25) return 'Rare';
    if (level >= 10) return 'Uncommon';
    return 'Common';
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// ============================================
// Load Pinned Certifications
// ============================================

async function loadPinnedCertifications() {
    try {
        if (!currentUser) return;

        const { data: pinnedCerts, error } = await supabase
            .from('user_certifications')
            .select(`
                id,
                status,
                is_pinned,
                certifications (
                    id,
                    title,
                    slug,
                    icon_url,
                    badge_url
                )
            `)
            .eq('user_id', currentUser.id)
            .eq('is_pinned', true)
            .limit(2);

        if (error) {
            console.error('Error loading pinned certifications:', error);
            return;
        }

        const pinnedContainer = document.querySelector('.profile-pinned__cards');
        if (!pinnedContainer) return;

        if (pinnedCerts && pinnedCerts.length > 0) {
            pinnedContainer.innerHTML = pinnedCerts.map(userCert => {
                const cert = userCert.certifications;
                if (!cert) return '';

                return `
                    <article class="profile-pinned-card" aria-label="${cert.title}">
                        <div class="profile-pinned-card__media">
                            <img src="${cert.icon_url || cert.badge_url || 'images/profile/default-cert.png'}"
                                 alt="${cert.title}"
                                 class="profile-pinned-card__image" />
                            <span class="profile-pinned-card__tag">Certification</span>
                        </div>
                        <div class="profile-pinned-card__content">
                            <h3 class="profile-pinned-card__title">${cert.title}</h3>
                            <a class="profile-pinned-card__cta cta-pill"
                               href="cert-guide.html?cert=${cert.slug}"
                               role="button">View Certification</a>
                        </div>
                    </article>
                `;
            }).join('');
        } else {
            // No pinned certifications
            pinnedContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
                    <p style="font-size: 16px; margin-bottom: 16px;">No pinned certifications yet.</p>
                    <a href="certification.html" class="cta-pill" style="display: inline-block;">Browse Certifications</a>
                </div>
            `;
        }

    } catch (error) {
        console.error('Unexpected error loading pinned certifications:', error);
    }
}
