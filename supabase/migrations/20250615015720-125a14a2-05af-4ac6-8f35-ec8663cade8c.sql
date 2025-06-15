
-- Remove as políticas RLS existentes que exigem autenticação
DROP POLICY IF EXISTS "Users can view their own VIPs" ON public.vips;
DROP POLICY IF EXISTS "Users can create their own VIPs" ON public.vips;
DROP POLICY IF EXISTS "Users can update their own VIPs" ON public.vips;
DROP POLICY IF EXISTS "Users can delete their own VIPs" ON public.vips;

-- Criar uma política que permite acesso público total
CREATE POLICY "Allow public access to VIPs" 
  ON public.vips 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Definir um user_id padrão para VIPs existentes que possam ter user_id nulo
UPDATE public.vips 
SET user_id = '00000000-0000-0000-0000-000000000000'::uuid 
WHERE user_id IS NULL;

-- Tornar user_id não nulo com valor padrão para novos registros
ALTER TABLE public.vips 
ALTER COLUMN user_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
ALTER COLUMN user_id SET NOT NULL;
