import { Request, Response } from 'express';
import { createCheckoutSession } from '../services/stripeService';
import { PrismaClient } from '@prisma/client';
import { sendWelcomeEmail } from '../services/emailService';
import { supabaseAdmin } from '../config/supabase';

const prisma = new PrismaClient();

export const handleCreateCheckout = async (req: Request, res: Response) => {
    try {
        const { courseId, email, couponCode, affiliateCode } = req.body;

        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }

        let price = course.price || 0;
        let discount = 0;

        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({
                where: { code: couponCode, active: true }
            });
            if (coupon) {
                discount = (price * coupon.discount) / 100;
                price = price - discount;
            }
        }

        const session = await createCheckoutSession(
            course.id,
            course.title,
            price,
            course.currency || 'usd',
            course.paymentType || 'ONE_TIME',
            email
        );

        // Adjuntar código de afiliado a la sesión si existe
        // @ts-ignore - stripe metadata
        session.metadata = { ...session.metadata, affiliateCode };

        res.json({ id: session.id, url: session.url });
    } catch (error: any) {
        console.error('Checkout Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const handlePaymentSuccess = async (req: Request, res: Response) => {
    try {
        const { sessionId, courseId } = req.query;
        // En una implementación real, aquí verificarías el estado de la sesión con Stripe
        // Pero para esta integración rápida, asumiremos que si llega aquí es porque Stripe redireccionó exitosamente

        const course = await prisma.course.findUnique({
            where: { id: courseId as string }
        });

        // Simular obtención de datos del usuario/estudiante
        // En producción esto vendría metadata de la sesión de Stripe

        res.json({ success: true, courseTitle: course?.title });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
    // Implementación simplificada del webhook
    const event = req.body;

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const courseId = session.metadata.courseId;
        const affiliateCode = session.metadata.affiliateCode;
        const studentEmail = session.customer_details.email;
        const studentName = session.customer_details.name || 'Estudiante';

        let affiliateId = null;
        let commission = 0;

        if (affiliateCode) {
            const affLink = await prisma.affiliateLink.findUnique({
                where: { code: affiliateCode }
            });
            if (affLink) {
                affiliateId = affLink.affiliateId;
                commission = (session.amount_total / 100) * (affLink.commissionRate / 100);
            }
        }

        // 0. Obtener la comisión del creador desde Supabase (Seguridad del lado del servidor)
        const { data: courseData } = await supabaseAdmin
            .from('courses')
            .select('creator_id')
            .eq('id', courseId)
            .single();

        let creatorCommissionRate = 5.0; // Default
        if (courseData) {
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('commission_rate')
                .eq('id', courseData.creator_id)
                .single();
            if (profile) creatorCommissionRate = profile.commission_rate;
        }

        const totalAmount = session.amount_total / 100;
        const platformFee = totalAmount * (creatorCommissionRate / 100);

        // 1. Otorgar acceso al curso (Simulado/Referencial)
        console.log(`[PAYMENT] Pago confirmado (${creatorCommissionRate}% fee). Curso: ${courseId} por ${studentEmail}`);

        // 2. Registrar la venta en Supabase (Para Triggers de Rank)
        await supabaseAdmin.from('sales').insert([{
            course_id: courseId,
            student_email: studentEmail,
            amount: totalAmount,
            platform_fee: platformFee,
            affiliate_id: affiliateId,
            commission
        }]);

        // Guardar también en Prisma si se desea mantener SQLite local para otros reportes
        await prisma.sale.create({
            data: {
                courseId,
                studentEmail,
                amount: totalAmount,
                paymentType: session.metadata.paymentType || 'ONE_TIME',
                discount: 0,
                platformFee,
                affiliateId,
                commission
            }
        });

        // 3. Enviar Email de Bienvenida Automático
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (course) {
            const accessLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/course/${courseId}`;
            await sendWelcomeEmail(studentEmail, studentName, course.title, accessLink);
        }
    }

    res.json({ received: true });
};

export const getSalesReport = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;

        const sales = await prisma.sale.findMany({
            where: {
                course: {
                    creatorId: userId
                }
            },
            include: {
                course: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const totalRevenue = sales.reduce((acc, sale) => acc + sale.amount, 0);
        const salesCount = sales.length;

        res.json({
            sales,
            totalRevenue,
            salesCount
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createCoupon = async (req: Request, res: Response) => {
    try {
        const { code, discount, expiresAt } = req.body;
        const coupon = await prisma.coupon.create({
            data: {
                code,
                discount,
                expiresAt: expiresAt ? new Date(expiresAt) : null
            }
        });
        res.json(coupon);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCoupons = async (_req: Request, res: Response) => {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(coupons);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleCoupon = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { active } = req.body;
        const coupon = await prisma.coupon.update({
            where: { id },
            data: { active }
        });
        res.json(coupon);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
