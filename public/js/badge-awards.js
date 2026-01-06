// ============================================
// Badge Awarding System
// Automatically awards badges when criteria are met
// ============================================

// Check and award badges for a user
async function checkAndAwardBadges(userId) {
    try {
        console.log('🏆 Checking badges for user:', userId);

        // Get all active badges
        const { data: badges, error: badgesError } = await supabase
            .from('badges')
            .select('*')
            .eq('is_active', true);

        if (badgesError) {
            console.error('Error fetching badges:', badgesError);
            return [];
        }

        if (!badges || badges.length === 0) {
            console.log('No active badges found');
            return [];
        }

        // Get badges user already has
        const { data: userBadges, error: userBadgesError } = await supabase
            .from('user_badges')
            .select('badge_id')
            .eq('user_id', userId);

        if (userBadgesError) {
            console.error('Error fetching user badges:', userBadgesError);
            return [];
        }

        const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);

        // Check each badge
        const newlyEarnedBadges = [];

        for (const badge of badges) {
            // Skip if user already has this badge
            if (earnedBadgeIds.has(badge.id)) {
                continue;
            }

            // Check if criteria is met
            const criteriaMet = await checkBadgeCriteria(userId, badge);

            if (criteriaMet) {
                // Award the badge
                const awarded = await awardBadge(userId, badge);
                if (awarded) {
                    newlyEarnedBadges.push(badge);
                }
            }
        }

        return newlyEarnedBadges;

    } catch (error) {
        console.error('Error in checkAndAwardBadges:', error);
        return [];
    }
}

// Check if user meets badge criteria
async function checkBadgeCriteria(userId, badge) {
    const criteria = badge.criteria || {};

    try {
        switch (criteria.type) {
            case 'first_enrollment':
                return await checkFirstEnrollment(userId);

            case 'course_complete':
                return await checkCourseComplete(userId, criteria.course_id);

            case 'courses_count':
                return await checkCoursesCount(userId, criteria.count);

            case 'xp_threshold':
                return await checkXPThreshold(userId, criteria.xp_amount);

            case 'streak_days':
                return await checkStreakDays(userId, criteria.days);

            case 'category_master':
                return await checkCategoryMaster(userId, criteria.category);

            case 'perfect_score':
                return await checkPerfectScore(userId);

            default:
                console.warn('Unknown criteria type:', criteria.type);
                return false;
        }
    } catch (error) {
        console.error('Error checking criteria for badge:', badge.name, error);
        return false;
    }
}

// Criteria check functions
async function checkFirstEnrollment(userId) {
    const { count, error } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    return !error && count > 0;
}

async function checkCourseComplete(userId, courseId) {
    if (!courseId) {
        // Any course completion
        const { count, error } = await supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('status', 'completed')
            .eq('progress_percentage', 100);

        return !error && count > 0;
    } else {
        // Specific course completion
        const { data, error } = await supabase
            .from('enrollments')
            .select('*')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .eq('status', 'completed')
            .eq('progress_percentage', 100)
            .maybeSingle();

        return !error && data !== null;
    }
}

async function checkCoursesCount(userId, requiredCount) {
    const { count, error } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'completed')
        .eq('progress_percentage', 100);

    return !error && count >= requiredCount;
}

async function checkXPThreshold(userId, requiredXP) {
    const { data, error } = await supabase
        .from('profiles')
        .select('total_xp')
        .eq('id', userId)
        .single();

    return !error && data && data.total_xp >= requiredXP;
}

async function checkStreakDays(userId, requiredDays) {
    // This would require a learning_activity table to track daily activity
    // For now, return false - you can implement this later
    console.log('Streak checking not yet implemented');
    return false;
}

async function checkCategoryMaster(userId, category) {
    // Get all courses in category
    const { data: coursesInCategory, error: coursesError } = await supabase
        .from('courses')
        .select('id')
        .eq('category', category)
        .eq('is_published', true);

    if (coursesError || !coursesInCategory || coursesInCategory.length === 0) {
        return false;
    }

    const courseIds = coursesInCategory.map(c => c.id);

    // Check if user completed all courses in category
    const { data: completedCourses, error: completedError } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .eq('progress_percentage', 100)
        .in('course_id', courseIds);

    if (completedError) return false;

    return completedCourses.length === courseIds.length;
}

async function checkPerfectScore(userId) {
    // This would require checking quiz/assessment results
    // For now, return false - implement when you have assessments
    console.log('Perfect score checking not yet implemented');
    return false;
}

// Award badge to user
async function awardBadge(userId, badge) {
    try {
        console.log('🎉 Awarding badge:', badge.name, 'to user:', userId);

        // Insert into user_badges
        const { error: insertError } = await supabase
            .from('user_badges')
            .insert({
                user_id: userId,
                badge_id: badge.id,
                earned_at: new Date().toISOString()
            });

        if (insertError) {
            console.error('Error inserting user badge:', insertError);
            return false;
        }

        // Award XP if badge has reward
        if (badge.xp_reward && badge.xp_reward > 0) {
            const { error: xpError } = await supabase.rpc('increment_user_xp', {
                user_id: userId,
                xp_amount: badge.xp_reward
            });

            if (xpError) {
                console.error('Error awarding XP:', xpError);
                // Continue anyway - badge was awarded
            }
        }

        console.log('✅ Badge awarded successfully!');
        return true;

    } catch (error) {
        console.error('Error awarding badge:', error);
        return false;
    }
}

// Show badge earned notification
function showBadgeNotification(badge) {
    const notification = document.createElement('div');
    notification.className = 'badge-notification';
    notification.innerHTML = `
        <div class="badge-notification-content">
            <div class="badge-notification-icon">
                ${badge.icon_url ?
                    `<img src="${badge.icon_url}" alt="${badge.name}">` :
                    `<i class="fas fa-trophy" style="color: ${badge.color};"></i>`
                }
            </div>
            <div class="badge-notification-text">
                <h4>🎉 Badge Earned!</h4>
                <p><strong>${badge.name}</strong></p>
                <p>${badge.description}</p>
                ${badge.xp_reward ? `<p class="badge-xp">+${badge.xp_reward} XP</p>` : ''}
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Inject notification styles
(function injectBadgeNotificationStyles() {
    if (document.getElementById('badge-notification-styles')) return;

    const style = document.createElement('style');
    style.id = 'badge-notification-styles';
    style.textContent = `
        .badge-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 400px;
            transform: translateX(450px);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .badge-notification.show {
            transform: translateX(0);
        }

        .badge-notification-content {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .badge-notification-icon {
            width: 64px;
            height: 64px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            flex-shrink: 0;
        }

        .badge-notification-icon img {
            width: 56px;
            height: 56px;
            border-radius: 8px;
            object-fit: cover;
        }

        .badge-notification-text h4 {
            margin: 0 0 8px 0;
            font-size: 18px;
            font-weight: 700;
        }

        .badge-notification-text p {
            margin: 4px 0;
            font-size: 14px;
            opacity: 0.95;
        }

        .badge-xp {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 12px;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 8px !important;
        }

        @media (max-width: 768px) {
            .badge-notification {
                right: 10px;
                left: 10px;
                max-width: none;
                transform: translateY(-150px);
            }

            .badge-notification.show {
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
})();

// Make functions globally available
window.checkAndAwardBadges = checkAndAwardBadges;
window.showBadgeNotification = showBadgeNotification;
