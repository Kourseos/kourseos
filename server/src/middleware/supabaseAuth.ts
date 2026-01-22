import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const authenticateSupabaseToken = async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Supabase access token required' });
    }

    // Creamos un cliente temporal con el token del usuario para validar la sesión
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        console.error('[SUPABASE AUTH ERROR]', error);
        return res.status(403).json({ message: 'Invalid or expired Supabase token' });
    }

    // Adjuntamos el usuario y el cliente con RLS habilitado al request
    req.user = {
        userId: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'STUDENT'
    };

    // Adjuntamos el cliente ya autenticado para que los controladores no tengan que recrearlo
    req.supabase = supabase;

    next();
};

export const optionalSupabaseAuth = async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || token === 'null' || token === 'undefined') {
        const publicSupabase = createClient(supabaseUrl, supabaseAnonKey);
        req.user = null;
        req.supabase = publicSupabase;
        return next();
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        const publicSupabase = createClient(supabaseUrl, supabaseAnonKey);
        req.user = null;
        req.supabase = publicSupabase;
    } else {
        req.user = {
            userId: user.id,
            email: user.email,
            role: user.user_metadata?.role || 'STUDENT'
        };
        req.supabase = supabase;
    }

    next();
};
