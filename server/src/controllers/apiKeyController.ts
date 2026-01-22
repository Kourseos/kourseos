import { Request, Response } from 'express';
import prisma from '../config/db';
import crypto from 'crypto';

export const generateApiKey = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        // @ts-ignore
        const userId = req.user?.userId;

        if (!name) {
            res.status(400).json({ message: 'Name for the API Key is required' });
            return;
        }

        const key = `sk_live_${crypto.randomBytes(24).toString('hex')}`;

        const apiKey = await prisma.apiKey.create({
            data: {
                key,
                name,
                userId
            }
        });

        res.status(201).json(apiKey);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to generate API Key' });
    }
};

export const getApiKeys = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;

        const keys = await prisma.apiKey.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json(keys);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch API Keys' });
    }
};

export const deleteApiKey = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user?.userId;

        await prisma.apiKey.deleteMany({
            where: { id, userId }
        });

        res.json({ message: 'API Key deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete API Key' });
    }
};
