import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;

    console.log('--- LISTADO DE MODELOS DISPONIBLES ---');
    if (!apiKey) {
        console.error('❌ No se encontró GEMINI_API_KEY');
        process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // Usar la API REST directamente para listar modelos
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            console.error(`❌ Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error(text);
            process.exit(1);
        }

        const data = await response.json();

        console.log('\n✅ Modelos disponibles para generateContent:\n');

        if (data.models) {
            data.models.forEach((model: any) => {
                const name = model.name.replace('models/', '');
                const supportedMethods = model.supportedGenerationMethods || [];

                if (supportedMethods.includes('generateContent')) {
                    console.log(`  ✓ ${name}`);
                    console.log(`    Display Name: ${model.displayName}`);
                    console.log(`    Description: ${model.description}`);
                    console.log('');
                }
            });
        }

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    }
}

listModels();
