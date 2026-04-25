const dumpBtn = document.getElementById("dumpBtn");
const thoughtInput = document.getElementById("thoughtInput");
const output = document.getElementById("output");
const quote = document.getElementById("quote");
const ytFrame = document.getElementById("ytFrame");
const breatheText = document.getElementById("breatheText");
const moodSelector = document.getElementById("moodSelector");
const moodButtons = document.querySelectorAll(".mood-btn");
const auraText = document.getElementById("auraText");

// Pre-dump motivational quotes
const preDumpQuotes = [
  "Your mind is a galaxy 🌌. Let's clear the stardust and find your peace ✨.",
  "Pour your heavy thoughts into this digital jar 🏺. We'll carry them for you 🦋.",
  "You don't have to weather the storm alone ⛈️. Let the rain wash it away 🌧️.",
  "Breathe in courage 🦁, breathe out doubt 💨. The canvas is yours 🎨.",
  "Unspool the tangled threads of today 🧶. Tomorrow is a fresh start 🌅.",
  "Drop the invisible backpack 🎒. It's okay to rest here 🛋️ ☕.",
  "Let your worries float away like paper lanterns in the night sky 🏮 🪁."
];
const quoteEl = document.getElementById("motivationalQuote");
quoteEl.classList.add("quote-animate");

function updateQuote() {
  quoteEl.textContent = preDumpQuotes[Math.floor(Math.random() * preDumpQuotes.length)];
}
updateQuote();
setInterval(updateQuote, 5000);

// Mood-based YouTube video IDs
const moodAudio = {
  rain: "cljv53Wvnx4",
  fireplace: "eyU3bRy2x44",
  forest: "1wn-OSiNVjE"
};

let selectedMood = "rain"; // Default

// Mood selection logic
moodButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    moodButtons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedMood = btn.dataset.mood;
  });
});

// Breathing phases
const phases = ["Inhale...", "Hold...", "Exhale...", "Hold..."];
let phaseIndex = 0;

// Quotes for post-dump encouragement
const quotes = [
  "Breathe in peace. Breathe out chaos.",
  "You did something good for yourself today.",
  "Every thought dumped is a step to clarity.",
  "Letting go is healing.",
  "Storms don’t last forever. Neither do thoughts."
];

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function displayQuoteAnimated(text) {
  quote.innerHTML = "";
  text.split(" ").forEach((word, idx) => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    span.style.opacity = "0";
    span.style.animation = `fadeIn 0.5s forwards`;
    span.style.animationDelay = `${idx * 0.3}s`;
    quote.appendChild(span);
  });
}

// Modal to ask user if they want a body relaxation session
function askForBodyScan() {
  const confirmBox = document.createElement("div");
  confirmBox.classList.add("modal");
  confirmBox.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
      <p style="font-size: 1.2rem; color: #333;">Would you like to continue with a mini body relaxation session?</p>
      <button id="yesBtn" style="margin: 10px;">Yes</button>
      <button id="noBtn" style="margin: 10px;">No</button>
    </div>
  `;
  document.body.appendChild(confirmBox);

  document.getElementById("yesBtn").addEventListener("click", () => {
    window.location.href = "relax.html"; // Redirect to relax page
  });

  document.getElementById("noBtn").addEventListener("click", () => {
    confirmBox.remove();
  });
}

// On "Dump" click: handle thought, show quote, start breathing
dumpBtn.addEventListener("click", async () => {
  const thought = thoughtInput.value.trim();
  if (!thought) {
    alert("Please write something first.");
    return;
  }

  dumpBtn.disabled = true;
  thoughtInput.disabled = true;

  try {
    // Send thought to NLP backend
    const response = await fetch('/api/analyze-thought', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thought })
    });

    if (!response.ok) throw new Error('API failed');
    const data = await response.json();

    // Change mood based on NLP suggestion if applicable
    if (data.category !== 'neutral') {
      selectedMood = data.suggestedMood;
    }

    const badge = document.getElementById('nlpMoodBadge');
    const scoreText = document.getElementById('nlpScoreText');
    badge.textContent = data.category.toUpperCase();
    if (data.category === 'positive') {
      badge.style.backgroundColor = '#d4edda';
      badge.style.color = '#155724';
    } else if (data.category === 'negative') {
      badge.style.backgroundColor = '#f8d7da';
      badge.style.color = '#721c24';
    } else {
      badge.style.backgroundColor = '#e2e3e5';
      badge.style.color = '#383d41';
    }
    scoreText.textContent = `Sentiment Score: ${data.sentimentScore}`;

    // Hide mood UI
    moodSelector.style.display = "none";
    auraText.style.display = "none";

    // Load appropriate relaxing audio
    const videoId = moodAudio[selectedMood];
    ytFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`;

    // Animate and transition
    thoughtInput.style.animation = "fadeOut 1s forwards";

    setTimeout(() => {
      document.body.classList.add("calm");
      thoughtInput.classList.add("hidden");
      dumpBtn.classList.add("hidden");
      output.classList.remove("hidden");

      // Use personalized NLP quote
      displayQuoteAnimated(data.quote);

      // 🔄 Start 1-minute breathing animation
      let breatheCount = 0;
      // Bind interval so we can clear it on exit
      window.breatheInterval = setInterval(() => {
        breatheText.textContent = phases[phaseIndex];
        phaseIndex = (phaseIndex + 1) % phases.length;
        breatheCount++;

        if (breatheCount === 20) { // 20 phases x 3s = 60s
          clearInterval(window.breatheInterval);
          askForBodyScan(); // After 1 minute, prompt user
        }
      }, 3000);
    }, 1000);
  } catch (err) {
    console.error('NLP Backend unavailable, using local fallback', err);
    moodSelector.style.display = "none";
    auraText.style.display = "none";
    const videoId = moodAudio[selectedMood];
    ytFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`;
    thoughtInput.style.animation = "fadeOut 1s forwards";
    setTimeout(() => {
      document.body.classList.add("calm");
      thoughtInput.classList.add("hidden");
      dumpBtn.classList.add("hidden");
      output.classList.remove("hidden");
      displayQuoteAnimated(getRandomQuote());
      let breatheCount = 0;
      window.breatheInterval = setInterval(() => {
        breatheText.textContent = phases[phaseIndex];
        phaseIndex = (phaseIndex + 1) % phases.length;
        breatheCount++;
        if (breatheCount === 20) {
          clearInterval(window.breatheInterval);
          askForBodyScan();
        }
      }, 3000);
    }, 1000);
  } finally {
    dumpBtn.disabled = false;
    thoughtInput.disabled = false;
  }
});

// Exit Main flow and reset to start
document.getElementById("exitMainBtn").addEventListener("click", () => {
  // Clear the breathing interval if it's running
  if (window.breatheInterval) clearInterval(window.breatheInterval);
  
  // Stop YouTube background audio
  ytFrame.src = "";
  
  // Reset UI
  document.body.classList.remove("calm");
  output.classList.add("hidden");
  
  thoughtInput.value = "";
  thoughtInput.style.animation = "";
  thoughtInput.classList.remove("hidden");
  
  dumpBtn.classList.remove("hidden");
  moodSelector.style.display = "flex"; // Assuming flex is appropriate, or block
  auraText.style.display = "block";
});