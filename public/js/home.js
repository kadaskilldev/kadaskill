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
    await trackDailyLogin(); // Track login and update streak
    setupWeekNavigation(); // Setup week navigation buttons
    await loadWeeklyProgress(); // Update weekly progress tracker UI
    await loadEnrolledCourses();
    await loadPracticeExercises();
    await loadCertificationCallouts();
    // await loadUserBadges(); // TEMPORARILY COMMENTED OUT
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

        // Load profile and badge count in parallel
        const [profileResult, badgeCountResult] = await Promise.all([
            supabase
                .from('profiles')
                .select(`
                    *,
                    rank:ranks(
                        id,
                        name,
                        icon,
                        icon_color,
                        min_xp,
                        max_xp,
                        rank_order
                    )
                `)
                .eq('id', user.id)
                .single(),
            supabase
                .from('user_badges')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', user.id)
        ]);

        if (profileResult.error) {
            console.error('Error loading profile:', profileResult.error);
            return;
        }

        // Add badge count to profile object
        const profile = profileResult.data;
        profile.badge_count = badgeCountResult.count || 0;

        userProfile = profile;
        updateProfileUI(user, profile);

    } catch (error) {
        console.error('Unexpected error loading user data:', error);
    }
}

// ============================================
// Get Google Avatar from Auth User
// ============================================

function getProviderAvatarUrl(user) {
    if (!user || !user.app_metadata || user.app_metadata.provider !== 'google') {
        return null;
    }
    const metadata = user.user_metadata || {};
    if (typeof metadata.avatar_url === 'string' && metadata.avatar_url) {
        return metadata.avatar_url;
    }
    if (typeof metadata.picture === 'string' && metadata.picture) {
        return metadata.picture;
    }
    const identities = Array.isArray(user.identities) ? user.identities : [];
    for (let i = 0; i < identities.length; i++) {
        const identity = identities[i];
        if (identity && identity.provider === 'google' && identity.identity_data) {
            const data = identity.identity_data;
            if (typeof data.avatar_url === 'string' && data.avatar_url) {
                return data.avatar_url;
            }
            if (typeof data.picture === 'string' && data.picture) {
                return data.picture;
            }
        }
    }
    return null;
}

// ============================================
// Update Profile UI
// ============================================

function updateProfileUI(user, profile) {
    // Update welcome message
    const welcomeName = document.querySelector('.text-wrapper-37');
    if (welcomeName) {
        welcomeName.textContent = profile.full_name || profile.username || 'Learner!';
    }

    // Update sidebar profile username
    const sidebarUsername = document.getElementById('profile-username');
    if (sidebarUsername) {
        sidebarUsername.textContent = `@${profile.username}`;
        sidebarUsername.classList.remove('skeleton-text');
    }

    // Update avatar - use profile.avatar_url first, fallback to Google provider avatar
    const avatarSkeleton = document.getElementById('profile-avatar-skeleton');
    const avatarImg = document.getElementById('profile-avatar');
    if (avatarImg && avatarSkeleton) {
        const providerAvatarUrl = getProviderAvatarUrl(user);
        const avatarUrl = profile.avatar_url || providerAvatarUrl || 'images/profile/default-avatar.svg';
        avatarImg.src = avatarUrl;
        avatarImg.style.display = '';
        avatarSkeleton.style.display = 'none';
    }

    // Update level (calculated as floor(sqrt(total_xp / 100)))
    const level = Math.floor(Math.sqrt(profile.total_xp / 100)) || 1;
    const levelElement = document.getElementById('profile-level');
    if (levelElement) {
        levelElement.textContent = `Level ${level}`;
        levelElement.classList.remove('skeleton-text');
    }

    // Update total XP
    const xpElement = document.getElementById('profile-xp');
    if (xpElement) {
        xpElement.textContent = formatNumber(profile.total_xp || 0);
        xpElement.classList.remove('skeleton-text');
    }

    // Update streak
    const streakElement = document.getElementById('profile-streak');
    if (streakElement) {
        streakElement.textContent = profile.current_streak || 0;
        streakElement.classList.remove('skeleton-text');
    }

    // Update rank display with new rank system
    const rankElement = document.getElementById('profile-rank');
    const rankIconElement = document.getElementById('profile-rank-icon');
    const rankIconSkeleton = document.getElementById('profile-rank-icon-skeleton');
    
    if (profile.rank) {
        // Update rank name
        if (rankElement) {
            rankElement.textContent = profile.rank.name;
            rankElement.classList.remove('skeleton-text');
        }
        
        // Update rank icon with Font Awesome icon
        if (rankIconElement && rankIconSkeleton) {
            // Hide the image element and show icon instead
            rankIconElement.style.display = 'none';
            rankIconSkeleton.style.display = 'none';
            
            // Create or update rank icon container
            let rankIconContainer = document.getElementById('rank-icon-container');
            if (!rankIconContainer) {
                rankIconContainer = document.createElement('div');
                rankIconContainer.id = 'rank-icon-container';
                rankIconContainer.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: ${profile.rank.icon_color}15;
                    margin-right: 8px;
                `;
                rankIconElement.parentNode.insertBefore(rankIconContainer, rankIconElement);
            }
            
            rankIconContainer.innerHTML = `
                <i class="${profile.rank.icon}" style="color: ${profile.rank.icon_color}; font-size: 16px;"></i>
            `;
        }
    } else {
        // No rank assigned yet
        if (rankElement) {
            rankElement.textContent = 'Unranked';
            rankElement.classList.remove('skeleton-text');
        }
        
        if (rankIconElement && rankIconSkeleton) {
            rankIconElement.style.display = 'none';
            rankIconSkeleton.style.display = 'none';
            
            let rankIconContainer = document.getElementById('rank-icon-container');
            if (!rankIconContainer) {
                rankIconContainer = document.createElement('div');
                rankIconContainer.id = 'rank-icon-container';
                rankIconContainer.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #f3f4f6;
                    margin-right: 8px;
                `;
                rankIconElement.parentNode.insertBefore(rankIconContainer, rankIconElement);
            }
            
            rankIconContainer.innerHTML = `
                <i class="fas fa-question" style="color: #6b7280; font-size: 16px;"></i>
            `;
        }
    }

    // Update badges count
    const badgesElement = document.getElementById('profile-badges');
    if (badgesElement) {
        badgesElement.textContent = profile.badge_count || 0;
        badgesElement.classList.remove('skeleton-text');
    }
}

// ============================================
// Philippine Time Utility
// ============================================

function getPhilippineDate() {
    // Get current date in Philippine Time (UTC+8)
    const now = new Date();
    const philippineOffset = 8 * 60; // UTC+8 in minutes
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const philippineTime = new Date(utcTime + (philippineOffset * 60000));
    return philippineTime;
}

function formatDateString(date) {
    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getYesterdayPHT() {
    const pht = getPhilippineDate();
    pht.setDate(pht.getDate() - 1);
    return formatDateString(pht);
}

// ============================================
// Track Daily Login & Update Streak
// ============================================

async function trackDailyLogin() {
    if (!currentUser) return;

    try {
        const todayPHT = formatDateString(getPhilippineDate());
        
        // Check if already logged in today
        const { data: existingLogin, error: checkError } = await supabase
            .from('daily_activities')
            .select('id')
            .eq('user_id', currentUser.id)
            .eq('activity_date', todayPHT)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            // PGRST116 = no rows found, which is expected for first login
            console.error('Error checking daily login:', checkError);
            return;
        }

        if (existingLogin) {
            // Already logged in today, no need to update streak
            console.log('Already logged in today:', todayPHT);
            return;
        }

        // Insert today's login record
        const { error: insertError } = await supabase
            .from('daily_activities')
            .insert({
                user_id: currentUser.id,
                activity_date: todayPHT,
                activities_completed: 1, // Login counts as an activity
                xp_earned: 0,
                lessons_completed: 0,
                exercises_completed: 0
            });

        if (insertError) {
            console.error('Error inserting daily login:', insertError);
            return;
        }

        console.log('Daily login recorded for:', todayPHT);

        // Now update streak
        await updateStreak(todayPHT);

    } catch (error) {
        console.error('Unexpected error in trackDailyLogin:', error);
    }
}

async function updateStreak(todayPHT) {
    if (!currentUser || !userProfile) return;

    try {
        const yesterdayPHT = getYesterdayPHT();
        const lastVisitDate = userProfile.last_visit_date;
        let currentStreak = userProfile.current_streak || 0;
        let longestStreak = userProfile.longest_streak || 0;
        let newStreak;

        // Debug logging
        console.log('Streak Debug:', {
            todayPHT,
            yesterdayPHT,
            lastVisitDate,
            lastVisitDateType: typeof lastVisitDate,
            currentStreak,
            comparison: lastVisitDate === yesterdayPHT
        });

        if (lastVisitDate === todayPHT) {
            // Already visited today - no change needed
            console.log('Streak already counted for today');
            return;
        } else if (lastVisitDate === yesterdayPHT) {
            // Consecutive day - increment streak
            newStreak = currentStreak + 1;
            console.log(`Streak incremented: ${currentStreak} → ${newStreak}`);
        } else {
            // Missed a day (or first visit ever) - reset to 1
            newStreak = 1;
            console.log(`Streak reset to 1 (last visit: ${lastVisitDate || 'never'})`);
        }

        // Update longest streak if needed
        if (newStreak > longestStreak) {
            longestStreak = newStreak;
        }

        // Update profile in database
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                current_streak: newStreak,
                longest_streak: longestStreak,
                last_visit_date: todayPHT,
                last_activity_date: todayPHT
            })
            .eq('id', currentUser.id);

        if (updateError) {
            console.error('Error updating streak:', updateError);
            return;
        }

        // Update local profile reference
        userProfile.current_streak = newStreak;
        userProfile.longest_streak = longestStreak;
        userProfile.last_visit_date = todayPHT;

        // Update streak UI
        const streakElement = document.querySelector('.text-wrapper-9');
        if (streakElement) {
            streakElement.textContent = newStreak;
        }

        // Also update profile status card if exists
        const profileStreakCard = document.querySelector('.profile-status-card[aria-label="Daily streak"] .profile-status-card__value');
        if (profileStreakCard) {
            profileStreakCard.textContent = newStreak;
        }

    } catch (error) {
        console.error('Unexpected error in updateStreak:', error);
    }
}

// ============================================
// Weekly Progress Tracker with Navigation
// ============================================

let currentWeekOffset = 0; // 0 = current week, -1 = last week, etc.

async function loadWeeklyProgress(weekOffset = 0) {
    if (!currentUser) return;

    currentWeekOffset = weekOffset;

    try {
        const pht = getPhilippineDate();
        const todayDayIndex = pht.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        
        // Calculate the week based on offset
        const referenceDate = new Date(pht);
        referenceDate.setDate(referenceDate.getDate() + (weekOffset * 7));
        
        // Calculate start of that week (Sunday)
        const weekStart = new Date(referenceDate);
        weekStart.setDate(referenceDate.getDate() - referenceDate.getDay());
        
        // Calculate end of that week (Saturday)
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const weekStartStr = formatDateString(weekStart);
        const weekEndStr = formatDateString(weekEnd);

        // Query daily_activities for this week
        const { data: activities, error } = await supabase
            .from('daily_activities')
            .select('activity_date')
            .eq('user_id', currentUser.id)
            .gte('activity_date', weekStartStr)
            .lte('activity_date', weekEndStr);

        // Debug logging
        console.log('Weekly Progress Debug:', {
            weekOffset,
            todayDayIndex,
            weekStartStr,
            weekEndStr,
            activities,
            error
        });

        if (error) {
            console.error('Error loading weekly progress:', error);
            return;
        }

        // Create a set of active day indices for quick lookup
        const activeDays = new Set();
        if (activities) {
            activities.forEach(activity => {
                const activityDate = new Date(activity.activity_date + 'T00:00:00');
                const dayIndex = activityDate.getDay();
                console.log('Activity date parsed:', activity.activity_date, '→ dayIndex:', dayIndex);
                activeDays.add(dayIndex);
            });
        }

        console.log('Active days this week:', [...activeDays]);

        // Determine which day is "today" for this week view
        // If viewing current week, use actual today; if past week, all days are "past"
        const effectiveTodayIndex = weekOffset === 0 ? todayDayIndex : 7; // 7 means all days are past

        // Update the UI
        updateWeeklyProgressUI(activeDays, effectiveTodayIndex);
        updateWeekLabel(weekStart, weekEnd, weekOffset);
        updateWeekNavButtons(weekOffset);

    } catch (error) {
        console.error('Unexpected error in loadWeeklyProgress:', error);
    }
}

function updateWeeklyProgressUI(activeDays, todayDayIndex) {
    const tracker = document.getElementById('weekly-progress-tracker');
    if (!tracker) return;

    const dayItems = tracker.querySelectorAll('.day-item');
    
    dayItems.forEach(item => {
        const dayIndex = parseInt(item.getAttribute('data-day-index'), 10);
        const circle = item.querySelector('.day-circle');
        
        if (!circle) return;

        // Remove loading and skeleton classes
        item.classList.remove('day-loading');
        circle.classList.remove('skeleton-circle', 'ellipse-8', 'ellipse-9', 'ellipse-10');

        if (activeDays.has(dayIndex)) {
            // User was active on this day - orange gradient
            circle.classList.add('ellipse-9');
        } else if (dayIndex > todayDayIndex) {
            // Future day (not yet reached) - white
            circle.classList.add('ellipse-8');
        } else {
            // Past day that was skipped (not logged in) - dark/black
            circle.classList.add('ellipse-10');
        }

        // Mark current day (only for current week)
        if (dayIndex === todayDayIndex && currentWeekOffset === 0) {
            item.setAttribute('aria-current', 'true');
        } else {
            item.removeAttribute('aria-current');
        }
    });
}

function updateWeekLabel(weekStart, weekEnd, weekOffset) {
    const weekLabel = document.getElementById('week-label');
    if (!weekLabel) return;

    const options = { month: 'short', day: 'numeric' };
    const startStr = weekStart.toLocaleDateString('en-US', options);
    const endStr = weekEnd.toLocaleDateString('en-US', options);
    const year = weekEnd.getFullYear();

    if (weekOffset === 0) {
        weekLabel.textContent = `This Week (${startStr} - ${endStr}, ${year})`;
    } else if (weekOffset === -1) {
        weekLabel.textContent = `Last Week (${startStr} - ${endStr}, ${year})`;
    } else {
        weekLabel.textContent = `${startStr} - ${endStr}, ${year}`;
    }
}

function updateWeekNavButtons(weekOffset) {
    const prevBtn = document.getElementById('week-nav-prev');
    const nextBtn = document.getElementById('week-nav-next');

    // Allow going back up to 12 weeks
    if (prevBtn) {
        prevBtn.disabled = weekOffset <= -12;
    }

    // Can only go forward if not on current week
    if (nextBtn) {
        nextBtn.disabled = weekOffset >= 0;
    }
}

function setupWeekNavigation() {
    const prevBtn = document.getElementById('week-nav-prev');
    const nextBtn = document.getElementById('week-nav-next');
    const daysContainer = document.querySelector('.weekly-tracker-container .days');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (daysContainer && !daysContainer.classList.contains('animating')) {
                daysContainer.classList.add('animating', 'slide-left');
                setTimeout(() => {
                    loadWeeklyProgress(currentWeekOffset - 1);
                    daysContainer.classList.remove('slide-left', 'animating');
                }, 300);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentWeekOffset < 0 && daysContainer && !daysContainer.classList.contains('animating')) {
                daysContainer.classList.add('animating', 'slide-right');
                setTimeout(() => {
                    loadWeeklyProgress(currentWeekOffset + 1);
                    daysContainer.classList.remove('slide-right', 'animating');
                }, 300);
            }
        });
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
// NOTE: This function is currently disabled.
// Badge section is commented out in home.html (lines 169-183)
// Function call is commented out in DOMContentLoaded (line 24)

async function loadUserBadges() {
    // DISABLED - Badge section is temporarily commented out
    return;

    try {
        if (!currentUser) return;

        // Get all active badges
        const { data: allBadges, error: badgesError } = await supabase
            .from('badges')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: true })
            .limit(6);

        if (badgesError) {
            console.error('Error loading badges:', badgesError);
            return;
        }

        // Get user's earned badges
        const { data: userBadges, error: userBadgesError } = await supabase
            .from('user_badges')
            .select('badge_id, earned_at')
            .eq('user_id', currentUser.id);

        if (userBadgesError) {
            console.error('Error loading user badges:', userBadgesError);
        }

        const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);

        // Update badge count in sidebar
        const badgeCountEl = document.getElementById('profile-badges');
        if (badgeCountEl) {
            badgeCountEl.textContent = earnedBadgeIds.size;
            badgeCountEl.classList.remove('skeleton-text');
        }

        // Render badges in badges-row
        const badgesRow = document.getElementById('homeBadgesRow');
        if (badgesRow && allBadges && allBadges.length > 0) {
            console.log('Applying badge layout fix...', allBadges.length, 'badges found');
            
            // Nuclear option - completely reset everything
            badgesRow.removeAttribute('class');
            badgesRow.removeAttribute('style');
            badgesRow.className = '';
            
            // Force apply styles with maximum specificity
            setTimeout(() => {
                badgesRow.style.setProperty('display', 'flex', 'important');
                badgesRow.style.setProperty('justify-content', 'space-evenly', 'important');
                badgesRow.style.setProperty('align-items', 'center', 'important');
                badgesRow.style.setProperty('flex-wrap', 'wrap', 'important');
                badgesRow.style.setProperty('gap', '30px', 'important');
                badgesRow.style.setProperty('width', '100%', 'important');
                badgesRow.style.setProperty('padding', '20px 0', 'important');
                badgesRow.style.setProperty('margin', '0', 'important');
                badgesRow.style.setProperty('min-height', '100px', 'important');
                
                console.log('Badge container styles applied:', badgesRow.style.cssText);
            }, 100);
            
            badgesRow.innerHTML = allBadges.map(badge => {
                const isEarned = earnedBadgeIds.has(badge.id);
                const rarityColors = {
                    'common': '#10b981',
                    'rare': '#3b82f6',
                    'epic': '#8b5cf6',
                    'legendary': '#f59e0b'
                };
                const color = badge.color || rarityColors[badge.rarity] || '#3b82f6';

                return `
                    <div class="badge-item" title="${badge.description}">
                        ${!isEarned ? `<div style="position: absolute; top: 0; right: 0; width: 16px; height: 16px; background: rgba(0,0,0,0.75); border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 2; border: 1.5px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
                            <i class="fas fa-lock" style="font-size: 7px; color: white;"></i>
                        </div>` : ''}
                        ${badge.icon_url ?
                            `<img src="${badge.icon_url}" alt="${badge.name}" class="badge-icon" style="${!isEarned ? 'opacity: 0.5; filter: grayscale(50%);' : ''}" onerror="console.error('Badge icon failed to load:', '${badge.icon_url}'); this.onerror=null; this.style.display='none'; this.parentNode.innerHTML='<div class=\'badge-icon\' style=\'background: ${color}; display: flex; align-items: center; justify-content: center; ${!isEarned ? 'opacity: 0.5; filter: grayscale(50%);' : ''}\'>  <i class=\'fas fa-exclamation-triangle\' style=\'color: white; font-size: 20px;\'></i></div>';"` :
                            `<div class="badge-icon" style="background: ${color}; display: flex; align-items: center; justify-content: center; ${!isEarned ? 'opacity: 0.5; filter: grayscale(50%);' : ''}">
                                <i class="fas fa-trophy" style="color: white; font-size: 20px;"></i>
                            </div>`
                        }
                    </div>
                `;
            }).join('');
            
            // Force layout recalculation and spacing
            setTimeout(() => {
                const badgeItems = badgesRow.querySelectorAll('.badge-item');
                badgeItems.forEach((item, index) => {
                    item.style.setProperty('flex', '0 0 64px', 'important');
                    item.style.setProperty('width', '64px', 'important');
                    item.style.setProperty('height', '64px', 'important');
                    item.style.setProperty('margin', '0', 'important');
                });
                
                console.log('Badge layout enforced on', badgeItems.length, 'items');
                console.log('Final container styles:', badgesRow.style.cssText);
            }, 200);
        }

        // Show first earned badge in profile section
        if (userBadges && userBadges.length > 0 && allBadges) {
            const firstEarnedBadge = allBadges.find(b => earnedBadgeIds.has(b.id));
            const profileBadge = document.querySelector('.untitled-design');
            if (profileBadge && firstEarnedBadge?.icon_url) {
                profileBadge.src = firstEarnedBadge.icon_url;
                profileBadge.alt = firstEarnedBadge.name;
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
        // Fetch top users by total_xp from profiles table
        const { data: leaderboard, error } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url, total_xp')
            .order('total_xp', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error loading leaderboard:', error);
            return;
        }

        if (leaderboard && leaderboard.length > 0) {
            const leaderboardList = document.querySelector('.leaderboard-card__list');
            if (!leaderboardList) return;

            leaderboardList.innerHTML = leaderboard.map((entry, index) => {
                const isCurrentUser = currentUser && entry.id === currentUser.id;
                const entryClass = isCurrentUser ? 'leaderboard-entry current-user' : 'leaderboard-entry';

                return `
                    <li class="${entryClass}">
                        <div class="leaderboard-entry__profile">
                            <span class="leaderboard-rank">#${index + 1}</span>
                            <img class="leaderboard-entry__avatar"
                                 src="${entry.avatar_url || 'images/profile/default-avatar.svg'}"
                                 alt="${entry.username} avatar" />
                            <span class="leaderboard-entry__name">@${entry.username}</span>
                        </div>
                        <span class="leaderboard-entry__score">${formatNumber(entry.total_xp)}</span>
                    </li>
                `;
            }).join('');
        } else {
            // Show empty state if no users found
            const leaderboardList = document.querySelector('.leaderboard-card__list');
            if (leaderboardList) {
                leaderboardList.innerHTML = `
                    <li class="leaderboard-entry">
                        <div class="leaderboard-entry__profile">
                            <span class="leaderboard-entry__name">No users yet</span>
                        </div>
                        <span class="leaderboard-entry__score">0</span>
                    </li>
                `;
            }
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

function getRankIconFromLevel(level) {
    // Map rank to corresponding icon
    if (level >= 100) return 'images/home/rank-mythical.png';
    if (level >= 75) return 'images/home/rank-legendary.png';
    if (level >= 50) return 'images/home/rank-epic.png';
    if (level >= 25) return 'images/home/rank-rare.png';
    if (level >= 10) return 'images/home/rank-uncommon.png';
    return 'images/home/Untitled design (18) 1.png'; // Common rank icon
}