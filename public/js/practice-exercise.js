// ============================================
// Practice Exercise Page - Main JavaScript
// ============================================

// Use the global supabase client from script.js
// supabaseClient and supabase are already initialized in script.js

// Global state
let currentUser = null;
let currentExercise = null;
let currentQuestionIndex = 0;
let userAnswers = {};
let startTime = null;
let timerInterval = null;

// ============================================
// Initialize Page
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    currentUser = session.user;

    // Get exercise ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseSlug = urlParams.get('exercise');

    if (!exerciseSlug) {
        window.location.href = 'practice.html';
        return;
    }

    // Load exercise data
    await loadExercise(exerciseSlug);

    // Setup event listeners
    setupEventListeners();
});

// ============================================
// Load Exercise Data
// ============================================

async function loadExercise(slug) {
    try {
        const { data: exercise, error } = await supabase
            .from('practice_exercises')
            .select('*')
            .eq('slug', slug)
            .eq('is_published', true)
            .single();

        if (error) throw error;

        if (!exercise) {
            alert('Exercise not found');
            window.location.href = 'practice.html';
            return;
        }

        currentExercise = exercise;
        renderExerciseInfo();

    } catch (error) {
        console.error('Error loading exercise:', error);
        alert('Failed to load exercise');
        window.location.href = 'practice.html';
    }
}

// ============================================
// Render Exercise Info
// ============================================

function renderExerciseInfo() {
    // Header
    document.getElementById('exerciseTitle').textContent = currentExercise.title;
    document.getElementById('exerciseDescription').textContent = currentExercise.description || '';

    document.getElementById('exerciseCategory').querySelector('span').textContent = currentExercise.category;
    document.getElementById('exerciseDifficulty').querySelector('span').textContent = currentExercise.difficulty || 'Intermediate';
    document.getElementById('exerciseQuestions').querySelector('span').textContent = `${currentExercise.questions.length} Questions`;

    // Start screen
    const totalQuestions = currentExercise.questions.length;
    document.getElementById('totalQuestionsStart').textContent = totalQuestions;
    document.getElementById('passingScoreStart').textContent = currentExercise.passing_score || 70;
    document.getElementById('xpRewardStart').textContent = currentExercise.xp_reward || 15;

    if (currentExercise.time_limit_minutes) {
        document.getElementById('timeLimitStart').style.display = 'flex';
        document.getElementById('timeLimitStart').querySelector('span').textContent = currentExercise.time_limit_minutes;
    }

    // Progress
    updateProgress();
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    document.getElementById('startExerciseBtn').addEventListener('click', startExercise);
    document.getElementById('nextQuestionBtn').addEventListener('click', nextQuestion);
    document.getElementById('retryExerciseBtn').addEventListener('click', retryExercise);
}

// ============================================
// Start Exercise
// ============================================

function startExercise() {
    // Hide start screen, show question screen
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('questionScreen').style.display = 'block';

    // Reset state
    currentQuestionIndex = 0;
    userAnswers = {};
    startTime = new Date();

    // Start timer if time limit exists
    if (currentExercise.time_limit_minutes) {
        startTimer();
    }

    // Show first question
    renderQuestion();
}

// ============================================
// Render Question
// ============================================

function renderQuestion() {
    const question = currentExercise.questions[currentQuestionIndex];
    const totalQuestions = currentExercise.questions.length;

    // Update question number
    document.getElementById('questionNumber').textContent =
        `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;

    // Update question text
    document.getElementById('questionText').textContent = question.question;

    // Render options
    const optionsContainer = document.getElementById('questionOptions');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(button);
    });

    // Hide feedback and next button
    document.getElementById('questionFeedback').style.display = 'none';
    document.getElementById('nextQuestionBtn').style.display = 'none';

    // Update progress
    updateProgress();
}

// ============================================
// Select Answer
// ============================================

function selectAnswer(selectedIndex) {
    const question = currentExercise.questions[currentQuestionIndex];
    const correctIndex = question.correct_answer;
    const isCorrect = selectedIndex === correctIndex;

    // Save answer
    userAnswers[currentQuestionIndex] = {
        selected: selectedIndex,
        correct: correctIndex,
        isCorrect: isCorrect
    };

    // Update UI
    const options = document.querySelectorAll('.option-button');

    // Disable all options
    options.forEach(option => {
        option.disabled = true;
    });

    // Mark selected answer
    options[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect');

    // Always show correct answer
    if (!isCorrect) {
        options[correctIndex].classList.add('correct');
    }

    // Show feedback
    showFeedback(isCorrect, question.explanation);

    // Show next button
    document.getElementById('nextQuestionBtn').style.display = 'inline-flex';
}

// ============================================
// Show Feedback
// ============================================

function showFeedback(isCorrect, explanation) {
    const feedbackElement = document.getElementById('questionFeedback');
    const feedbackContent = feedbackElement.querySelector('.feedback-content');
    const feedbackIcon = feedbackContent.querySelector('i');
    const feedbackStrong = feedbackContent.querySelector('strong');
    const explanationText = document.getElementById('explanationText');

    if (isCorrect) {
        feedbackContent.classList.remove('incorrect');
        feedbackIcon.className = 'fas fa-check-circle';
        feedbackStrong.textContent = 'Correct!';
    } else {
        feedbackContent.classList.add('incorrect');
        feedbackIcon.className = 'fas fa-times-circle';
        feedbackStrong.textContent = 'Incorrect';
    }

    explanationText.textContent = explanation || (isCorrect ? 'Well done!' : 'Review the correct answer above.');

    feedbackElement.style.display = 'block';
}

// ============================================
// Next Question
// ============================================

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < currentExercise.questions.length) {
        renderQuestion();
    } else {
        // Exercise complete
        finishExercise();
    }
}

// ============================================
// Finish Exercise
// ============================================

async function finishExercise() {
    // Stop timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    // Calculate score
    const totalQuestions = currentExercise.questions.length;
    const correctAnswers = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = scorePercentage >= (currentExercise.passing_score || 70);

    // Calculate time taken
    const endTime = new Date();
    const timeTakenMinutes = Math.round((endTime - startTime) / 1000 / 60);

    // Check if this is first pass
    const { data: previousAttempts } = await supabase
        .from('practice_attempts')
        .select('id, passed')
        .eq('user_id', currentUser.id)
        .eq('exercise_id', currentExercise.id);

    const isFirstPass = !previousAttempts || previousAttempts.length === 0;
    console.log('[PracticeExercise] Previous attempts:', previousAttempts?.length || 0, 'isFirstPass?', isFirstPass);

    // Award XP only on first pass
    const xpEarned = (passed && isFirstPass) ? currentExercise.xp_reward : 0;
    console.log('[PracticeExercise] Score %d%% (passed=%s). XP to award this run: %d', scorePercentage, passed, xpEarned);

    // Save attempt to database
    const attemptNumber = (previousAttempts?.length || 0) + 1;

    try {
        const { error } = await supabase
            .from('practice_attempts')
            .insert({
                user_id: currentUser.id,
                exercise_id: currentExercise.id,
                attempt_number: attemptNumber,
                answers: userAnswers,
                score: scorePercentage,
                passed: passed,
                xp_earned: xpEarned,
                completed_at: new Date(),
                time_taken_minutes: timeTakenMinutes
            });

        if (error) throw error;

        console.log('[PracticeExercise] Attempt stored (attempt #%d).', attemptNumber);

        // Update user XP if earned
        if (xpEarned > 0) {
            await updateUserXP(xpEarned);
        } else {
            console.log('[PracticeExercise] No XP awarded this run. Either not passed or not first pass.');
        }

    } catch (error) {
        console.error('Error saving attempt:', error);
    }

    // Show results
    showResults(scorePercentage, correctAnswers, totalQuestions, passed, xpEarned);
}

// ============================================
// Update User XP
// ============================================

async function updateUserXP(xpToAdd) {
    try {
        // Get current XP
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('total_xp')
            .eq('id', currentUser.id)
            .single();

        if (profileError) {
            console.error('[PracticeExercise] Failed to fetch profile before XP update:', profileError);
            return;
        }

        const priorXP = profile?.total_xp || 0;
        const newXP = priorXP + xpToAdd;
        console.log('[PracticeExercise] Updating XP from %d to %d (+%d)', priorXP, newXP, xpToAdd);

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ total_xp: newXP })
            .eq('id', currentUser.id);

        if (updateError) {
            console.error('[PracticeExercise] Failed to persist XP update:', updateError);
        } else {
            console.log('[PracticeExercise] XP update successful.');
        }

    } catch (error) {
        console.error('Error updating XP:', error);
    }
}

// ============================================
// Show Results
// ============================================

function showResults(scorePercentage, correctAnswers, totalQuestions, passed, xpEarned) {
    // Hide question screen, show results screen
    document.getElementById('questionScreen').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'flex';

    // Set icon and message
    const resultsIcon = document.getElementById('resultsIcon');
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsMessage = document.getElementById('resultsMessage');

    if (passed) {
        resultsIcon.className = 'results-icon passed';
        resultsIcon.innerHTML = '<i class="fas fa-trophy"></i>';
        resultsTitle.textContent = 'Congratulations!';
        resultsMessage.textContent = 'You passed the exercise!';
    } else {
        resultsIcon.className = 'results-icon failed';
        resultsIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
        resultsTitle.textContent = 'Not Quite There';
        resultsMessage.textContent = 'Keep practicing and try again!';
    }

    // Set score
    document.getElementById('scorePercentage').textContent = `${scorePercentage}%`;

    // Animate score circle
    const circumference = 2 * Math.PI * 90; // radius is 90
    const offset = circumference - (scorePercentage / 100) * circumference;
    document.getElementById('scoreCircle').style.strokeDashoffset = offset;

    // Set stats
    document.getElementById('correctAnswers').textContent = correctAnswers;
    document.getElementById('incorrectAnswers').textContent = totalQuestions - correctAnswers;
    document.getElementById('xpEarned').textContent = xpEarned;

    // Update progress
    updateProgress();
}

// ============================================
// Update Progress
// ============================================

function updateProgress() {
    const totalQuestions = currentExercise.questions.length;
    const answeredQuestions = Object.keys(userAnswers).length;
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;

    document.getElementById('progressCount').textContent = `${answeredQuestions} / ${totalQuestions}`;
    document.getElementById('progressBarFill').style.width = `${progressPercentage}%`;
}

// ============================================
// Retry Exercise
// ============================================

function retryExercise() {
    // Hide results, show start screen
    document.getElementById('resultsScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';

    // Reset state
    currentQuestionIndex = 0;
    userAnswers = {};
    startTime = null;

    // Reset progress
    updateProgress();
}

// ============================================
// Timer Functions
// ============================================

function startTimer() {
    const timeLimitMinutes = currentExercise.time_limit_minutes;
    let timeRemainingSeconds = timeLimitMinutes * 60;

    document.getElementById('timer').style.display = 'flex';

    timerInterval = setInterval(() => {
        timeRemainingSeconds--;

        const minutes = Math.floor(timeRemainingSeconds / 60);
        const seconds = timeRemainingSeconds % 60;

        document.getElementById('timeRemaining').textContent =
            `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (timeRemainingSeconds <= 0) {
            clearInterval(timerInterval);
            finishExercise();
        }
    }, 1000);
}
