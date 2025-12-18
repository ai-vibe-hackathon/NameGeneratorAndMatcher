require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const names = require('./names.json');
const { calculateMatch } = require('./matchAlgorithm');

const app = express();
const PORT = 3000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });



app.use(cors());
app.use(express.json());

// Get all names with optional filters (Local DB)
app.get('/api/names', (req, res) => {
    const { gender, origin, search, theme, length, firstLetter } = req.query;

    let results = names;

    if (gender) {
        results = results.filter(n => n.gender.toLowerCase() === gender.toLowerCase());
    }

    if (origin) {
        results = results.filter(n => n.origin.toLowerCase() === origin.toLowerCase());
    }

    if (search) {
        results = results.filter(n => n.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (theme) {
        results = results.filter(n => n.themes && n.themes.includes(theme));
    }

    if (length) {
        results = results.filter(n => {
            const len = n.name.length;
            if (length === 'short') return len >= 2 && len <= 4;
            if (length === 'medium') return len >= 5 && len <= 7;
            if (length === 'long') return len >= 8;
            return true;
        });
    }

    if (firstLetter) {
        results = results.filter(n => n.name.toLowerCase().startsWith(firstLetter.toLowerCase()));
    }

    res.json(results);
});

// Generate names using AI
app.post('/api/generate', async (req, res) => {
    try {
        const { gender, origin, theme, length, firstLetter } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "API Key not configured" });
        }

        const prompt = `Generate 40 unique ${gender || ''} names${origin ? ` of ${origin} origin` : ''}${theme ? ` with a ${theme} theme` : ''}. 
        ${length ? `Length should be ${length}.` : ''}
        ${firstLetter ? `Must start with letter '${firstLetter}'.` : ''}
        
        IMPORTANT FORMATTING RULES:
        1. Return ONLY a JSON array of objects.
        2. Keys: name, gender, origin, meaning, themes (array of strings).
        3. If origin is "Chinese", the "name" field MUST be in the format "Pinyin (Chinese Characters)" (e.g., "Wei (伟)").
        4. Example: [{"name": "Wei (伟)", "gender": "male", "origin": "Chinese", "meaning": "Great", "themes": ["Strong"]}]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const generatedNames = JSON.parse(jsonStr);

        // Add IDs
        const namesWithIds = generatedNames.map((n, i) => ({ ...n, id: `ai-${Date.now()}-${i}` }));

        res.json(namesWithIds);
    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ error: "Failed to generate names" });
    }
});

// Calculate match
app.post('/api/match', async (req, res) => {
    const { name1, name2 } = req.body;

    if (!name1 || !name2) {
        return res.status(400).json({ error: "Both names are required" });
    }

    try {
        const prompt = `Analyze the compatibility between the names "${name1}" and "${name2}".
        Consider phonetics, meaning, cultural origin, and numerology.
        
        Return ONLY a JSON object with the following keys:
        - score: number (0-100)
        - message: string (a short, mystical summary of their connection)
        - details: array of strings (3-4 bullet points explaining the match factors)
        
        Example: {"score": 85, "message": "A harmonious blend of strength and grace.", "details": ["Phonetically complementary", "Shared roots in Latin", "Numerology indicates strong partnership"]}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const matchData = JSON.parse(jsonStr);

        res.json(matchData);
    } catch (error) {
        console.error("AI Match Error:", error);
        res.status(500).json({ error: "Failed to calculate match" });
    }
});

// Generate team names
app.post('/api/team-names', async (req, res) => {
    try {
        const { keywords, vibe } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "API Key not configured" });
        }

        const prompt = `Generate 10 creative team names based on the following keywords: "${keywords}" and vibe: "${vibe}".
        
        IMPORTANT FORMATTING RULES:
        1. Return ONLY a JSON array of objects.
        2. Keys: name, meaning.
        3. Example: [{"name": "Code Wizards", "meaning": "Masters of the digital realm"}, {"name": "Velocity Vipers", "meaning": "Striking fast and hard"}]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const generatedNames = JSON.parse(jsonStr);

        res.json(generatedNames);
    } catch (error) {
        console.error("AI Team Generation Error:", error);
        res.status(500).json({ error: "Failed to generate team names" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
