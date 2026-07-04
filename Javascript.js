

 const quizData = [
    { question: "Apakah proses di mana cecair air bertukar menjadi wap air akibat haba matahari?", options: ["Penyejatan", "Kondensasi", "Kerpasan", "Transpirasi"], correct: 0 },
    { question: "Apakah agen atau sumber tenaga utama yang memacu kitaran air semulajadi di Bumi?", options: ["Angin kencang", "Matahari", "Awan", "Graviti bumi"], correct: 1 },
    { question: "Proses wap air yang menyejuk lalu bertukar menjadi titisan air yang membentuk awan dikenali sebagai...", options: ["Penyejatan", "Kerpasan", "Kondensasi", "Penyerapan"], correct: 2 },
    { question: "Apakah nama proses kehilangan air dalam bentuk wap air daripada tumbuhan ke atmosfera?", options: ["Fotosintesis", "Respirasi", "Kondensasi", "Transpirasi"], correct: 3 },
    { question: "Hujan, salji, dan hujan batu merupakan contoh bagi proses apa dalam kitaran air?", options: ["Kerpasan", "Penyejatan", "Kondensasi", "Aliran air bawah tanah"], correct: 0 },
    { question: "Apakah yang berlaku apabila awan menjadi terlalu berat dan tepu dengan titisan air?", options: ["Awan bertukar menjadi wap air semula", "Air turun sebagai hujan (Kerpasan)", "Awan bergerak lebih tinggi", "Proses penyejatan terhenti"], correct: 1 },
    { question: "Apakah struktur pada daun tumbuhan yang membenarkan proses transpirasi berlaku?", options: ["Klorofil", "Akar", "Stoma", "Batang"], correct: 2 },
    { question: "Air hujan yang jatuh ke tanah dan mengalir di atas permukaan bumi menuju ke sungai atau laut dipanggil...", options: ["Air bawah tanah", "Aliran air permukaan", "Air kumbahan", "Air suling"], correct: 1 },
    { question: "Antara berikut, faktor manakah yang boleh MENINGKATKAN kadar penyejatan air?", options: ["Suhu persekitaran yang rendah", "Kelembapan udara yang tinggi", "Kawasan yang terlindung dari angin", "Suhu persekitaran yang tinggi dan berangin"], correct: 3 },
    { question: "Apakah kepentingan utama kitaran air semulajadi kepada hidupan di Bumi?", options: ["Mengekalkan bekalan air bersih dan menyejukkan suhu bumi", "Menjadikan air laut tawar", "Menghalang berlakunya kemarau sepenuhnya", "Membekalkan gas oksigen ke dalam air"], correct: 0 }
];

let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 30;
let hasAnswered = false;
let audioPlaying = false;

// Fungsi Navigasi Antara Skrin (Kriteria Panduan)
function switchScreen(screenId) {
    clearInterval(timerInterval);
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

// Simulasi Interaktiviti Suara (Kriteria Audio)
function toggleAudio() {
    audioPlaying = !audioPlaying;
    const btn = document.getElementById('audio-btn');
    btn.innerText = audioPlaying ? "🔇 Matikan Bunyi Latar" : "🔊 Pasang Bunyi Latar";
    // Di aplikasi nyata, Anda bisa menambahkan: new Audio('bg.mp3').play()
}

// Fungsi Hyperlink Pop-up Modal (Kriteria Hypertext)
function openHyperlinkModal() { document.getElementById('hyperlink-modal').classList.remove('hidden'); }
function closeHyperlinkModal() { document.getElementById('hyperlink-modal').classList.add('hidden'); }

function startQuiz() {
    switchScreen('quiz-screen');
    currentQuestionIndex = 0;
    score = 0;
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
    
    document.getElementById('question-number').innerText = Soalan ${currentQuestionIndex + 1}/${quizData.length};
    
    const currentQuestion = quizData[currentQuestionIndex];
    document.getElementById('question-text').innerText = currentQuestion.question;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    const optionLetters = ['A', 'B', 'C', 'D'];
    currentQuestion.
[27/6/2026 11:13 PM] Afiq: options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = "option-btn";
        button.innerHTML = <span class="option-badge">${optionLetters[index]}</span> <span>${option}</span>;
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
        disableOptions();
        highlightCorrectAnswer(quizData[currentQuestionIndex].correct);
        showFeedback("Masa tamat! ⏰", "text-wrong");
    }
}

function selectOption(selectedIndex, selectedButton) {
    if (hasAnswered) return;
    hasAnswered = true;
    clearInterval(timerInterval);
    disableOptions();

    const currentQuestion = quizData[currentQuestionIndex];

    if (selectedIndex === currentQuestion.correct) {
        score++;
        selectedButton.classList.add('correct-answer');
        showFeedback("Syabas! Jawapan anda BETUL. 🎉", "text-correct");
    } else {
        selectedButton.classList.add('wrong-answer');
        highlightCorrectAnswer(currentQuestion.correct);
        showFeedback("Salah! Jangan putus asa, cuba lagi.", "text-wrong");
    }
    document.getElementById('next-btn').classList.remove('hidden');
}

function showFeedback(text, className) {
    const feedback = document.getElementById('feedback');
    feedback.innerText = text;
    feedback.classList.remove('hidden');
    feedback.classList.add(className);
}

function highlightCorrectAnswer(correctIndex) {
    const buttons = document.getElementsByClassName('option-btn');
    if (buttons[correctIndex]) buttons[correctIndex].classList.add('correct-answer');
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
    if (score >= 8) comment.innerText = "Hebat! Anda sangat memahami Kitaran Air Semulajadi. 🌟";
    else if (score >= 5) comment.innerText = "Tahniah! Anda lulus, tingkatkan usaha lagi ya. 👍";
    else comment.innerText = "Cuba lagi! Sila baca semula nota modul Kitaran Air. 📚";
}