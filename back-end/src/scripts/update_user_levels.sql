-- Script para atualizar níveis de usuário
-- Execute este SQL no seu banco de dados para definir níveis corretamente

-- Definir admin@test.com como nível 0 (administrador/agente)
UPDATE usuario SET nivel = 0 WHERE email = 'admin@test.com';

-- Definir todos os outros usuários como nível 1 (usuário comum) se não estiver definido
UPDATE usuario SET nivel = 1 WHERE nivel IS NULL;

-- Verificar os resultados
SELECT id, nome, email, nivel FROM usuario ORDER BY nivel, nome;