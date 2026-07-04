const quizData = [
    { question: "What is the process where liquid water turns into water vapor due to the sun's heat?", options: ["Evaporation", "Condensation", "Precipitation", "Transpiration"], correct: 0 },
    { question: "What is the main agent or energy source driving the natural water cycle on Earth?", options: ["Strong winds", "The Sun", "Clouds", "Earth's gravity"], correct: 1 },
    { question: "The process of water vapor cooling down and turning into water droplets that form clouds is known as...", options: ["Evaporation", "Precipitation", "Condensation", "Absorption"], correct: 2 },
    { question: "What is the name of the process where water is lost as water vapor from plants into the atmosphere?", options: ["Photosynthesis", "Respiration", "Condensation", "Transpiration"], correct: 3 },
    { question: "Rain, snow, and hail are examples of which process in the water cycle?", options: ["Precipitation", "Evaporation", "Condensation", "Groundwater flow"], correct: 0 },
    { question: "What happens when clouds become too heavy and saturated with water droplets?", options: ["Water vapor turns back into air", "Water falls as rain (Precipitation)", "Clouds move higher up", "Evaporation stops completely"], correct: 1 },
    { question: "What structure on plant leaves allows the process of transpiration to occur?", options: ["Chlorophyll", "Roots", "Stomata", "Stem"], correct: 2 },
    { question: "Rainwater that falls to the ground and flows over the earth's surface towards rivers or oceans is called...", options: ["Groundwater", "Surface runoff", "Wastewater", "Distilled water"], correct: 1 },
    { question: "Which of the following factors can INCREASE the rate of water evaporation?", options: ["Low ambient temperature", "High air humidity", "Areas sheltered from wind", "High ambient temperature and windy conditions"], correct: 3 },
    { question: "What is the primary importance of the natural water cycle to living things on Earth?", options: ["Maintaining fresh water supply and cooling the Earth", "Making sea water fresh", "Preventing droughts completely", "Supplying oxygen gas into the water"], correct: 0 }
];

let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 30;
let hasAnswered = false;
let audioPlaying = true; 
let userAnswers = [];

// ================= AUDIO EFFECTS (WEB AUDIO API) =================
function playSyntheticSound(isCorrect) {
    if (!audioPlaying) return;
    
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        if (isCorrect) {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); 
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); 
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.25);
        } else {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(180, ctx.currentTime); 
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.2);
        }
    } catch (e) {
        console.log("Web Audio API blocked or not supported:", e);
    }
}

function switchScreen(screenId) {
    clearInterval(timerInterval);
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

function toggleAudio() {
    audioPlaying = !audioPlaying;
    const btn = document.getElementById('audio-btn');
    btn.innerText = audioPlaying ? "🔊 Sound Effects: ON" : "🔇 Sound Effects: OFF";
}

function openHyperlinkModal() { document.getElementById('hyperlink-modal').classList.remove('hidden'); }
function closeHyperlinkModal() { document.getElementById('hyperlink-modal').classList.add('hidden'); }

function startQuiz() {
    switchScreen('quiz-screen');
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = []; 
    loadQuestion();
}

function loadQuestion() {
    hasAnswered = false;
    timeLeft = 30;
    document.getElementById('timer').innerText = timeLeft;
    
    const feedback = document.getElementById('feedback');
    feedback.classList.add('hidden');
    feedback.className = "feedback-text hidden"; 
    document.getElementById('next-btn').classList.add('hidden');
    
    document.getElementById('question-number').innerText = `Question ${currentQuestionIndex + 1}/${quizData.length}`;
    
    const currentQuestion = quizData[currentQuestionIndex];
    document.getElementById('question-text').innerText = currentQuestion.question;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    const optionLetters = ['A', 'B', 'C', 'D'];
    
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = "option-btn bg-slate-50 hover:bg-slate-100 text-slate-700 w-full text-left p-4 rounded-xl transition border border-slate-200 flex items-center gap-3 mb-2";
        button.innerHTML = `<span class="bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded-md text-xs">${optionLetters[index]}</span> <span>${option}</span>`;
        button.onclick = () => selectOption(index, button);
        optionsContainer.appendChild(button);
    });

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    document.getElementById('timer').innerText = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        hasAnswered = true;
        
        userAnswers.push(-1);
        
        disableOptions();
        highlightCorrectAnswer(quizData[currentQuestionIndex].correct);
        showFeedback("Time's up! ⏰", "text-red-600 font-bold mt-2");
        
        playSyntheticSound(false);
        
        document.getElementById('next-btn').classList.remove('hidden');
    }
}

function selectOption(selectedIndex, selectedButton) {
    if (hasAnswered) return;
    hasAnswered = true;
    clearInterval(timerInterval);
    disableOptions();

    const currentQuestion = quizData[currentQuestionIndex];
    userAnswers.push(selectedIndex);

    if (selectedIndex === currentQuestion.correct) {
        score++;
        selectedButton.classList.add('bg-green-100', 'border-green-500', 'text-green-700 font-semibold');
        showFeedback("Excellent! Your answer is CORRECT. 🎉", "text-green-600 font-bold mt-2");
        playSyntheticSound(true);
    } else {
        selectedButton.classList.add('bg-red-100', 'border-red-500', 'text-red-700 font-semibold');
        highlightCorrectAnswer(currentQuestion.correct);
        showFeedback("Incorrect! Don't give up, try again.", "text-red-600 font-bold mt-2");
        playSyntheticSound(false);
    }
    document.getElementById('next-btn').classList.remove('hidden');
}

function showFeedback(text, className) {
    const feedback = document.getElementById('feedback');
    feedback.innerText = text;
    feedback.classList.remove('hidden');
    feedback.className = `text-center p-3 rounded-xl mb-6 ${className}`;
}

function highlightCorrectAnswer(correctIndex) {
    const buttons = document.getElementsByClassName('option-btn');
    if (buttons[correctIndex]) {
        buttons[correctIndex].classList.add('bg-green-100', 'border-green-500', 'text-green-700 font-semibold');
    }
}

function disableOptions() {
    const buttons = document.getElementsByClassName('option-btn');
    for (let btn of buttons) { btn.disabled = true; }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    switchScreen('result-screen');
    document.getElementById('final-score').innerText = score;
    const comment = document.getElementById('grade-comment');
    
    if (score >= 8) comment.innerText = "Excellent! You perfectly understand the Natural Water Cycle. 🌟";
    else if (score >= 5) comment.innerText = "Well done! You passed, keep practicing to improve. 👍";
    else comment.innerText = "Try again! Please re-read the Water Cycle module notes. 📚";

    const reviewContainer = document.getElementById('review-container');
    reviewContainer.innerHTML = ''; 

    quizData.forEach((data, index) => {
        const userChoiceIndex = userAnswers[index];
        const isCorrect = userChoiceIndex === data.correct;
        
        let userAnsText = userChoiceIndex === -1 ? "No answer (Time out)" : data.options[userChoiceIndex];
        let correctAnsText = data.options[data.correct];

        const reviewItem = document.createElement('div');
        reviewItem.className = `p-4 rounded-xl border text-sm ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`;
        
        reviewItem.innerHTML = `
            <p class="font-bold text-slate-800 mb-2">Q${index + 1}: ${data.question}</p>
            <div class="space-y-1 text-xs">
                <p><span class="font-semibold">Your Answer:</span> <span class="${isCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}">${userAnsText}</span></p>
                ${!isCorrect ? `<p><span class="font-semibold text-slate-600">Correct Answer:</span> <span class="text-green-600 font-bold">${correctAnsText}</span></p>` : ''}
            </div>
        `;
        reviewContainer.appendChild(reviewItem);
    });
}
