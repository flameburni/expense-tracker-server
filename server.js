const fetch = require("node-fetch");
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/advice", async (req, res) => {
  const expenses = req.body.expenses;

  const prompt = `Here are my recent expenses: ${JSON.stringify(expenses)}. 
  Based on these expenses, give me brief, practical advice on my spending habits and which items I should prioritize buying first if I have limited money. Keep it friendly and under 150 words.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { 
  "Content-Type": "application/json",
  "Accept-Encoding": "identity"
},
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const advice = data.candidates[0].content.parts[0].text;
    res.json({ advice });
  } catch (error) {
    res.status(500).json({ error: "Failed to get advice" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
