-- Script SQL para corrigir os níveis dos usuários de teste

-- Verificar usuários atuais
SELECT 'Usuários antes da correção:' as status;
SELECT id, nome, email, nivel FROM usuarios WHERE email IN ('admin@test.com', 'user@test.com');

-- Corrigir nível do admin (deve ser 0 = agente)
UPDATE usuarios 
SET nivel = 0 
WHERE email = 'admin@test.com';

-- Corrigir nível do usuário comum (deve ser 1 = usuário)
UPDATE usuarios 
SET nivel = 1 
WHERE email = 'user@test.com';

-- Verificar resultado
SELECT 'Usuários após correção:' as status;
SELECT id, nome, email, nivel, 
       CASE 
         WHEN nivel = 0 THEN 'AGENTE' 
         WHEN nivel = 1 THEN 'USUÁRIO' 
         ELSE 'OUTRO' 
       END as tipo
FROM usuarios 
WHERE email IN ('admin@test.com', 'user@test.com');