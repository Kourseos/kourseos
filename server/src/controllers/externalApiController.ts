import { Request, Response } from 'express';
import prisma from '../config/db';

/**
 * Public API to list published courses
 */
export const listPublicCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const creatorId = req.user?.userId;

        const courses = await prisma.course.findMany({
            where: {
                creatorId,
                published: true
            },
            select: {
                id: true,
                title: true,
                description: true,
                createdAt: true,
                _count: {
                    select: { modules: true }
                }
            }
        });

        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch public courses' });
    }
};

/**
 * Public API to enroll a student (by email) in a course
 */
export const enrollStudentPublic = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId, email, name } = req.body;
        // @ts-ignore
        const creatorId = req.user?.userId;

        // Verify the course belongs to the creator
        const course = await prisma.course.findUnique({
            where: { id: courseId, creatorId }
        });

        if (!course) {
            res.status(404).json({ message: 'Course not found or unauthorized' });
            return;
        }

        // Find or create student user
        let student = await prisma.user.findUnique({ where: { email } });
        if (!student) {
            // Generate a random password for new students invited via API
            const tempPassword = Math.random().toString(36).slice(-10);
            student = await prisma.user.create({
                data: {
                    email,
                    name: name || email.split('@')[0],
                    password: tempPassword, // In a real app, send reset password email
                    role: 'STUDENT'
                }
            });
        }

        // Enroll
        const enrollment = await prisma.enrollment.upsert({
            where: {
                userId_courseId: {
                    userId: student.id,
                    courseId: course.id
                }
            },
            update: {},
            create: {
                userId: student.id,
                courseId: course.id
            }
        });

        res.status(201).json({
            message: 'Student enrolled successfully',
            enrollmentId: enrollment.id,
            studentId: student.id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to enroll student' });
    }
};

/**
 * Public API to check student progress
 */
export const getStudentProgressPublic = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId, studentEmail } = req.query;
        // @ts-ignore
        const creatorId = req.user?.userId;

        if (!courseId || !studentEmail) {
            res.status(400).json({ message: 'courseId and studentEmail are required' });
            return;
        }

        const student = await prisma.user.findUnique({ where: { email: studentEmail as string } });
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }

        // Count total lessons
        const totalLessons = await prisma.lesson.count({
            where: { module: { courseId: courseId as string } }
        });

        // Count completed lessons
        const completedLessons = await prisma.userProgress.count({
            where: {
                userId: student.id,
                completed: true,
                lesson: { module: { courseId: courseId as string } }
            }
        });

        res.json({
            studentEmail,
            courseId,
            progress: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
            completedLessons,
            totalLessons
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch progress' });
    }
};
