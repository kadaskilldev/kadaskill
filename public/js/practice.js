// ============================================
// Practice Page - Database Integration
// Dynamically loads practice exercises from Supabase
// ============================================

// Use the supabase client from script.js (already initialized)
// SUPABASE_URL and SUPABASE_ANON_KEY are declared in script.js

let allExercises = [];

// ============================================
// Initialize Page
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadPracticeExercises();
});

// ============================================
// Load Practice Exercises from Database
// ============================================

async function loadPracticeExercises() {
    try {
        const { data: exercises, error } = await supabase
            .from('practice_exercises')
            .select('*')
            .eq('is_published', true)
            .order('category', { ascending: true })
            .order('difficulty', { ascending: true });

        if (error) {
            console.error('Error loading practice exercises:', error);
            showError('Failed to load practice exercises. Please refresh the page.');
            return;
        }

        allExercises = exercises || [];
        renderExercises(allExercises);

    } catch (error) {
        console.error('Unexpected error loading practice exercises:', error);
        showError('An unexpected error occurred.');
    }
}

// ============================================
// Render Practice Exercises to Grid
// ============================================

function renderExercises(exercises) {
    const practiceGrid = document.querySelector('.practice-grid');

    if (!practiceGrid) {
        console.error('Practice grid element not found');
        return;
    }

    if (exercises.length === 0) {
        practiceGrid.innerHTML = `
            <div class="no-exercises-message" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-dumbbell" style="font-size: 48px; color: #666; margin-bottom: 16px;"></i>
                <p style="color: #666; font-size: 18px;">No practice exercises found</p>
            </div>
        `;
        return;
    }

    practiceGrid.innerHTML = exercises.map(exercise => createExerciseCard(exercise)).join('');
}

// ============================================
// Create Exercise Card HTML
// ============================================

function createExerciseCard(exercise) {
    const categoryClass = getCategoryClass(exercise.category);
    const categoryLabel = getCategoryLabel(exercise.category);
    const questionCount = exercise.questions ? exercise.questions.length : 0;
    const timeLimit = exercise.time_limit_minutes ? `${exercise.time_limit_minutes} min` : 'No time limit';
    const xpReward = exercise.xp_reward || 0;

    return `
        <div class="practice-card" data-category="${categoryClass}">
            <div class="practice-card-header">
                <span class="practice-badge ${categoryClass}">${categoryLabel}</span>
            </div>
            <div class="practice-card-body">
                <h3 class="practice-card-title">${exercise.title}</h3>
                <p class="practice-card-description">${truncateText(exercise.description, 100)}</p>
                <div class="practice-card-meta" style="display: flex; gap: 16px; margin-top: 12px; font-size: 14px; color: #666;">
                    <span><i class="fas fa-question-circle"></i> ${questionCount} questions</span>
                    <span><i class="fas fa-clock"></i> ${timeLimit}</span>
                    <span><i class="fas fa-star"></i> ${xpReward} XP</span>
                </div>
            </div>
            <div class="practice-card-footer">
                <button class="practice-btn" onclick="startExercise('${exercise.id}', '${exercise.slug}')">
                    Let's Start
                </button>
            </div>
        </div>
    `;
}

// ============================================
// Helper Functions
// ============================================

function getCategoryClass(category) {
    const categoryMap = {
        'AI': 'intermediate',
        'Artificial Intelligence': 'intermediate',
        'Cybersecurity': 'cybersecurity',
        'Cloud': 'cloud',
        'Cloud Computing': 'cloud'
    };
    return categoryMap[category] || 'intermediate';
}

function getCategoryLabel(category) {
    const labelMap = {
        'AI': 'Artificial Intelligence',
        'Cloud': 'Cloud Computing'
    };
    return labelMap[category] || category;
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

function showError(message) {
    const practiceGrid = document.querySelector('.practice-grid');
    if (practiceGrid) {
        practiceGrid.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-exclamation-circle" style="font-size: 48px; color: #ff4444; margin-bottom: 16px;"></i>
                <p style="color: #666; font-size: 18px;">${message}</p>
                <button onclick="location.reload()" class="practice-btn" style="margin-top: 16px;">
                    Refresh Page
                </button>
            </div>
        `;
    }
}

// ============================================
// Start Exercise
// ============================================

async function startExercise(exerciseId, exerciseSlug) {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            // Redirect to login if not authenticated
            window.location.href = 'index.html';
            return;
        }

        // Check if user has already attempted this exercise
        const { data: existingAttempt, error: checkError } = await supabase
            .from('practice_attempts')
            .select('id, score, passed')
            .eq('user_id', user.id)
            .eq('exercise_id', exerciseId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking previous attempts:', checkError);
        }

        // Redirect to practice exercise page
        if (existingAttempt && existingAttempt.passed) {
            const retake = confirm(`You've already passed this exercise with a score of ${existingAttempt.score}%.\n\nDo you want to retake it?`);
            if (!retake) return;
        }

        // Redirect to practice exercise page
        window.location.href = `practice-exercise.html?exercise=${exerciseSlug}`;

    } catch (error) {
        console.error('Unexpected error starting exercise:', error);
        alert('An unexpected error occurred.');
    }
}

// Make it global so onclick can access it
window.startExercise = startExercise;
