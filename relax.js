// Twinkling Stars Generator
const starField = document.getElementById('starField');

for (let i = 0; i < 200; i++) {
  const star = document.createElement('div');
  star.classList.add('star');
  star.style.top = `${Math.random() * 100}%`;
  star.style.left = `${Math.random() * 100}%`;
  star.style.animationDelay = `${Math.random() * 5}s`;
  starField.appendChild(star);
}

// Relaxation Script
const relaxText = document.getElementById("relaxText");
const bgMusic = document.getElementById("bgMusic");

const relaxSteps = [
  "Gently close your eyes...",
  "Take a slow deep breath in...",
  "And slowly breathe out...",
  "Bring awareness to your toes and feet...",
  "Relax your legs and knees...",
  "Soften your belly and lower back...",
  "Drop your shoulders and relax your arms...",
  "Let your face soften completely...",
  "Feel your body sinking into calm...",
  "You are safe. You are calm. You are enough. 🌿"
];

let index = 0;

// Softly play background music
bgMusic.volume = 0.3; // Low volume for gentle feel
bgMusic.play();

// Function to speak text softly
function speakText(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);

  utterance.rate = 0.9;
  utterance.pitch = 1.2;
  utterance.volume = 1;

  const voices = synth.getVoices();
  const softVoice = voices.find(v =>
    v.name.includes("Female") ||
    v.name.includes("Google UK English Female") ||
    v.name.includes("Microsoft Zira") ||
    v.lang === "en-GB"
  );

  if (softVoice) {
    utterance.voice = softVoice;
  }

  synth.speak(utterance);
}

// Ensure voices are loaded before starting
if (speechSynthesis.getVoices().length === 0) {
  speechSynthesis.onvoiceschanged = () => {
    showStep();
  };
} else {
  showStep();
}

// Function to show current step and speak it
function showStep() {
  if (index < relaxSteps.length) {
    const step = relaxSteps[index];
    relaxText.textContent = step;
    speakText(step);
    index++;
    setTimeout(showStep, 12000); // 12s per step
  } else {
    relaxText.textContent += "\n\n🌈 Session Complete. Take your time.";
    speakText("Your relaxation session is complete. Would you like to start again?");
    askRestart();
  }
}

// Ask user to restart or end
function askRestart() {
  setTimeout(() => {
    // Show buttons instead of alert
    document.getElementById("restartOptions").style.display = "flex";
  }, 3000);
}

// Button Event Listeners
document.getElementById("startAgainBtn").addEventListener("click", () => {
  document.getElementById("restartOptions").style.display = "none";
  relaxText.style.display = "block";
  index = 0;
  showStep();
});

document.getElementById("exitBtn").addEventListener("click", () => {
  document.getElementById("restartOptions").style.display = "none";
  const goodbye = "Take this peace with you. You are strong. You are loved. 🌟";
  relaxText.textContent = goodbye;
  relaxText.style.display = "block";
  speakText(goodbye);
  bgMusic.pause(); // Stop music when ending
});