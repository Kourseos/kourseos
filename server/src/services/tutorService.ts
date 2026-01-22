import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import prisma from '../config/db';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODEL = 'llama3-8b-8192';

export const getTutorResponse = async (courseId: string, userMessage: string) => {
    // 1. Retrieve course content
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            modules: {
                include: {
                    lessons: true
                }
            }
        }
    });

    if (!course) {
        throw new Error('Course not found');
    }

    // 2. Construct Context
    let context = `Course Title: ${course.title}\nDescription: ${course.description}\n\nContent:\n`;

    course.modules.forEach((module: any) => {
        module.lessons.forEach((lesson: any) => {
            context += `Lesson: ${lesson.title}\nContent: ${lesson.content}\n\n`;
        });
    });

    // 3. Prompt Engineering
    const prompt = `
    Eres un Tutor de IA para el curso "${course.title}".
    Tu objetivo es ayudar al estudiante a entender el material basado en el contenido del curso proporcionado.
    
    Contexto del Curso:
    ${context}

    Pregunta del Estudiante: "${userMessage}"

    Instrucciones:
    - Responde a la pregunta usando SOLO el contexto proporcionado.
    - Si la respuesta no está en el contexto, di "Lo siento, pero ese tema no está cubierto en este curso."
    - Sé alentador y útil.
    - Mantén las respuestas concisas pero informativas.
    - IMPORTANTE: RESPONDE SIEMPRE EN ESPAÑOL.
  `;

    try {
        console.log('[TUTOR SERVICE] Usando Groq para respuesta del tutor...');

        // Intentar con Groq primero
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: GROQ_MODEL,
            temperature: 0.7,
        });

        console.log('Respuesta de Groq (Tutor):', chatCompletion);

        const reply = chatCompletion.choices[0]?.message?.content;

        if (!reply) {
            throw new Error('No response from Groq');
        }

        // 4. Optimization Agent (Phase 3) - Execute in background
        analyzeAndSaveOptimization(courseId, context, userMessage).catch(err =>
            console.error('[OPTIMIZATION AGENT] Error:', err)
        );

        return reply;
    } catch (groqError) {
        console.error('[TUTOR SERVICE] Error con Groq, intentando con Gemini...', groqError);

        try {
            // Fallback a Gemini si Groq falla
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const reply = response.text();

            // Optimization Agent
            analyzeAndSaveOptimization(courseId, context, userMessage).catch(err =>
                console.error('[OPTIMIZATION AGENT] Error:', err)
            );

            return reply;
        } catch (error) {
            console.error('[TUTOR SERVICE] Error generando respuesta con ambos servicios:', error);
            throw new Error('Failed to generate response');
        }
    }
};

/**
 * Agente de Optimización: Analiza si la pregunta del usuario revela vacíos en el contenido.
 */
async function analyzeAndSaveOptimization(courseId: string, context: string, userMessage: string) {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    Analiza esta interacción para mejorar el curso.
    Contenido Actual del Curso:
    ${context}
    
    Pregunta del Estudiante: "${userMessage}"
    
    ¿Revela esta pregunta una falta de información (CONTENT_GAP), una explicación confusa (CONFUSING_EXPLANATION) o un error ortográfico/técnico (TYPO)?
    Responde SOLO con este formato JSON:
    {
      "needsOptimization": boolean,
      "type": "CONTENT_GAP" | "CONFUSING_EXPLANATION" | "TYPO" | "NONE",
      "suggestion": "string con la sugerencia de mejora"
    }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const analysis = JSON.parse(text);

    if (analysis.needsOptimization && analysis.type !== 'NONE') {
        console.log(`[OPTIMIZATION AGENT] Sugerencia detectada para curso ${courseId}: ${analysis.type}`);
        await prisma.optimizationSuggestion.create({
            data: {
                courseId,
                type: analysis.type,
                suggestion: analysis.suggestion,
                context: userMessage
            }
        });
    }
}
