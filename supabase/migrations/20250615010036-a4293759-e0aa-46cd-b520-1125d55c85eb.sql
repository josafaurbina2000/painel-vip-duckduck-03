
-- Criar bucket para armazenar arquivos de comprovantes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-proofs', 'payment-proofs', true);

-- Criar política para permitir upload de arquivos
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'payment-proofs');

-- Criar política para permitir visualização pública dos arquivos
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'payment-proofs');

-- Criar política para permitir deletar arquivos
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'payment-proofs');
