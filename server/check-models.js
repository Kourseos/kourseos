const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    try {
        // Note: There isn't a direct listModels in the JS SDK in the same way as the REST API, 
        // but we can try to hit the endpoint manually or check the version.
        // Actually, let's just try the 2.0 models which are the current ones.
        const modelsToTest = [
            'gemini-2.0-flash-exp',
            'gemini-1.5-flash',
            'gemini-1.5-pro-002',
            'gemini-1.5-flash-002',
            'gemini-1.0-pro'
        ];

        for (const modelName of modelsToTest) {
            console.log(`\n--- Testing Model: ${modelName} ---`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hola");
                console.log('Response:', result.response.text());
                console.log('✅ SUCCESS');
            } catch (error) {
                console.error('❌ FAILED:', error.message);
            }
        }
    } catch (e) {
        console.error(e);
    }
}

listModels();
