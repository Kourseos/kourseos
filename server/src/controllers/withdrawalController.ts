import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendWithdrawalApprovedEmail } from '../services/emailService';

const prisma = new PrismaClient();

const MIN_WITHDRAWAL_AMOUNT = 20;

export const getBalance = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;

        // 1. Ganancias como Creador
        const creatorSales = await prisma.sale.findMany({
            where: {
                course: { creatorId: userId }
            }
        });

        const totalCreatorEarned = creatorSales.reduce((acc: number, sale: any) => {
            const afterFee = sale.amount - sale.platformFee;
            const final = afterFee - (sale.commission || 0);
            return acc + final;
        }, 0);

        // 2. Ganancias como Afiliado
        const affiliateSales = await prisma.sale.findMany({
            where: { affiliateId: userId }
        });

        const totalAffiliateEarned = affiliateSales.reduce((acc: number, sale: any) => acc + (sale.commission || 0), 0);

        // 3. Retiros realizados
        const withdrawals = await prisma.withdrawal.findMany({
            where: { userId, status: { in: ['PENDING', 'COMPLETED'] } }
        });

        const totalWithdrawn = withdrawals.reduce((acc: number, w: any) => acc + w.amount, 0);

        const availableBalance = (totalCreatorEarned + totalAffiliateEarned) - totalWithdrawn;

        res.json({
            availableBalance,
            totalCreatorEarned,
            totalAffiliateEarned,
            totalWithdrawn,
            minWithdrawal: MIN_WITHDRAWAL_AMOUNT
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const requestWithdrawal = async (req: Request, res: Response) => {
    try {
        const { amount, method, details } = req.body;
        // @ts-ignore
        const userId = req.user?.userId;

        if (amount < MIN_WITHDRAWAL_AMOUNT) {
            return res.status(400).json({ message: `El monto mínimo de retiro es $${MIN_WITHDRAWAL_AMOUNT}` });
        }

        // Verificar balance actual
        const balanceRes = await calculateUserBalance(userId);
        if (amount > balanceRes) {
            return res.status(400).json({ message: 'Saldo insuficiente' });
        }

        const withdrawal = await prisma.withdrawal.create({
            data: {
                userId,
                amount,
                method,
                details,
                status: 'PENDING'
            }
        });

        res.json(withdrawal);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getWithdrawals = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        const withdrawals = await prisma.withdrawal.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(withdrawals);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const approveWithdrawal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const withdrawal = await prisma.withdrawal.update({
            where: { id },
            data: {
                status: 'COMPLETED',
                processedAt: new Date()
            },
            include: { user: true }
        });

        // Enviar notificación por email
        if (withdrawal.user.email) {
            await sendWithdrawalApprovedEmail(
                withdrawal.user.email,
                withdrawal.user.name || 'Usuario',
                withdrawal.amount,
                withdrawal.method
            );
        }

        res.json(withdrawal);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function
async function calculateUserBalance(userId: string): Promise<number> {
    const creatorSales = await prisma.sale.findMany({
        where: { course: { creatorId: userId } }
    });
    const totalCreatorEarned = creatorSales.reduce((acc: number, sale: any) => {
        const afterFee = sale.amount - sale.platformFee;
        const final = afterFee - (sale.commission || 0);
        return acc + final;
    }, 0);

    const affiliateSales = await prisma.sale.findMany({
        where: { affiliateId: userId }
    });
    const totalAffiliateEarned = affiliateSales.reduce((acc: number, sale: any) => acc + (sale.commission || 0), 0);

    const withdrawals = await prisma.withdrawal.findMany({
        where: { userId, status: { in: ['PENDING', 'COMPLETED'] } }
    });
    const totalWithdrawn = withdrawals.reduce((acc: number, w: any) => acc + w.amount, 0);

    return (totalCreatorEarned + totalAffiliateEarned) - totalWithdrawn;
}
