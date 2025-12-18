require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDMwSMa8zIxv7EZwf9x0e_R8A9ZVRnDvtE";
    console.log("Testing with API Key ending in:", apiKey ? apiKey.slice(-4) : "None");

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const modelName = "gemini-2.5-flash-lite";
        console.log(`Testing generation with model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("Success! Response:", response.text());
    } catch (error) {
        console.error("Error testing generation:", error.message);
    }
}

test();
