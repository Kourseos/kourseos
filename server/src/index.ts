import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import apiKeyRoutes from './routes/apiKeyRoutes';
import publicApiRoutes from './routes/publicApiRoutes';
import paymentRoutes from './routes/paymentRoutes';
import affiliateRoutes from './routes/affiliateRoutes';
import withdrawalRoutes from './routes/withdrawalRoutes';
import supabaseRoutes from './routes/supabaseRoutes';

dotenv.config();

console.log("🚀 Servidor KourseOS iniciado en Vercel");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/keys', apiKeyRoutes);
app.use('/api/v1', publicApiRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/affiliates', affiliateRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/supabase', supabaseRoutes);

app.get('/', (req, res) => {
    res.send('Kourseos AI API is running');
});

if (!process.env.VERCEL) {
    app.listen(Number(PORT), '0.0.0.0', () => {
        console.log(`Server running on port ${PORT} (accessible at http://0.0.0.0:${PORT})`);
    });
}

export default app;
