require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testTeamGen() {
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDMwSMa8zIxv7EZwf9x0e_R8A9ZVRnDvtE";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const keywords = "coding, speed, future";
    const vibe = "Edgy";

    const prompt = `Generate 10 creative team names based on the following keywords: "${keywords}" and vibe: "${vibe}".
        
        IMPORTANT FORMATTING RULES:
        1. Return ONLY a JSON array of objects.
        2. Keys: name, meaning.
        3. Example: [{"name": "Code Wizards", "meaning": "Masters of the digital realm"}, {"name": "Velocity Vipers", "meaning": "Striking fast and hard"}]`;

    console.log(`Testing team generation for keywords: "${keywords}" and vibe: "${vibe}"...`);
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

testTeamGen();
