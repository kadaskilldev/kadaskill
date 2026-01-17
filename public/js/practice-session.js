document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.exercise-main')) {
        initializePracticeSessionPage();
    }
});

function initializePracticeSessionPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseId = urlParams.get('id');

    if (!exerciseId) {
        window.location.href = 'practice.html';
        return;
    }

    // --- Global State ---
    let currentExercise = null;
    let currentQuestionIndex = 0;
    let quizStartTime;
    let gradedAnswers = {};
    let selectedAnswer = null;
    let timerInterval = null;

    // --- DOM Elements ---
    const startScreen = document.getElementById('startScreen');
    const questionScreen = document.getElementById('questionScreen');
    const startBtn = document.getElementById('startExerciseBtn');
    
    const quizTitleEl = document.getElementById('exerciseTitle');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const timerEl = document.getElementById('quiz-timer');
    const timeRemainingEl = document.getElementById('time-remaining');
    
    const modal = document.getElementById('completion-modal');
    const finalScoreEl = document.getElementById('final-score');
    const xpGainedEl = document.getElementById('xp-gained');
    const continueBtn = document.getElementById('continue-btn');

    async function loadExercise() {
        const { data, error } = await supabase.from('practice_exercises').select('*').eq('id', exerciseId).single();
        if (error || !data) {
            console.error('Failed to load exercise:', error);
            quizTitleEl.textContent = 'Error Loading Exercise';
            return;
        }
        currentExercise = data;
        renderIntroScreen(); 
    }


    function renderIntroScreen() {
        quizTitleEl.textContent = currentExercise.title;
        document.getElementById('exerciseDescription').textContent = currentExercise.description || '';
        document.getElementById('exerciseCategory').querySelector('span').textContent = currentExercise.category;
        document.getElementById('exerciseDifficulty').querySelector('span').textContent = currentExercise.difficulty || 'Intermediate';
        document.getElementById('exerciseQuestions').querySelector('span').textContent = `${currentExercise.questions.length} Questions`;
        document.getElementById('totalQuestionsStart').textContent = currentExercise.questions.length;
        if (currentExercise.time_limit_minutes) {
            document.getElementById('timeLimitStart').style.display = 'flex';
            document.getElementById('timeLimitStart').querySelector('span').textContent = currentExercise.time_limit_minutes;
        }
    }

    function startQuiz() {
        startScreen.style.display = 'none';
        questionScreen.style.display = 'block';

        currentQuestionIndex = 0;
        gradedAnswers = {};
        quizStartTime = new Date();

        if (timerInterval) clearInterval(timerInterval);
        if (currentExercise.time_limit_minutes) {
            startTimer(currentExercise.time_limit_minutes);
        } else {
            if (timerEl) timerEl.style.display = 'none';
        }
        
        renderQuestion();
    }

    function startTimer(minutes) {
        let timeRemainingSeconds = minutes * 60;
        timerEl.style.display = 'flex';
        timerEl.classList.remove('warning');
        const updateTimerDisplay = () => {
            const mins = Math.floor(timeRemainingSeconds / 60);
            const secs = timeRemainingSeconds % 60;
            timeRemainingEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        };
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            timeRemainingSeconds--;
            updateTimerDisplay();
            if (timeRemainingSeconds <= 30 && !timerEl.classList.contains('warning')) {
                timerEl.classList.add('warning');
            }
            if (timeRemainingSeconds <= 0) {
                clearInterval(timerInterval);
                showNotification('Time is up! Submitting your answers...', 'warning');
                setTimeout(finishQuiz, 1500);
            }
        }, 1000);
    }
    
    function renderQuestion() {
        selectedAnswer = null;
        optionsContainerEl.classList.remove('graded');
        const question = currentExercise.questions[currentQuestionIndex];
        const isGraded = gradedAnswers.hasOwnProperty(currentQuestionIndex);
        questionTextEl.innerHTML = `${currentQuestionIndex + 1}. ${question.question}`;
        optionsContainerEl.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        question.options.forEach((optionText, index) => {
            const optionId = `q${currentQuestionIndex}_option${index}`;
            const optionLabel = document.createElement('label');
            optionLabel.className = 'option-label';
            optionLabel.htmlFor = optionId;
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'option';
            radioInput.id = optionId;
            radioInput.value = index;
            if (isGraded) {
                const answerInfo = gradedAnswers[currentQuestionIndex];
                if (index === answerInfo.correct) optionLabel.classList.add('correct');
                else if (index === answerInfo.selected) optionLabel.classList.add('incorrect');
                if (index === answerInfo.selected) radioInput.checked = true;
            }
            const customRadio = document.createElement('span');
            customRadio.className = 'custom-radio';
            const optionLetter = document.createElement('span');
            optionLetter.className = 'option-letter';
            optionLetter.textContent = `${letters[index]}.)`;
            const textSpan = document.createElement('span');
            textSpan.className = 'option-text';
            textSpan.textContent = optionText;
            optionLabel.appendChild(radioInput);
            optionLabel.appendChild(customRadio);
            optionLabel.appendChild(optionLetter);
            optionLabel.appendChild(textSpan);
            optionsContainerEl.appendChild(optionLabel);
        });
        if (isGraded) {
            optionsContainerEl.classList.add('graded');
            submitBtn.style.display = 'none';
        } else {
            submitBtn.style.display = 'block';
            submitBtn.disabled = true;
        }
        if (!isGraded) {
            document.querySelectorAll('input[name="option"]').forEach(input => {
                input.addEventListener('change', (event) => {
                    selectedAnswer = parseInt(event.target.value);
                    submitBtn.disabled = false;
                });
            });
        }
        updateButtonStates();
        updateProgressBar();
    }
    
    function updateButtonStates() {
        prevBtn.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
        nextBtn.style.display = currentQuestionIndex < currentExercise.questions.length - 1 ? 'block' : 'none';
    }

    function updateProgressBar() {
        const answeredCount = Object.keys(gradedAnswers).length;
        const progress = (answeredCount / currentExercise.questions.length) * 100;
        progressBarFill.style.width = `${progress}%`;
    }

    function handleSubmit() {
        if (selectedAnswer === null) return;
        const question = currentExercise.questions[currentQuestionIndex];
        gradedAnswers[currentQuestionIndex] = {
            correct: question.correct_answer,
            selected: selectedAnswer,
            isCorrect: selectedAnswer === question.correct_answer
        };
        renderQuestion();
        const answeredCount = Object.keys(gradedAnswers).length;
        if (answeredCount === currentExercise.questions.length) {
            setTimeout(finishQuiz, 1000);
        }
    }

    function handlePrevious() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
        }
    }

    function handleNext() {
        if (currentQuestionIndex < currentExercise.questions.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
        }
    }

    function finishQuiz() {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        let score = 0;
        for (let i = 0; i < currentExercise.questions.length; i++) {
            if (gradedAnswers[i] && gradedAnswers[i].isCorrect) {
                score++;
            }
        }
        saveAttemptAndShowModal(score, gradedAnswers);
    }
    
    async function saveAttemptAndShowModal(score, answersToSave) {
        const totalQuestions = currentExercise.questions.length;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const user = session.user;

        const { data: previousAttempts } = await supabase
            .from('practice_attempts').select('attempt_number, score, passed')
            .eq('user_id', user.id)
            .eq('exercise_id', currentExercise.id);

        let newAttemptNumber = 1;
        let isNewBestScore = true;

        if (previousAttempts && previousAttempts.length > 0) {
            newAttemptNumber = Math.max(...previousAttempts.map(a => a.attempt_number)) + 1;
            const maxScore = Math.max(...previousAttempts.map(a => a.score));
            if (score <= maxScore) isNewBestScore = false;
        }


        // 1. Is this the very first attempt for this user on this exercise?
        const isFirstAttempt = !previousAttempts || previousAttempts.length === 0;

        // 2. Is the score on this attempt perfect?
        const isCurrentAttemptPerfect = (score === totalQuestions);

        // 3. Award XP ONLY if it's the first attempt AND it's perfect.
        const xp = (isFirstAttempt && isCurrentAttemptPerfect) ? currentExercise.xp_reward : 0;


        finalScoreEl.textContent = `${score}/${totalQuestions}`;
        const xpTextElement = document.getElementById('xp-gained').parentElement;

        if (xp > 0) {
            xpGainedEl.textContent = `${xp} xp`;
            xpTextElement.style.display = 'block';
        } else {
            xpTextElement.style.display = 'none';
        }
        modal.style.display = 'flex';

        if (isNewBestScore) {
            await supabase.from('practice_attempts').update({ is_best_score: false })
                .match({ user_id: user.id, exercise_id: currentExercise.id });
        }

        const completedAt = new Date().toISOString();
        const timeTakenMs = new Date() - quizStartTime;
        const timeTakenMinutes = Math.max(1, Math.ceil(timeTakenMs / 60000));

        const newAttemptData = {
            user_id: user.id,
            exercise_id: currentExercise.id,
            attempt_number: newAttemptNumber,
            score: score,
            passed: isCurrentAttemptPerfect,
            xp_earned: xp, // This 0 on all but the first perfect attempt
            answers: answersToSave,
            completed_at: completedAt,
            time_taken_minutes: timeTakenMinutes,
            is_best_score: isNewBestScore
        };

        await supabase.from('practice_attempts').insert([newAttemptData]);

        // Award XP if any was earned (only for first perfect attempt)
        if (xp > 0) {
            try {
                const { error: xpError } = await supabase
                    .from('xp_transactions')
                    .insert({
                        user_id: user.id,
                        amount: xp,
                        source_type: 'practice_complete',
                        source_id: currentExercise.id,
                        description: `Practice exercise completed perfectly: ${currentExercise.title}`
                    });

                if (xpError) {
                    console.error('Error awarding practice XP:', xpError);
                } else {
                    console.log(`✅ Awarded ${xp} XP for perfect practice completion: ${currentExercise.title}`);
                }
            } catch (error) {
                console.error('Error awarding practice XP:', error);
            }
        }
    }

    // --- Event Listeners ---
    startBtn.addEventListener('click', startQuiz); 
    prevBtn.addEventListener('click', handlePrevious);
    nextBtn.addEventListener('click', handleNext);
    submitBtn.addEventListener('click', handleSubmit);
    continueBtn.addEventListener('click', () => { window.location.href = 'practice.html'; });

    loadExercise(); // Initial data load
}