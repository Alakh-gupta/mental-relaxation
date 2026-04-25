const express = require('express');
const cors = require('cors');
const path = require('path');
const Sentiment = require('sentiment');

const app = express();
const port = process.env.PORT || 3000;
const sentiment = new Sentiment();

// Middleware
app.use(cors());
app.use(express.json());
// Serve static frontend files from this directory
app.use(express.static(__dirname));

// Quotes database for personalized responses
const quotes = {
  negative: [
    "Storms don't last forever. Neither do thoughts.",
    "It's okay to feel overwhelmed. Breathe through it.",
    "Letting go is healing. You are safe here."
  ],
  positive: [
    "Hold onto this joy. You deserve it.",
    "Every bright thought is a step to a happier you.",
    "Your positive energy is contagious."
  ],
  neutral: [
    "Breathe in peace. Breathe out chaos.",
    "You did something good for yourself today.",
    "Every thought dumped is a step to clarity."
  ]
};

function getRandomQuote(category) {
  const list = quotes[category] || quotes.neutral;
  return list[Math.floor(Math.random() * list.length)];
}

// Basic NLP endpoint for analyzing a thought
app.post('/api/analyze-thought', (req, res) => {
  const { thought } = req.body;

  if (!thought) {
    return res.status(400).json({ error: 'Thought is required' });
  }

  // Run natural language sentiment analysis
  const result = sentiment.analyze(thought);
  const score = result.score;

  let category = 'neutral';
  let suggestedMood = 'rain'; // default

  if (score < -1) {
    category = 'negative';
    suggestedMood = 'fireplace'; // Fireplace might be more comforting for negative
  } else if (score > 1) {
    category = 'positive';
    suggestedMood = 'forest'; // Upbeat nature sound
  }

  const responseQuote = getRandomQuote(category);

  res.json({
    originalThought: thought,
    sentimentScore: score,
    category: category,
    quote: responseQuote,
    suggestedMood: suggestedMood
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
