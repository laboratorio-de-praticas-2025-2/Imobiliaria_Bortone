# Sistema de Níveis de Usuário - Chat de Suporte

## Como funciona

O sistema de chat diferencia usuários por meio do campo `nivel` na tabela `usuario`:

- **Nível 0**: Administradores/Agentes de suporte
- **Nível 1**: Usuários comuns

## Como adicionar novos administradores

### Opção 1: Via SQL (Recomendado)
```sql
-- Para tornar um usuário existente administrador
UPDATE usuario SET nivel = 0 WHERE email = 'novo_admin@exemplo.com';

-- Para criar um novo usuário administrador
INSERT INTO usuario (nome, email, senha, nivel) 
VALUES ('Nome do Admin', 'admin@exemplo.com', 'senha_hash', 0);
```

### Opção 2: Via Interface Web (Futuro)
- Criar uma interface administrativa para gerenciar níveis de usuário
- Permitir que administradores existentes promovam outros usuários

## Interfaces diferentes

### Usuários Comuns (Nível 1)
- Interface simples de chat
- Podem enviar mensagens para suporte
- Não veem lista de usuários conectados

### Administradores (Nível 0)
- Interface de agente de suporte
- Veem lista de usuários conectados
- Recebem mensagens de todos os usuários
- Podem responder como suporte

## Validação Automática

O sistema automaticamente:
1. Lê o campo `nivel` do localStorage (vem do backend após login)
2. Define a interface baseada no nível (0 = agente, 1 = usuário)
3. Não requer hardcoding de emails específicos

## Vantagens desta abordagem

✅ **Escalável**: Não precisa modificar código para adicionar novos admins
✅ **Flexível**: Administradores podem ser gerenciados via banco de dados
✅ **Seguro**: Validação baseada no backend, não no frontend
✅ **Simples**: Uma única fonte de verdade (campo `nivel` no banco)