-- 1. Asegurar campos en la tabla de perfiles (profiles)
-- Esta tabla debe estar vinculada a auth.users.id
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS commission_rate FLOAT DEFAULT 5.0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_sales_count INT DEFAULT 0;

-- 2. Crear la tabla de ventas (sales) en Supabase si no existe
-- Nota: Usamos snake_case por convención de PostgreSQL/Supabase
CREATE TABLE IF NOT EXISTS public.sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    student_email TEXT NOT NULL,
    amount FLOAT NOT NULL,
    platform_fee FLOAT NOT NULL,
    affiliate_id UUID,
    commission FLOAT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Habilitar RLS para Sales (Opcional, pero recomendado)
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creators can view their course sales" ON public.sales
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.courses 
        WHERE id = public.sales.course_id 
        AND creator_id = auth.uid()
    )
);

-- 4. Función de actualización automática de Rank
CREATE OR REPLACE FUNCTION update_creator_commission_on_sale() 
RETURNS TRIGGER AS $$
DECLARE
    v_creator_id UUID;
    v_sales_count INT;
    v_new_rate FLOAT;
BEGIN
    -- 1. Identificar al creador del curso
    SELECT creator_id INTO v_creator_id 
    FROM public.courses 
    WHERE id = NEW.course_id;

    -- 2. Contar ventas totales históricas del creador
    SELECT count(*) INTO v_sales_count 
    FROM public.sales s
    JOIN public.courses c ON s.course_id = c.id
    WHERE c.creator_id = v_creator_id;

    -- 3. Definir nueva tasa según lógica de volumen
    IF v_sales_count >= 200 THEN
        v_new_rate := 3.0; -- Rank Oro
    ELSIF v_sales_count >= 50 THEN
        v_new_rate := 4.0; -- Rank Plata
    ELSE
        v_new_rate := 5.0; -- Rank Bronce
    END IF;

    -- 4. Actualizar perfil del creador
    UPDATE public.profiles 
    SET commission_rate = v_new_rate,
        total_sales_count = v_sales_count
    WHERE id = v_creator_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger Post-Venta
DROP TRIGGER IF EXISTS tr_after_sale_rank_update ON public.sales;
CREATE TRIGGER tr_after_sale_rank_update
AFTER INSERT ON public.sales
FOR EACH ROW EXECUTE FUNCTION update_creator_commission_on_sale();
