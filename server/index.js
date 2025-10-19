// Minimal Express server to proxy Gemini API calls securely
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY in .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// POST /ai { prompt: string }
app.post('/ai', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ text });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`AI proxy server running on http://localhost:${PORT}`);
});
