## Recriar banco de dados do Painel VIP

O Supabase já está conectado (projeto `pssbujriukmbhxketudh`), mas está sem tabelas. Vou recriar a estrutura que o código existente espera.

### 1. Criar tabela `vips`

Campos:
- `id` (UUID, PK)
- `user_id` (UUID) — mantido para compatibilidade com o código
- `player_name` (text)
- `start_date`, `end_date` (timestamptz)
- `duration_days` (int)
- `amount_paid` (numeric)
- `status` (text: 'active' | 'expired')
- `observations` (text, opcional)
- `payment_proof_name`, `payment_proof_type`, `payment_proof_data`, `payment_proof_size` (para comprovantes em base64)
- `created_at`, `updated_at` (timestamptz)

### 2. Permissões e segurança

Como você quer acesso direto sem login (uso pessoal), vou:
- Habilitar RLS na tabela
- Criar políticas públicas (SELECT/INSERT/UPDATE/DELETE para `anon` e `authenticated`)
- Adicionar GRANTs necessários para `anon`, `authenticated` e `service_role`

### 3. Trigger de `updated_at`

Função + trigger para atualizar `updated_at` automaticamente em cada UPDATE.

### Observação de segurança

Acesso público à tabela significa que qualquer pessoa com a URL do projeto pode ler/escrever os VIPs. Como você mencionou que é só para você, isso atende ao requisito — mas se quiser proteção real depois, recomendo adicionar login.

Após aprovar, o código existente (`useVIPs.ts`, `FileUpload.tsx`, etc.) já funcionará sem alterações.