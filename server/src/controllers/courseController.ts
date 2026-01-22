import { Request, Response } from 'express';
import { generateCurriculum, generateLessonContent, generateAdvancedLanding } from '../services/aiService';
import { getTutorResponse } from '../services/tutorService';
import prisma from '../config/db';
import crypto from 'crypto';

export const createCourseStructure = async (req: Request, res: Response): Promise<void> => {
    console.log('--- CREATE COURSE STRUCTURE HIT ---');
    console.log('Topic:', req.body.topic);
    try {
        const { topic, userPrompt } = req.body;
        // @ts-ignore - userId is added by auth middleware
        const userId = req.user?.userId;

        if (!topic) {
            console.log('Topic missing');
            res.status(400).json({ message: 'Topic is required' });
            return;
        }

        // Timeout promise: Si tarda más de 50 segundos, falla.
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('AI Generation Timeout')), 50000)
        );

        // Race entre la generación y el timeout
        const curriculum = await Promise.race([
            generateCurriculum(topic, userPrompt),
            timeoutPromise
        ]);

        if (!curriculum) {
            throw new Error('La IA no pudo generar una respuesta válida. Intenta de nuevo.');
        }

        // Generar Landing Avanzada en paralelo (background-ish) o secuencial
        const advancedLanding = await generateAdvancedLanding(JSON.stringify(curriculum.modules));
        if (advancedLanding) {
            curriculum.advancedLanding = advancedLanding;
        }

        res.json({ curriculum });
    } catch (error: any) {
        console.error('Error in createCourseStructure:', error);

        if (error.message === 'AI Generation Timeout') {
            res.status(504).json({ message: 'El motor de IA está tardando demasiado. Prueba con un tema más simple o intenta de nuevo.' });
        } else {
            // Mostrar el error real para diagnóstico
            res.status(500).json({ message: error.message || 'Error inesperado en la generación' });
        }
    }
};

export const saveCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, modules, landingPage, emailSequence, price, currency, paymentType } = req.body;
        // @ts-ignore
        const userId = req.user?.userId;

        const course = await prisma.course.create({
            data: {
                title,
                description,
                creatorId: userId,
                price: price || 0,
                currency: currency || 'USD',
                paymentType: paymentType || 'ONE_TIME',
                landingPage: landingPage ? JSON.stringify(landingPage) : null,
                emailSequence: emailSequence ? JSON.stringify(emailSequence) : null,
                modules: {
                    create: modules.map((module: any, index: number) => ({
                        title: module.title,
                        order: index + 1,
                        lessons: {
                            create: module.lessons.map((lesson: any, lIndex: number) => ({
                                title: lesson.title,
                                content: lesson.content,
                                concept: lesson.concept,
                                explanation: lesson.explanation,
                                action: lesson.action,
                                order: lIndex + 1
                            }))
                        },
                        quiz: module.quiz ? {
                            create: {
                                title: module.quiz.title,
                                questions: {
                                    create: module.quiz.questions.map((q: any) => ({
                                        text: q.text,
                                        options: JSON.stringify(q.options),
                                        correctAnswer: q.correctAnswer
                                    }))
                                }
                            }
                        } : undefined
                    }))
                }
            },
            include: {
                modules: {
                    include: {
                        lessons: true,
                        quiz: true
                    }
                }
            }
        });

        res.status(201).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save course' });
    }
}

export const chatWithTutor = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        const { message } = req.body;

        if (!message) {
            res.status(400).json({ message: 'Message is required' });
            return;
        }

        const reply = await getTutorResponse(courseId, message);
        res.json({ reply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get tutor response' });
    }
};

export const generateLessonDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseTitle, lessonTitle, context } = req.body;

        if (!courseTitle || !lessonTitle) {
            res.status(400).json({ message: 'Course title and lesson title are required' });
            return;
        }

        const details = await generateLessonContent(courseTitle, lessonTitle, context);
        res.json(details);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to generate lesson content' });
    }
};

export const getCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;

        const courses = await prisma.course.findMany({
            where: { creatorId: userId },
            include: {
                modules: {
                    include: { lessons: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch courses' });
    }
};

export const getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        // @ts-ignore
        const userId = req.user?.userId;

        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                modules: {
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' }
                        }
                    },
                }
            }
        });

        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        // Check ownership? Or allow public view? Ideally check but for MVP...
        // if (course.creatorId !== userId) ...

        res.json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch course' });
    }
};

export const updateLesson = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId, lessonId } = req.params;
        const { content } = req.body;
        // @ts-ignore
        const userId = req.user?.userId;

        // Verify ownership (optional for MVP but good practice)
        /*
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course || course.creatorId !== userId) {
             res.status(403).json({ message: 'Unauthorized' });
             return;
        }
        */

        const updatedLesson = await prisma.lesson.update({
            where: { id: lessonId },
            data: {
                content: req.body.content,
                concept: req.body.concept,
                explanation: req.body.explanation,
                action: req.body.action
            }
        });

        res.json(updatedLesson);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update lesson' });
    }
};

export const submitQuiz = async (req: Request, res: Response): Promise<void> => {
    try {
        const { quizId } = req.params;
        const { answers } = req.body;
        // @ts-ignore
        const userId = req.user?.userId;

        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: { questions: true }
        });

        if (!quiz) {
            res.status(404).json({ message: 'Quiz not found' });
            return;
        }

        const attemptsCount = await prisma.quizAttempt.count({
            where: { userId, quizId }
        });

        if (attemptsCount >= 3) {
            res.status(403).json({ message: 'Has excedido el número máximo de intentos (3).' });
            return;
        }

        let correctCount = 0;
        quiz.questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / quiz.questions.length) * 100);
        const passed = score >= 70;

        const attempt = await prisma.quizAttempt.create({
            data: {
                userId,
                quizId,
                score,
                passed
            }
        });

        res.json({ attempt, score, passed, attemptsLeft: 2 - attemptsCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to submit quiz' });
    }
};

export const generateCertificate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        // @ts-ignore
        const userId = req.user?.userId;

        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: { modules: { include: { quiz: true } } }
        });

        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        for (const module of course.modules) {
            if (module.quiz) {
                const passedAttempt = await prisma.quizAttempt.findFirst({
                    where: { userId, quizId: module.quiz.id, passed: true }
                });
                if (!passedAttempt) {
                    res.status(403).json({ message: `No has aprobado el quiz del módulo: ${module.title}` });
                    return;
                }
            }
        }

        const existingCert = await prisma.certificate.findUnique({
            where: {
                userId_courseId: { userId, courseId }
            }
        });

        if (existingCert) {
            res.json(existingCert);
            return;
        }

        const hashMaterial = `${userId}-${courseId}-${Date.now()}`;
        const blockchainHash = crypto.createHash('sha256').update(hashMaterial).digest('hex');

        const certificate = await prisma.certificate.create({
            data: {
                userId,
                courseId,
                blockchainHash
            }
        });

        res.status(201).json(certificate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to generate certificate' });
    }
};

export const getCertificatesExplorer = async (req: Request, res: Response): Promise<void> => {
    try {
        const certificates = await prisma.certificate.findMany({
            include: {
                user: { select: { name: true, email: true } },
                course: { select: { title: true } }
            },
            orderBy: { issuedAt: 'desc' }
        });
        res.json(certificates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch certificates' });
    }
};

export const getQuizById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { quizId } = req.params;
        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: { questions: true }
        });
        if (!quiz) {
            res.status(404).json({ message: 'Quiz not found' });
            return;
        }
        res.json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch quiz' });
    }
};

export const addModule = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        const { title } = req.body;

        const modulesCount = await prisma.module.count({ where: { courseId } });

        const module = await prisma.module.create({
            data: {
                title,
                courseId,
                order: modulesCount + 1
            }
        });

        res.status(201).json(module);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add module' });
    }
};

export const addLesson = async (req: Request, res: Response): Promise<void> => {
    try {
        const { moduleId } = req.params;
        const { title } = req.body;

        const lessonsCount = await prisma.lesson.count({ where: { moduleId } });

        const lesson = await prisma.lesson.create({
            data: {
                title,
                content: '',
                moduleId,
                order: lessonsCount + 1
            }
        });

        res.status(201).json(lesson);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add lesson' });
    }
};
export const getOptimizationSuggestions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        const suggestions = await prisma.optimizationSuggestion.findMany({
            where: { courseId, resolved: false },
            orderBy: { createdAt: 'desc' }
        });
        res.json(suggestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch suggestions' });
    }
};

export const resolveOptimizationSuggestion = async (req: Request, res: Response): Promise<void> => {
    try {
        const { suggestionId } = req.params;
        await prisma.optimizationSuggestion.update({
            where: { id: suggestionId },
            data: { resolved: true }
        });
        res.json({ message: 'Suggestion resolved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to resolve suggestion' });
    }
};
