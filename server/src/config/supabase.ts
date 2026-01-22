import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Cliente estándar para operaciones que respetan RLS (se usa con el token del usuario)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente de administración para operaciones bypass RLS (Uso cuidadoso en el backend)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
