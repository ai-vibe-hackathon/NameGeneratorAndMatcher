require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testMatch() {
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDMwSMa8zIxv7EZwf9x0e_R8A9ZVRnDvtE";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const name1 = "Romeo";
    const name2 = "Juliet";

    const prompt = `Analyze the compatibility between the names "${name1}" and "${name2}".
        Consider phonetics, meaning, cultural origin, and numerology.
        
        Return ONLY a JSON object with the following keys:
        - score: number (0-100)
        - message: string (a short, mystical summary of their connection)
        - details: array of strings (3-4 bullet points explaining the match factors)
        
        Example: {"score": 85, "message": "A harmonious blend of strength and grace.", "details": ["Phonetically complementary", "Shared roots in Latin", "Numerology indicates strong partnership"]}`;

    console.log(`Testing match for ${name1} and ${name2}...`);
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Raw Response:", text);

        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);
        console.log("Parsed Data:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

testMatch();
