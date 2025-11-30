document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.practice-session-main')) {
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

    // --- DOM Elements ---
    const quizTitleEl = document.getElementById('quiz-title');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressBarFill = document.getElementById('progress-bar-fill');
    
    // --- Modal Elements ---
    const modal = document.getElementById('completion-modal');
    const finalScoreEl = document.getElementById('final-score');
    const xpGainedEl = document.getElementById('xp-gained');
    const continueBtn = document.getElementById('continue-btn');

    async function loadExercise() {
        const { data, error } = await supabase.from('practice_exercises').select('*').eq('id', exerciseId).single();
        if (error || !data) {
            console.error('Failed to load exercise:', error);
            quizTitleEl.textContent = 'Error';
            questionTextEl.textContent = 'Could not load the practice session.';
            return;
        }
        currentExercise = data;
        startQuiz();
    }

    function startQuiz() {
        quizTitleEl.textContent = currentExercise.title;
        currentQuestionIndex = 0;
        gradedAnswers = {};
        quizStartTime = new Date();
        renderQuestion();
    }
    
    function renderQuestion() {
        selectedAnswer = null;
        optionsContainerEl.classList.remove('graded');
        const question = currentExercise.questions[currentQuestionIndex];
        const isGraded = gradedAnswers.hasOwnProperty(currentQuestionIndex);

        questionTextEl.innerHTML = `${currentQuestionIndex + 1}. ${question.question}`;
        optionsContainerEl.innerHTML = '';

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
            const textSpan = document.createElement('span');
            textSpan.className = 'option-text';
            textSpan.textContent = optionText;

            optionLabel.appendChild(radioInput);
            optionLabel.appendChild(customRadio);
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
            setTimeout(() => {
                finishQuiz();
            }, 1000);
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
        let score = 0;
        for (const key in gradedAnswers) {
            if (gradedAnswers[key].isCorrect) {
                score++;
            }
        }
        saveAttemptAndShowModal(score, gradedAnswers);
    }
    
    async function saveAttemptAndShowModal(score, answersToSave) {
        const totalQuestionsAnswered = Object.keys(answersToSave).length;
        const xp = totalQuestionsAnswered > 0 ? Math.round((score / totalQuestionsAnswered) * currentExercise.xp_reward) : 0;

        finalScoreEl.textContent = `${score}/${totalQuestionsAnswered}`;
        xpGainedEl.textContent = `${xp} xp`;
        modal.style.display = 'flex';

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const user = session.user;

        const { data: previousAttempts } = await supabase
            .from('practice_attempts').select('attempt_number, score')
            .eq('user_id', user.id).eq('exercise_id', currentExercise.id);

        let newAttemptNumber = 1;
        let isNewBestScore = true;
        if (previousAttempts && previousAttempts.length > 0) {
            newAttemptNumber = Math.max(...previousAttempts.map(a => a.attempt_number)) + 1;
            const maxScore = Math.max(...previousAttempts.map(a => a.score));
            if (score <= maxScore) isNewBestScore = false;
        }
        
        if (isNewBestScore) {
            await supabase.from('practice_attempts').update({ is_best_score: false })
                .match({ user_id: user.id, exercise_id: currentExercise.id });
        }

        const completedAt = new Date().toISOString();
        const timeTakenMs = new Date() - quizStartTime;
        const timeTakenMinutes = Math.max(1, Math.ceil(timeTakenMs / 60000));

        const newAttemptData = {
            user_id: user.id, exercise_id: currentExercise.id, attempt_number: newAttemptNumber,
            score: score, passed: (score / currentExercise.questions.length) >= (currentExercise.passing_score / 100),
            xp_earned: xp, answers: answersToSave, completed_at: completedAt,
            time_taken_minutes: timeTakenMinutes, is_best_score: isNewBestScore
        };

        await supabase.from('practice_attempts').insert([newAttemptData]);
    }

    prevBtn.addEventListener('click', handlePrevious);
    nextBtn.addEventListener('click', handleNext);
    submitBtn.addEventListener('click', handleSubmit);
    continueBtn.addEventListener('click', () => { window.location.href = 'practice.html'; });

    loadExercise();
}