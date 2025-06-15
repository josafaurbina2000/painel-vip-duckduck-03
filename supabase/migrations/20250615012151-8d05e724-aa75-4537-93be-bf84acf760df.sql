
-- Primeiro, deletar todos os objetos do bucket
DELETE FROM storage.objects WHERE bucket_id = 'payment-proofs';

-- Depois deletar o bucket
DELETE FROM storage.buckets WHERE id = 'payment-proofs';

-- Remover colunas do Supabase Storage da tabela vips
ALTER TABLE public.vips 
DROP COLUMN IF EXISTS payment_proof_url,
DROP COLUMN IF EXISTS payment_proof_path;
