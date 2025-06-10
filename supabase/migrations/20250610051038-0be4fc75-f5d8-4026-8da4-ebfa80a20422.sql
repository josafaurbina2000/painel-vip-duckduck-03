
-- Criar tabela para armazenar os VIPs
CREATE TABLE public.vips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_days INTEGER NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_proof_name TEXT,
  payment_proof_type TEXT,
  payment_proof_size INTEGER,
  payment_proof_data TEXT, -- base64 encoded
  observations TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX idx_vips_status ON public.vips(status);
CREATE INDEX idx_vips_end_date ON public.vips(end_date);
CREATE INDEX idx_vips_player_name ON public.vips(player_name);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_vips_updated_at BEFORE UPDATE ON public.vips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS) - por enquanto permitindo acesso total
ALTER TABLE public.vips ENABLE ROW LEVEL SECURITY;

-- Política para permitir acesso total (removeremos quando implementarmos autenticação)
CREATE POLICY "Allow all access to vips" ON public.vips
    FOR ALL USING (true) WITH CHECK (true);
