import Groq from 'groq-sdk';
import i18next from 'i18next';
import dotenv from 'dotenv';

dotenv.config();

console.log('[ENV CHECK] GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
if (process.env.GROQ_API_KEY) {
  console.log('[ENV CHECK] GROQ_API_KEY prefix:', process.env.GROQ_API_KEY.substring(0, 5));
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODEL = 'llama3-8b-8192';
export const BRAND_NAME = 'Lernyx';

export const generateCurriculum = async (topic: string, userPrompt?: string) => {
  console.log(`[AI SERVICE - GROQ] Generando curso para: ${topic}`);

  try {
    const prompt = `
            Eres el motor de IA de ${BRAND_NAME}. Genera un curso de NANO LEARNING sobre: "${topic}".
            Idioma: ${i18next.language || 'Español'}.
            ${userPrompt ? `REQUERIMIENTO PERSONALIZADO: "${userPrompt}"` : ''}
            
            REGLAS CRÍTICAS DE NANO LEARNING:
            1. Responde ÚNICAMENTE con un objeto JSON válido.
            2. Cada lección debe ser un "Átomo de conocimiento" de máximo 300 palabras (3 min de lectura).
            3. Estructura: 4 módulos, 3 lecciones por módulo.
            4. IMPORTANTE: Responde UNICAMENTE con el JSON. No incluyas explicaciones, ni texto antes o después del JSON.
            5. Formato de Contenido de Lección:
               - Concepto Clave: Una frase contundente.
               - Explicación Rápida: Explicación directa y sin rellenos.
               - Acción Inmediata: Una mini-tarea práctica que se complete en <2 minutos.

            ESTRUCTURA DEL JSON:
            {
                "title": "...",
                "description": "...",
                "modules": [
                    {
                        "title": "...",
                        "lessons": [
                            { 
                                "title": "...", 
                                "concept": "Concepto clave en 1 frase",
                                "explanation": "Explicación de max 200 palabras",
                                "action": "Mini-tarea de acción inmediata",
                                "content": "Markdown combinando los 3 puntos anteriores de forma visual" 
                            }
                        ],
                        "quiz": {
                            "title": "Examen",
                            "questions": [
                                { "text": "...", "options": ["...", "..."], "correctAnswer": 0 }
                            ]
                        }
                    }
                ],
                "landingPage": {
                    "h1": "...", "h2": "...", "benefits": [], "socialProof": [], "bonuses": [], "offer": "...", "faqs": []
                },
                "emailSequence": [
                    { "subject": "...", "body": "..." }
                ]
            }
        `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: GROQ_MODEL,
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    console.log('Respuesta de Groq:', chatCompletion);

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) throw new Error('No content received from Groq');

    return JSON.parse(content);
  } catch (error: any) {
    console.error(`[AI SERVICE - GROQ] ❌ Error:`, error.message);
    throw new Error(`Fallo en la generación con Groq: ${error.message}`);
  }
};

export const generateLessonContent = async (courseTitle: string, lessonTitle: string, language: string = "Español") => {
  console.log(`[AI SERVICE - GROQ] Generando lección: ${lessonTitle}`);

  try {
    const prompt = `
            Eres el experto en Nano Learning de ${BRAND_NAME}.
            Escribe un "Átomo de conocimiento" (max 300 palabras) para la lección "${lessonTitle}" del curso "${courseTitle}".
            Idioma: ${language}.
            
            ESTRUCTURA OBLIGATORIA (JSON):
            {
                "concept": "Concepto clave en 1 frase corta y poderosa",
                "explanation": "Explicación directa usando Markdown para formato (negritas, listas), max 200 palabras",
                "action": "Mini-tarea accionable inmediata (<2 min)",
                "content": "Markdown completo integrando todo"
            }
            
            No incluyas texto fuera del JSON. Responde SOLO con el objeto JSON válido.
        `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: GROQ_MODEL,
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    console.log('Respuesta de Groq (Lección):', chatCompletion);

    const content = chatCompletion.choices[0]?.message?.content;
    return content ? JSON.parse(content) : { concept: "Error", explanation: "Error", action: "Error", content: "Error" };
  } catch (error: any) {
    console.error(`[AI SERVICE - GROQ] ⚠️ Error en lección:`, error.message);
    return { concept: "Error", explanation: "Error", action: "Error", content: "Error" };
  }
};

export const generateAdvancedLanding = async (courseSummary: string, language: string = "Español") => {
  console.log(`[AI SERVICE - GROQ] Optimizando Landing para: ${courseSummary.substring(0, 30)}...`);

  try {
    const prompt = `
            Eres un experto en Copywriting y Marketing de Respuesta Directa. 
            Basado en este esquema de curso: "${courseSummary}"
            Genera un objeto JSON para una Landing Page de ALTA CONVERSIÓN.

            EL JSON DEBE TENER:
            {
                "seoTitle": "Título persuasivo para Google (máx 60 caracteres)",
                "hero": {
                    "h1": "Titular disruptivo usando el framework Beneficio + Tiempo + Sin Dolor",
                    "h2": "Subtitular que refuerce la autoridad y la promesa única",
                    "cta": "Texto del botón de acción (ej: ¡Comenzar ahora!)"
                },
                "painPoints": [
                    { "title": "Dolor 1", "description": "Descripción del problema que resolvemos" },
                    { "title": "Dolor 2", "description": "Descripción del problema..." },
                    { "title": "Dolor 3", "description": "Descripción del problema..." }
                ],
                "benefits": [
                    { "title": "Habilidad 1", "desc": "Detalle del beneficio real" },
                    { "title": "Habilidad 2", "desc": "Detalle..." },
                    { "title": "Habilidad 3", "desc": "Detalle..." }
                ],
                "faqs": [
                    { "q": "¿Para quién es este curso?", "a": "Respuesta detallada..." },
                    { "q": "¿Necesito conocimientos previos?", "a": "Respuesta..." }
                ],
                "urgency": "Mensaje de oferta por tiempo limitado"
            }

            Idioma: ${language}.
            No incluyas explicaciones, solo el JSON.
        `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: 'Eres un copywriter experto en SaaS.' }, { role: 'user', content: prompt }],
      model: GROQ_MODEL,
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    console.log('Respuesta de Groq (Landing):', chatCompletion);

    const content = chatCompletion.choices[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch (error: any) {
    console.error(`[AI SERVICE - GROQ] ❌ Error en landing avanzada:`, error.message);
    return null;
  }
};

export const generateFinalQuiz = async (courseContent: string, language: string = "Español") => {
  console.log(`[AI SERVICE - GROQ] Generando examen final basado en contenido.`);

  try {
    const prompt = `
            Eres un evaluador académico experto. Basado en este resumen del curso: "${courseContent}"
            Genera un examen final de 6 preguntas de opción múltiple.
            
            REGLAS:
            1. Solo un objeto JSON.
            2. Cada pregunta debe tener 4 opciones.
            3. Debe cubrir los puntos clave del contenido proporcionado.
            
            JSON FORMAT:
            {
                "questions": [
                    {
                        "question": "¿...",
                        "options": ["...", "...", "...", "..."],
                        "correctIndex": 0
                    }
                ]
            }
            
            Idioma: ${language}.
        `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: 'Eres un evaluador académico experto.' }, { role: 'user', content: prompt }],
      model: GROQ_MODEL,
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    console.log('Respuesta de Groq (Quiz):', chatCompletion);

    const content = chatCompletion.choices[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch (error: any) {
    console.error(`[AI SERVICE - GROQ] ❌ Error en examen final:`, error.message);
    return null;
  }
};
