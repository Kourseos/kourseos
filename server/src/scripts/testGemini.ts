const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
    const key = process.env.GEMINI_API_KEY;
    console.log('Testing Key:', key ? key.substring(0, 5) + '...' : 'MISSING');

    const genAI = new GoogleGenerativeAI(key);
    const modelsToTest = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];

    for (const modelName of modelsToTest) {
        console.log(`\n--- Testing Model: ${modelName} ---`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Dime hola en una palabra.");
            console.log('Response:', result.response.text());
            console.log('✅ SUCCESS');
        } catch (error: any) {
            console.error('❌ FAILED:', error.message);
        }
    }
}

testGemini();
