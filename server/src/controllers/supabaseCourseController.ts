import { Response } from 'express';
import { generateFinalQuiz } from '../services/aiService';
import crypto from 'crypto';

export const getMySupabaseCourses = async (req: any, res: Response) => {
    try {
        const { supabase, user } = req;

        // Gracias al middleware y RLS, esta consulta solo devolverá cursos del usuario autenticado
        // si la política dice "creator_id = auth.uid()"
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error: any) {
        console.error('[SUPABASE GET COURSES ERROR]', error);
        res.status(500).json({ message: error.message });
    }
};

export const createSupabaseCourse = async (req: any, res: Response) => {
    try {
        const { supabase, user } = req;
        const { title, description, price } = req.body;

        const { data, error } = await supabase
            .from('courses')
            .insert([
                {
                    title,
                    description,
                    price: parseFloat(price) || 0,
                    creator_id: user.userId // Esto es redundante si RLS lo maneja en el Insert, pero útil para claridad
                }
            ])
            .select();

        if (error) throw error;

        res.status(201).json(data[0]);
    } catch (error: any) {
        console.error('[SUPABASE CREATE COURSE ERROR]', error);
        res.status(500).json({ message: error.message });
    }
};

export const enrollInCourse = async (req: any, res: Response) => {
    try {
        const { supabase, user } = req;
        const { courseId } = req.body;

        const { data, error } = await supabase
            .from('enrollments')
            .insert([
                {
                    student_id: user.userId,
                    course_id: courseId
                }
            ])
            .select();

        if (error) throw error;

        res.status(201).json(data[0]);
    } catch (error: any) {
        console.error('[SUPABASE ENROLL ERROR]', error);
        res.status(500).json({ message: error.message });
    }
};

export const saveSupabaseFullCourse = async (req: any, res: Response) => {
    try {
        const { supabase, user } = req;
        const { title, description, modules, landingPage, emailSequence, price, currency, paymentType, advancedLanding } = req.body;

        // 1. Crear el curso base
        const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .insert([{
                title,
                description,
                creator_id: user.userId,
                price: parseFloat(price) || 0,
                currency: currency || 'USD',
                payment_type: paymentType || 'ONE_TIME',
                landing_page: landingPage,
                email_sequence: emailSequence,
                advanced_landing: advancedLanding
            }])
            .select();

        if (courseError) throw courseError;
        const courseId = courseData[0].id;

        // 2. Crear módulos y lecciones (Secuencial por simplicidad de ejemplo, idealmente vía RPC para atomicidad)
        for (let i = 0; i < modules.length; i++) {
            const module = modules[i];
            const { data: moduleData, error: moduleError } = await supabase
                .from('modules')
                .insert([{
                    course_id: courseId,
                    title: module.title,
                    order: i + 1
                }])
                .select();

            if (moduleError) throw moduleError;
            const moduleId = moduleData[0].id;

            // Insertar lecciones del módulo
            if (module.lessons && module.lessons.length > 0) {
                const lessonsToInsert = module.lessons.map((lesson: any, lIdx: number) => ({
                    module_id: moduleId,
                    title: lesson.title,
                    content: lesson.content,
                    order: lIdx + 1,
                    // Marcamos como gratuita la primera lección del primer módulo automáticamente si no viene especificado
                    is_free: lesson.isFree !== undefined ? lesson.isFree : (i === 0 && lIdx === 0)
                }));

                const { error: lessonsError } = await supabase
                    .from('lessons')
                    .insert(lessonsToInsert);

                if (lessonsError) throw lessonsError;
            }
        }

        res.status(201).json({ id: courseId, message: 'Curso guardado exitosamente en Supabase' });
    } catch (error: any) {
        console.error('[SUPABASE FULL SAVE ERROR]', error);
        res.status(500).json({ message: error.message });
    }
};

export const saveLead = async (req: any, res: Response) => {
    try {
        const { supabase } = req;
        const { email, courseId, creatorId } = req.body;

        const { data, error } = await supabase
            .from('leads')
            .insert([{ email, course_id: courseId, creator_id: creatorId }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error: any) {
        console.error('[SUPABASE SAVE LEAD ERROR]', error);
        res.status(500).json({ message: error.message });
    }
};

export const getMyLeads = async (req: any, res: Response) => {
    try {
        const { supabase, user } = req;
        const { data, error } = await supabase
            .from('leads')
            .select('*, courses(title)')
            .eq('creator_id', user.userId);

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        console.error('[SUPABASE GET LEADS ERROR]', error);
        res.status(500).json({ message: error.message });
    }
};

export const generateSupabaseQuiz = async (req: any, res: Response) => {
    try {
        const { supabase } = req;
        const { courseId } = req.params;

        // Obtener contenido del curso para alimentar la IA
        const { data: course, error } = await supabase
            .from('courses')
            .select('title, description, modules(title, lessons(title))')
            .eq('id', courseId)
            .single();

        if (error || !course) throw new Error('Curso no encontrado');

        const context = `Curso: ${course.title}. Descripción: ${course.description}. Módulos: ${JSON.stringify(course.modules)}`;
        const quiz = await generateFinalQuiz(context);

        res.json(quiz);
    } catch (error: any) {
        console.error('[SUPABASE GEN QUIZ ERROR]', error);
        res.status(500).json({ message: error.message });
    }
};

export const submitSupabaseQuiz = async (req: any, res: Response) => {
    try {
        const { supabase, user } = req;
        const { courseId } = req.params;
        const { answers, questions } = req.body; // answers: number[], questions: any[]

        if (!answers || !questions || answers.length !== questions.length) {
            return res.status(400).json({ message: 'Respuestas incompletas' });
        }

        let correct = 0;
        questions.forEach((q: any, i: number) => {
            if (answers[i] === q.correctIndex) correct++;
        });

        const score = (correct / questions.length) * 100;
        const passed = score >= 80;

        if (passed) {
            // Generar Hash "Blockchain"
            const hashMaterial = `${user.userId}-${courseId}-${Date.now()}`;
            const blockchainHash = crypto.createHash('sha256').update(hashMaterial).digest('hex');

            // Guardar Certificado
            const { data: cert, error: certError } = await supabase
                .from('certificates')
                .upsert([{
                    user_id: user.userId,
                    course_id: courseId,
                    blockchain_hash: blockchainHash,
                    student_name: user.name || user.email // Fallback si no hay nombre
                }])
                .select()
                .single();

            if (certError) throw certError;

            return res.json({
                passed: true,
                score,
                certificateId: cert.id,
                blockchainId: blockchainHash
            });
        }

        res.json({ passed: false, score, message: 'No has alcanzado el 80% requerido.' });
    } catch (error: any) {
        console.error('[SUPABASE SUBMIT QUIZ ERROR]', error);
        res.status(500).json({ message: error.message });
    }
};

export const getSupabaseCertificate = async (req: any, res: Response) => {
    try {
        const { supabase, user } = req;
        const { courseId } = req.params;

        const { data, error } = await supabase
            .from('certificates')
            .select('*, courses(title, creator_id)')
            .eq('course_id', courseId)
            .eq('user_id', user.userId)
            .single();

        if (error || !data) {
            return res.status(404).json({ message: 'Certificado no encontrado' });
        }

        res.json(data);
    } catch (error: any) {
        console.error('[SUPABASE GET CERT ERROR]', error);
        res.status(500).json({ message: error.message });
    }
};
