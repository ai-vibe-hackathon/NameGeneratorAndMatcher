require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testChinese() {
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDMwSMa8zIxv7EZwf9x0e_R8A9ZVRnDvtE";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `Generate 5 unique names of Chinese origin. 
        Return ONLY a JSON array of objects with keys: name, gender, origin, meaning, themes (array of strings). 
        Example: [{"name": "Name", "gender": "male", "origin": "Origin", "meaning": "Meaning", "themes": ["Theme1"]}]`;

    console.log("Sending prompt for Chinese names...");
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

testChinese();
