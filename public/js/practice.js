// ============================================
// Practice Page - Database Integration
// Dynamically loads practice exercises from Supabase
// ============================================

// Use the supabase client from script.js (already initialized)
// SUPABASE_URL and SUPABASE_ANON_KEY are declared in script.js

let allExercises = [];
let completedExerciseIds = new Set();

// ============================================
// Initialize Page
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadPracticeExercises();
    setupFilters();
    // setupStickyFilter(); // Disabled: sidebar navigation no longer sticks on scroll
});

// ============================================
// Load Practice Exercises from Database
// ============================================

async function loadPracticeExercises() {
    try {
        // get current user
        const { data: { user } } = await supabase.auth.getUser();
        completedExerciseIds = new Set();

        // If user is logged in, fetch their passed attempts
        if (user) {
            const { data: attempts } = await supabase
                .from('practice_attempts')
                .select('exercise_id')
                .eq('user_id', user.id)
                .eq('passed', true); 
            
            if (attempts) {
                // Create a Set for fast lookups
                completedExerciseIds = new Set(attempts.map(a => a.exercise_id));
            }
        }

        // Fetch exercises
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
        // Pass the completed IDs to the render function
        renderExercises(allExercises, completedExerciseIds);

    } catch (error) {
        console.error('Unexpected error loading practice exercises:', error);
        showError('An unexpected error occurred.');
    }
}

// ============================================
// Render Practice Exercises to Grid
// ============================================

function renderExercises(exercises, completedIds = new Set()) {
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

    // Pass the completedIds to createExerciseCard
    practiceGrid.innerHTML = exercises.map(exercise => 
        createExerciseCard(exercise, completedIds.has(exercise.id))
    ).join('');
}

// ============================================
// Create Exercise Card HTML
// ============================================

function createExerciseCard(exercise, isCompleted) {
    const categoryClass = getCategoryClass(exercise.category);
    const categoryLabel = getCategoryLabel(exercise.category);
    const xpReward = exercise.xp_reward || 0;

    return `
        <div class="practice-card" data-category="${categoryClass}" style="--xp-reward: '${xpReward}xp';">
            <div class="practice-card-content">
                
                <!-- NEW: Completed Checkbox -->
                <div class="card-status-checkbox" title="${isCompleted ? 'Completed' : 'Not taken yet'}">
                    <input type="checkbox" ${isCompleted ? 'checked' : ''} disabled>
                </div>

                <div class="practice-card-header">
                    <span class="practice-badge ${categoryClass}">${categoryLabel}</span>
                </div>
                <div class="practice-card-body">
                    <h3 class="practice-card-title">${exercise.title}</h3>
                    <p class="practice-card-description">${truncateText(exercise.description, 100)}</p>
                </div>
                <div class="practice-card-footer">
                    <button class="practice-card-btn" onclick="startExercise('${exercise.id}')">
                        <span>Let's Start</span>
                    </button>
                </div>
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
        window.location.href = `practice-session.html?id=${exerciseId}`;

    } catch (error) {
        console.error('Unexpected error starting exercise:', error);
        alert('An unexpected error occurred.');
    }
}


function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Remove 'active' class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // 2. Add 'active' class to the clicked button
            btn.classList.add('active');

            // 3. Get the category to filter by
            const category = btn.getAttribute('data-category');
            
            // 4. Call the filter function
            filterExercises(category);
        });
    });
}


// ============================================
// Filter Logic
// ============================================
function filterExercises(category) {
    if (category === 'all') {
        // If 'All', show everything
        renderExercises(allExercises, completedExerciseIds);
    } else {
        // Filter the array based on the category
        // We use .includes() to handle cases like "AI" vs "Artificial Intelligence" nicely if needed, 
        // but exact match is usually safer for categories.
        const filtered = allExercises.filter(exercise => 
            exercise.category === category || 
            (category === 'Artificial Intelligence' && exercise.category === 'AI') || // Handle abbreviation
            (category === 'Cloud Computing' && exercise.category === 'Cloud') 
        );
        renderExercises(filtered, completedExerciseIds);
    }
}

// ============================================
// Sticky Filter Logic
// ============================================

function setupStickyFilter() {
    const filterSection = document.getElementById('filter-section');
    const placeholder = document.getElementById('filter-placeholder');
    const heroSection = document.querySelector('.practice-hero-section');
    
    if (!filterSection || !heroSection || !placeholder) return;

    // Use IntersectionObserver for performance (better than scroll listener)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the Hero section is NOT visible (we scrolled past it)
            if (!entry.isIntersecting) {
                // Get the position relative to viewport
                const rect = heroSection.getBoundingClientRect();
                
                // Only activate if we scrolled DOWN past it (top is negative)
                if (rect.top < 0) {
                    filterSection.classList.add('is-sticky');
                    placeholder.style.display = 'block'; // Take up the empty space
                }
            } else {
                // If Hero is back in view, revert to normal
                filterSection.classList.remove('is-sticky');
                placeholder.style.display = 'none';
            }
        });
    }, {
        root: null,
        threshold: 0, // Trigger as soon as even 1px is out/in
        rootMargin: "-80px 0px 0px 0px" // Offset slightly for the navbar
    });

    observer.observe(heroSection);
}


// Make it global so onclick can access it
window.startExercise = startExercise;
