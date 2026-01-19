import { supabase } from './supabase';
import type { NanoLessonAtom } from './groq';

export interface Course {
    id: string;
    creator_id: string;
    title: string;
    slug: string;
    description?: string;
    thumbnail_url?: string;
    price: number;
    currency: string;
    status: 'draft' | 'published' | 'archived' | 'review';
    category?: string;
    settings?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface Lesson {
    id: string;
    course_id: string;
    title: string;
    position: number;
    lesson_type: 'text' | 'video' | 'audio' | 'quiz';
    content?: string;
    video_url?: string;
    audio_url?: string;
    nano_summary?: string;
    action_item?: string;
    key_concept?: string;
    is_free: boolean;
    duration_seconds?: number;
    created_at: string;
    updated_at: string;
}

/**
 * Crea un nuevo curso en Supabase
 */
export async function createCourse(
    creatorId: string,
    title: string,
    description?: string
): Promise<Course> {
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const { data, error } = await supabase
        .from('courses')
        .insert({
            creator_id: creatorId,
            title,
            slug,
            description,
            status: 'draft',
            price: 0,
            currency: 'USD',
        })
        .select()
        .single();

    if (error) {
        console.error('Error creando curso:', error);
        throw new Error('No se pudo crear el curso');
    }

    return data;
}

/**
 * Guarda múltiples lecciones generadas por la IA en Supabase
 */
export async function saveLessonsToDatabase(
    courseId: string,
    lessons: NanoLessonAtom[]
): Promise<Lesson[]> {
    const lessonsToInsert = lessons.map((lesson, index) => ({
        course_id: courseId,
        title: lesson.title,
        position: index + 1,
        lesson_type: 'text' as const,
        content: lesson.explanation, // Markdown content
        key_concept: lesson.concept,
        action_item: lesson.action,
        nano_summary: lesson.concept, // Usamos el concept como summary
        is_free: true, // Todas las lecciones de audio son gratuitas (estrategia de marketing)
        duration_seconds: 90, // Estimación: 60-90 segundos de lectura
    }));

    const { data, error } = await supabase
        .from('lessons')
        .insert(lessonsToInsert)
        .select();

    if (error) {
        console.error('Error guardando lecciones:', error);
        throw new Error('No se pudieron guardar las lecciones');
    }

    return data;
}

/**
 * Obtiene todas las lecciones de un curso
 */
export async function getLessonsByCourseId(courseId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('position', { ascending: true });

    if (error) {
        console.error('Error obteniendo lecciones:', error);
        throw new Error('No se pudieron obtener las lecciones');
    }

    return data || [];
}

/**
 * Obtiene los cursos de un creador
 */
export async function getCoursesByCreator(creatorId: string): Promise<Course[]> {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error obteniendo cursos:', error);
        return [];
    }

    return data || [];
}
