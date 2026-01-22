import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de transportador (Placeholder para producción)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || 'skillforge@demo.ai',
        pass: process.env.SMTP_PASS || 'skillforge_pass',
    },
});

/**
 * Envía un correo electrónico profesional
 */
export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        console.log(`[EMAIL SERVICE] Enviando email a: ${to} | Asunto: ${subject}`);

        // Si no hay configuración real, simulamos el envío en consola
        if (!process.env.SMTP_HOST) {
            console.log("-----------------------------------------");
            console.log("📧 SIMULACIÓN DE EMAIL SKILLFORGE");
            console.log(`PARA: ${to}`);
            console.log(`ASUNTO: ${subject}`);
            console.log(`CUERPO: ${html.substring(0, 100)}...`);
            console.log("-----------------------------------------");
            return { messageId: 'simulated_id' };
        }

        const info = await transporter.sendMail({
            from: `"SkillForge AI" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        return info;
    } catch (error) {
        console.error('[EMAIL SERVICE] Error enviando email:', error);
        throw error;
    }
};

/**
 * Plantilla para Email de Acceso Inmediato
 */
export const sendWelcomeEmail = async (studentEmail: string, studentName: string, courseTitle: string, accessLink: string) => {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 1.5rem;">
            <h1 style="color: #9333ea;">¡Bienvenido a tu nueva maestría!</h1>
            <p>Hola <strong>${studentName}</strong>,</p>
            <p>Tu acceso al curso <strong>"${courseTitle}"</strong> ya está activo.</p>
            <div style="text-align: center; margin: 40px 0;">
                <a href="${accessLink}" style="background: #9333ea; color: white; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold;">Acceder a mi curso ahora</a>
            </div>
            <p style="color: #666; font-size: 0.9em;">SkillForge AI - Elevando tu conocimiento con inteligencia artificial.</p>
        </div>
    `;
    return sendEmail(studentEmail, `Acceso Activo: ${courseTitle}`, html);
};
/**
 * Plantilla para Notificación de Retiro Aprobado
 */
export const sendWithdrawalApprovedEmail = async (email: string, userName: string, amount: number, method: string) => {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 1.5rem;">
            <h1 style="color: #059669;">¡Retiro Aprobado! 💸</h1>
            <p>Hola <strong>${userName}</strong>,</p>
            <p>Nos complace informarte que tu solicitud de retiro por un monto de <strong>$${amount.toFixed(2)}</strong> ha sido procesada.</p>
            <p>El dinero ha sido enviado a tu cuenta de <strong>${method}</strong>.</p>
            <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #065f46; font-size: 0.9em;">
                    <strong>Detalle del movimiento:</strong><br>
                    Monto: $${amount.toFixed(2)}<br>
                    Método: ${method}<br>
                    Estado: COMPLETADO
                </p>
            </div>
            <p style="color: #666; font-size: 0.8em;">Gracias por ser parte de la red de creadores de SkillForge AI.</p>
        </div>
    `;
    return sendEmail(email, `Retiro Procesado con Éxito - SkillForge AI`, html);
};
