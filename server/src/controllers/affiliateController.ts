import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAffiliateLink = async (req: Request, res: Response) => {
    try {
        const { courseId, commissionRate } = req.body;
        // @ts-ignore
        const affiliateId = req.user?.userId;

        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        const link = await prisma.affiliateLink.create({
            data: {
                code,
                affiliateId,
                courseId,
                commissionRate: parseFloat(commissionRate)
            }
        });

        res.json(link);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAffiliateStats = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const affiliateId = req.user?.userId;

        const links = await prisma.affiliateLink.findMany({
            where: { affiliateId },
            include: { course: true }
        });

        const sales = await prisma.sale.findMany({
            where: { affiliateId }
        });

        const totalCommission = sales.reduce((acc: number, sale: any) => acc + (sale.commission || 0), 0);
        const totalSales = sales.length;

        res.json({
            links,
            totalCommission,
            totalSales,
            sales
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const trackClick = async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        const link = await prisma.affiliateLink.update({
            where: { code },
            data: { clicks: { increment: 1 } }
        });
        res.json({ courseId: link.courseId });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
