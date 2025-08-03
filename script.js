const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

const modal = document.getElementById("howToPlayModal");
const btn = document.getElementById("howToPlayBtn");
const span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modal.style.display = "block";
}

 span.onclick = function () {
   modal.style.display = "none";
 }

 window.onclick = function (event) {
   if (event.target == modal) {
     modal.style.display = "none";
   }
}

// 💾 Sample Question Bank
const questionBank = {
  level1: [
    { puzzle: "M _ N _ O", answer: "MANGO", clue: "Tropical fruit often used in smoothies" },
    { puzzle: "A _ _ L E", answer: "APPLE", clue: "Keeps the doctor away, they say" },
    { puzzle: "G R _ _ E", answer: "GRAPE", clue: "Often turned into wine" },
    { puzzle: "B _ _ A N A", answer: "BANANA", clue: "I am yellow" },
    { puzzle: "P _ _ C H", answer: "PEACH", clue: "Fuzzy fruit with a pit" }
  ],
  level2: [
    { puzzle: "C _ R _ _ T", answer: "CARROT", clue: "Vegetable" },
    { puzzle: "C _ _ U M B _ R", answer: "CUCUMBER", clue: "Green veggie" },
    { puzzle: "T _ M _T _", answer: "TOMATO", clue: "Often red" },
    { puzzle: "O _ _ _ N", answer: "ONION", clue: "It makes you cry" },
    { puzzle: "B _ _ _ C _ _ I", answer: "BROCCOLI", clue: "Green and healthy" }
  ],
  level3: [
    { puzzle: "K _ _ _ A", answer: "KENYA", clue: "African country" },
    { puzzle: "C _ _ _ A", answer: "CHINA", clue: "Known for the Great Wall" },
    { puzzle: "J _ _ _ N", answer: "JAPAN", clue: "Famous for Mount Fuji" },
    { puzzle: "E _ _ _ _ T", answer: "EGYPT", clue: "Land of pyramids" },
    { puzzle: "B _ _ _ _ L", answer: "BRAZIL", clue: "Hosts the Amazon Rainforest" }
  ],
  level4: [
    { puzzle: "W _ _ _ G", answer: "WRONG", clue: "Opposite of correct" },
    { puzzle: "J _ _ _ S", answer: "JOKES", clue: "Funny things" },
    { puzzle: "C _ _ _ _ R", answer: "CODER", clue: "Crafts software with lines of code" },
    { puzzle: "I _ _ _ A", answer: "IDEA", clue: "Born in the mind" },
    { puzzle: "A _ _ _ M", answer: "ALARM", clue: "Wakes you up" }
  ],
  level5: [
     { puzzle: "Q _ _ _ _ S", answer: "QUOTES", clue: "Wise sayings" },
    { puzzle: "F _ _ _ _ E", answer: "FUTURE", clue: "What comes next" },
    { puzzle: "M _ _ _ _ Y", answer: "MEMORY", clue: "Stored in your brain" },
    { puzzle: "S _ _ _ _ E", answer: "SOURCE", clue: "Where it comes from" },
    { puzzle: "I _ _ _ _ N", answer: "INTERN", clue: "Learns on the job" }
  ]
};

// 🧠 IQ milestones
const milestones = [
  { name: "Your English Teacher", score: 80 },
  { name: "Jensen Huang", score: 120 },
  { name: "Mark Zuckerberg", score: 136 },
  { name: "Elon Musk", score: 156 },
  { name: "Albert Einstein", score: 160 }
];

let currentLevel = 1;
let questionIndex = 0;
let score = 0;
let cluesLeft = 3;
let timer;
let timeLeft = 20;
let reachedMilestones = new Set();

// 🔁 Load first question
function loadQuestion() {
  clearInterval(timer);
  timeLeft = 20;
  document.getElementById("timer").textContent = `⏱️ Time: ${timeLeft}s`;
  const levelKey = `level${currentLevel}`;
  const questionSet = questionBank[levelKey];
  if (!questionSet || questionIndex >= questionSet.length) {
    nextLevel();
    return;
  }
  const q = questionSet[questionIndex];
  document.getElementById("puzzle-box").textContent = q.puzzle;
  document.getElementById("clue").textContent = "Clue: ";
  document.getElementById("feedback").textContent = "";
  document.getElementById("answer-input").value = "";
  document.getElementById("level-info").textContent = `Level ${currentLevel}`;
  document.getElementById("clue-btn").textContent = `Use Clue (${cluesLeft} left)`;
  startTimer();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `⏱️ Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      questionIndex++;
      loadQuestion();
    }
  }, 1000);
}

function submitAnswer() {
  clearInterval(timer);
  const levelKey = `level${currentLevel}`;
  const currentQ = questionBank[levelKey][questionIndex];
  const userAnswer = document.getElementById("answer-input").value.trim().toUpperCase();

  if (userAnswer === currentQ.answer) {
    const points = getPointsForLevel(currentLevel);
    score += points;
    document.getElementById("feedback").textContent = `✅ Correct! +${points} IQ`;
    correctSound.play();  // 🔊 Play correct sound
  } else {
    document.getElementById("feedback").textContent = `❌ Wrong! Correct answer was ${currentQ.answer}`;
    wrongSound.play();    // 🔊 Play wrong sound
  }

  updateScoreBar();
  questionIndex++;
  setTimeout(loadQuestion, 1500);

  const prevHigh = localStorage.getItem("highScore") || 0;
  if (score > prevHigh) {
    localStorage.setItem("highScore", score);
  }
}

function getPointsForLevel(level) {
  switch (level) {
    case 1: return 2;
    case 2: return 4;
    case 3: return 6;
    case 4: return 8;
    case 5: return 12;
    default: return 0;
  }
}

function useClue() {
  if (cluesLeft > 0) {
    const levelKey = `level${currentLevel}`;
    const q = questionBank[levelKey][questionIndex];
    document.getElementById("clue").textContent = `Clue: ${q.clue}`;
    cluesLeft--;
    document.getElementById("clue-btn").textContent = `Use Clue (${cluesLeft} left)`;
  } else {
    alert("No clues left!");
  }
}

function updateScoreBar() {
  const bar = document.getElementById("iq-bar");
  const percent = (score / 160) * 100;
  bar.querySelector("::after")?.remove();
  bar.innerHTML = `<div style="width:${percent}%;height:100%;background:#3cb371;"></div>`;
  document.getElementById("score").textContent = `IQ: ${score}`;

 const milestone = milestones.find(m => score >= m.score && !reachedMilestones.has(m.name));
  if (milestone) {
    document.getElementById("milestone-msg").textContent = `🎉 You beat ${milestone.name}'s IQ!`;
    reachedMilestones.add(milestone.name);
  }
}

function nextLevel() {
  if (currentLevel >= 5) {
    endGame();
    return;
  }
  currentLevel++;
  questionIndex = 0;
  cluesLeft = 3;
  loadQuestion();
}

function endGame() {
  document.body.innerHTML = `
    <div class="game-container">
      <h1>Game Over 🎓</h1>
      <p>Your Final IQ Score: <strong>${score}</strong></p>
      <p>${finalCongratulation(score)}</p>
      <p>🏅 Your Highest IQ Score: ${localStorage.getItem("highScore")}</p>
      <button onclick="retryGame()">🔁 Retry Game</button>
    </div>
  `;
}

function finalCongratulation(score) {
  if (score >= 160) return "🧠 You’ve matched Einstein! Legendary IQ!";
  if (score >= 156) return "🚀 You passed Elon Musk IQ! Genius!";
  if (score >= 136) return "📘 You passed Zuckerberg IQ! Impressive!";
  if (score >= 120) return "⚙️ You passed Jensen Huang IQ! Smart!";
  if (score >= 80) return "📐 You passed your English Teacher IQ!";
  return "Keep trying! Practice makes perfect!";
}

function retryGame() {
  currentLevel = 1;
  score = 0;
  questionIndex = 0;
  cluesLeft = 3;
  timeLeft = 20;
  reachedMilestones.clear();

  // Reset the body content
  location.reload(); // simple way to reset everything
}

function startGame() {
  document.getElementById("start-screen").style.display = "none";
  document.querySelector(".game-container").style.display = "block";
  loadQuestion();
}
