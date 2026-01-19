import { createClient } from '@supabase/supabase-js';

// Usamos el prefijo VITE_ para compatibilidad nativa con Vite, 
// o process.env si se configura en entornos de despliegue específicos.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Fallback for Vercel/Next-style variables
const finalUrl = supabaseUrl || (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : '');
const finalAnonKey = supabaseAnonKey || (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_ANON : '');

if (!finalUrl || !finalAnonKey) {
    console.warn('Supabase credentials missing. Check your environment variables.');
}

export const supabase = createClient(finalUrl || '', finalAnonKey || '');
