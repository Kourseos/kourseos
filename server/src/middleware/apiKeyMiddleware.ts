import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

export const authenticateApiKey = async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
        return res.status(401).json({ message: 'API Key is missing' });
    }

    try {
        const keyRecord = await prisma.apiKey.findUnique({
            where: { key: apiKey },
            include: { user: true }
        });

        if (!keyRecord) {
            return res.status(403).json({ message: 'Invalid API Key' });
        }

        // Update last used
        await prisma.apiKey.update({
            where: { id: keyRecord.id },
            data: { lastUsed: new Date() }
        });

        // @ts-ignore - attaching user to request
        req.user = { userId: keyRecord.userId, role: keyRecord.user.role };
        next();
    } catch (error) {
        console.error('API Key Auth Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
