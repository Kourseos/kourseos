import Groq from 'groq-sdk';

const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || '';

export const groq = new Groq({
    apiKey: groqApiKey,
    dangerouslyAllowBrowser: true // Solo para desarrollo, en producción usar backend
});

export interface NanoLessonAtom {
    title: string;
    concept: string;
    explanation: string;
    action: string;
}

export interface GenerateCourseRequest {
    topic: string;
    numLessons: number;
}

export async function generateNanoLessons(
    topic: string,
    numLessons: number = 5
): Promise<NanoLessonAtom[]> {
    const systemPrompt = `Eres un experto en diseño instruccional que crea contenido educativo bajo el marco de "Nano Learning". Tu objetivo es dividir cualquier tema en átomos de conocimiento altamente específicos y accionables.

REGLAS ESTRICTAS:
1. Cada lección debe tener exactamente 3 campos: concept, explanation, action
2. El "concept" es UNA SOLA IDEA clave (máximo 10 palabras)
3. La "explanation" debe estar en formato Markdown, con negritas (**), listas (- item) y bloques de código si aplica
4. El "action" es una tarea concreta que el estudiante puede hacer HOY (máximo 2 líneas)
5. Usa un tono profesional pero accesible
6. El contenido debe ser consumible en 60-90 segundos de lectura

FORMATO DE SALIDA (JSON Array):
[
  {
    "title": "Título descriptivo de la lección",
    "concept": "La idea central en una frase",
    "explanation": "**Explicación detallada en Markdown**\\n\\n- Punto 1\\n- Punto 2\\n\\n\`\`\`javascript\\ncódigo ejemplo\\n\`\`\`",
    "action": "Tarea específica para aplicar este conocimiento"
  }
]`;

    const userPrompt = `Genera exactamente ${numLessons} lecciones de Nano Learning sobre el tema: "${topic}".

Asegúrate de que cada lección sea progresiva, construyendo sobre la anterior. El contenido debe ser aplicable a creadores de cursos o emprendedores educativos.

Responde ÚNICAMENTE con el JSON array, sin texto adicional.`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: 'mixtral-8x7b-32768',
            temperature: 0.7,
            max_tokens: 4000,
        });

        const content = completion.choices[0]?.message?.content || '[]';

        // Limpiar el contenido por si viene con ```json o similar
        const cleanContent = content
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        const lessons = JSON.parse(cleanContent);

        if (!Array.isArray(lessons)) {
            throw new Error('La respuesta de la IA no es un array válido');
        }

        return lessons;
    } catch (error) {
        console.error('Error generando lecciones:', error);
        throw new Error('No se pudieron generar las lecciones. Verifica tu API key de Groq.');
    }
}
