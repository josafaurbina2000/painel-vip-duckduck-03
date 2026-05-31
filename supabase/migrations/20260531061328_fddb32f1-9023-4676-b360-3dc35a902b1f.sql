-- Função para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Tabela vips
CREATE TABLE public.vips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
  player_name TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_days INTEGER NOT NULL,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  observations TEXT,
  payment_proof_name TEXT,
  payment_proof_type TEXT,
  payment_proof_data TEXT,
  payment_proof_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- GRANTs (acesso público conforme solicitado pelo usuário)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vips TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vips TO authenticated;
GRANT ALL ON public.vips TO service_role;

-- RLS
ALTER TABLE public.vips ENABLE ROW LEVEL SECURITY;

-- Políticas públicas
CREATE POLICY "Public can view vips" ON public.vips FOR SELECT USING (true);
CREATE POLICY "Public can insert vips" ON public.vips FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update vips" ON public.vips FOR UPDATE USING (true);
CREATE POLICY "Public can delete vips" ON public.vips FOR DELETE USING (true);

-- Trigger updated_at
CREATE TRIGGER update_vips_updated_at
BEFORE UPDATE ON public.vips
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índices
CREATE INDEX idx_vips_status ON public.vips(status);
CREATE INDEX idx_vips_end_date ON public.vips(end_date);