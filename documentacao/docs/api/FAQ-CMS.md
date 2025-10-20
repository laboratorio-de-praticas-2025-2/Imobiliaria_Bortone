# Documentação CRUD FAQ - CMS

## Visão Geral

Este guia detalha as operações de Create, Read, Update e Delete (CRUD) para gerenciar Perguntas Frequentes no sistema CMS. As operações CRUD são essenciais para manter o FAQ atualizado e relevante para os usuários.

---

## Pré-requisitos

- ✅ Acesso autenticado ao painel administrativo do CMS
- ✅ Permissões de administrador para gerenciar FAQ
- ✅ Navegador atualizado com suporte a JavaScript
- ✅ Conhecimento básico da interface do CMS

---

## Acessar o Painel de Gerenciamento FAQ

### Passo 1: Login no Sistema

1. Acesse o painel admin (Frontend Vercel): `https://seu-dominio.vercel.app/admin`
2. Digite suas credenciais (e-mail e senha)
3. Clique em "Entrar"
4. Caso possua dois fatores, complete a verificação

### Passo 2: Navegar até o Módulo FAQ

1. No menu lateral esquerdo, localize "Conteúdo"
2. Clique em "FAQ" ou "Perguntas Frequentes"
3. Você será redirecionado para a página de gerenciamento: `/admin/faq`

### Interface Principal

A página de gerenciamento exibe:

- **Barra de Busca**: Permite localizar perguntas existentes
- **Filtros**: Filtrar por categoria ou status (ativo/inativo)
- **Lista de FAQs**: Tabela com todas as perguntas cadastradas
- **Botão "Nova FAQ"**: Para criar novas perguntas
- **Ações por Linha**: Ícones de editar e deletar para cada FAQ

---

## CREATE - Criar Nova FAQ

### Como Adicionar uma Nova FAQ no Sistema

#### Passo 1: Acessar o Formulário de Criação

1. Na página de gerenciamento FAQ, clique no botão **"Nova FAQ"** (canto superior direito)
2. Você será redirecionado para o formulário de criação: `/admin/faq/novo`
3. O formulário exibirá os campos vazios prontos para preenchimento

#### Passo 2: Preencher os Campos Obrigatórios

**Campo: Pergunta**

| Propriedade | Detalhes |
|-------------|----------|
| **Descrição** | O título ou texto da pergunta |
| **Tipo** | Texto |
| **Limite** | Mínimo 10 caracteres, máximo 500 caracteres |
| **Validação** | Não pode conter apenas espaços em branco |
| **Exemplo** | "Quais documentos são necessários para comprar um imóvel?" |

**Campo: Resposta**

| Propriedade | Detalhes |
|-------------|----------|
| **Descrição** | O texto completo da resposta |
| **Tipo** | Texto longo (editor WYSIWYG) |
| **Limite** | Mínimo 20 caracteres, máximo 2000 caracteres |
| **Validação** | Não pode conter apenas espaços em branco |
| **Recurso** | Suporta formatação de texto (negrito, itálico, links, listas) |
| **Exemplo** | "Para comprar um imóvel você precisa de: RG, CPF, comprovante de renda..." |

**Campo: Categoria**

| Propriedade | Detalhes |
|-------------|----------|
| **Descrição** | Classifica a pergunta por assunto |
| **Tipo** | Dropdown (seleção única) |
| **Validação** | Seleção obrigatória |
| **Dica** | Escolha a categoria mais específica possível para melhor organização |

**Opções de Categoria Permitidas:**

- `vendas` - Processo de compra e venda
- `locacao` - Aluguel de imóveis
- `financiamento` - Empréstimos e financiamento
- `documentacao` - Papéis e documentos necessários
- `visitas` - Agendamento e tours de imóveis
- `geral` - Outras dúvidas gerais

#### Passo 3: Preencher Campos Opcionais

**Campo: Status (Ativo/Inativo)**

| Propriedade | Detalhes |
|-------------|----------|
| **Descrição** | Define se a FAQ será visível aos usuários |
| **Tipo** | Toggle/Checkbox |
| **Valor Padrão** | Ativo (true) |
| **Ativo** | FAQ aparece na seção pública |
| **Inativo** | FAQ fica oculta, visível apenas para administradores |
| **Recomendação** | Deixe inativo se a FAQ estiver em rascunho |

**Campo: Tags (Opcional)**

| Propriedade | Detalhes |
|-------------|----------|
| **Descrição** | Palavras-chave para melhorar busca |
| **Tipo** | Campo de input com sugestões |
| **Limite** | Até 5 tags por FAQ |
| **Formato** | Separadas por vírgula ou Enter |
| **Exemplo** | "compra, imóvel, documentação" |

#### Passo 4: Validar Dados

Antes de salvar, o sistema validará automaticamente:

- ✅ Pergunta possui entre 10 e 500 caracteres
- ✅ Resposta possui entre 20 e 2000 caracteres
- ✅ Categoria foi selecionada
- ✅ Nenhum campo obrigatório está vazio

!!! warning "Atenção"
    Se houver erros, mensagens de validação aparecerão em vermelho acima dos campos correspondentes.

#### Passo 5: Salvar a Nova FAQ

1. Clique no botão **"Salvar"** (canto inferior direito)
2. Um spinner de carregamento aparecerá
3. Se bem-sucedido, você será redirecionado para a lista de FAQs
4. Uma mensagem de sucesso aparecerá: "FAQ criada com sucesso!"
5. A nova FAQ estará disponível para usuários imediatamente (se status = ativo)

#### Exemplo Prático: Criando uma FAQ

```
Pergunta: "Qual é a diferença entre aluguel de longa e curta duração?"

Resposta: "A principal diferença está no período de locação. Longa duração 
refere-se a contratos de 12 meses ou mais, enquanto a curta duração é para 
períodos inferiores a 12 meses. Contratos de longa duração oferecem maior 
estabilidade ao proprietário, enquanto a curta duração proporciona 
flexibilidade ao inquilino."

Categoria: locacao

Status: Ativo ✓
```

**Resultado:** FAQ criada com sucesso e visível aos usuários!

### Validação em Tempo Real

Enquanto preenche os campos, o sistema fornece feedback:

- **Contador de Caracteres**: Mostra caracteres usados/limite
- **Indicador de Status**: Linha verde = válido, vermelha = inválido
- **Dicas Contextuais**: Aparecem abaixo dos campos quando necessário

---

## READ - Visualizar FAQ

### Como Visualizar uma FAQ Existente

#### Visualizar na Lista

1. Na página `/admin/faq`, você verá uma tabela com todas as FAQs
2. Cada linha contém:
   - ID da FAQ
   - Pergunta (primeiras 100 caracteres)
   - Categoria
   - Status (Ativo/Inativo)
   - Data de Criação
   - Ações (ícones de editar e deletar)

#### Visualizar em Detalhes

**Método 1: Clicando na Pergunta**

1. Clique na pergunta na tabela
2. A FAQ se expandirá mostrando a resposta completa
3. Clique novamente para recolher

**Método 2: Clicando no Ícone de Editar**

1. Clique no ícone de lápis (editar) na linha da FAQ
2. A página de edição abrirá com todos os detalhes: `/admin/faq/:id/editar`
3. Você poderá visualizar e modificar todos os campos

#### Visualizar como Usuário Final

1. Na página de edição, clique em **"Visualizar Públicamente"**
2. Uma nova aba abrirá mostrando como a FAQ aparece para usuários comuns
3. Isso ajuda a verificar formatação e apresentação

#### Pesquisar FAQs

**Usando a Barra de Busca:**

1. No topo da página de gerenciamento, localize a barra de busca
2. Digite palavras-chave (parte da pergunta ou resposta)
3. Pressione Enter
4. A tabela filtrará mostrando apenas FAQs correspondentes
5. Limpe o campo para voltar à lista completa

**Usando Filtros:**

1. Clique em "Filtros" (se disponível na interface)
2. **Filtro de Categoria**: Selecione uma categoria para ver apenas FAQs daquela categoria
3. **Filtro de Status**: Ativo/Inativo/Todos
4. Clique em "Aplicar" para filtrar
5. Clique em "Limpar Filtros" para resetar

**Exemplo de Busca:**

- Buscar: "financiamento" → Mostrará todas as FAQs com essa palavra
- Filtrar por: Categoria "vendas" → Mostrará apenas FAQs de vendas

---

## UPDATE - Editar FAQ Existente

### Como Alterar uma FAQ Existente

#### Passo 1: Acessar a FAQ para Edição

**Método 1: Via Lista**

1. Na página `/admin/faq`, localize a FAQ que deseja editar
2. Clique no ícone de lápis (editar) na coluna "Ações"
3. A página de edição abrirá: `/admin/faq/:id/editar`

**Método 2: Via Busca**

1. Use a barra de busca para encontrar a FAQ
2. Clique no ícone de editar na linha correspondente

#### Passo 2: Modificar os Campos

Todos os campos são editáveis, assim como na criação. Você pode alterar:

- **Pergunta**: Reescrever ou corrigir a pergunta
- **Resposta**: Atualizar o conteúdo da resposta com novo texto ou formatação
- **Categoria**: Reclassificar a FAQ em outra categoria
- **Status**: Ativar ou desativar a FAQ
- **Tags**: Adicionar, modificar ou remover tags

#### Passo 3: Validar Alterações

O sistema validará os dados modificados automaticamente, assim como na criação:

- ✅ Verificar limites de caracteres
- ✅ Validar campos obrigatórios
- ✅ Confirmar que categoria foi selecionada

!!! danger "Importante"
    Se houver erros de validação, eles serão indicados em vermelho.

#### Passo 4: Salvar Alterações

1. Após fazer as mudanças desejadas, clique em **"Salvar Alterações"** (canto inferior direito)
2. Um spinner de carregamento aparecerá durante o processamento
3. Se bem-sucedido, você será redirecionado para a lista de FAQs
4. Mensagem de confirmação: "FAQ atualizada com sucesso!"
5. As alterações estão imediatamente visíveis para usuários (se status = ativo)

#### Passo 5: Visualizar Alterações

1. Opcionalmente, clique em "Visualizar Públicamente" antes de salvar para pré-visualizar
2. Após salvar, você pode clicar novamente para confirmar que as mudanças aparecem corretamente

#### Exemplo Prático: Editando uma FAQ

**Situação:** A FAQ sobre financiamento precisa ser atualizada com informações recentes.

1. Acesse `/admin/faq`
2. Busque por "financiamento"
3. Clique em editar na linha correspondente
4. Modifique a resposta com informações atualizadas sobre taxas
5. Mantenha a pergunta e categoria iguais
6. Clique em "Salvar Alterações"
7. Verifique a página pública para confirmar

### Histórico de Alterações (Se Disponível)

Algumas versões do CMS rastreiam:

- **Data da última modificação**: Mostrada na tabela de listagem
- **Usuário que editou**: Informações de audit trail
- **Versões anteriores**: Possibilidade de reverter para versão anterior

!!! tip "Dica"
    Pergunte ao seu administrador de sistemas se essa funcionalidade está disponível.

---

## DELETE - Excluir FAQ

### Como Remover uma FAQ do Sistema

#### Passo 1: Localizar a FAQ a Deletar

1. Na página `/admin/faq`, procure a FAQ que deseja remover
2. Use a barra de busca ou filtros se necessário
3. Localize a linha correspondente na tabela

#### Passo 2: Iniciar o Processo de Exclusão

**Método 1: Via Ícone de Delete**

1. Clique no ícone de lixeira (delete) na coluna "Ações" da FAQ
2. Uma caixa de diálogo de confirmação aparecerá

**Método 2: Via Página de Edição**

1. Clique no ícone de editar para abrir a FAQ
2. Clique em **"Excluir FAQ"** (botão geralmente em vermelho, canto inferior)
3. Uma caixa de diálogo de confirmação aparecerá

#### Passo 3: Confirmar a Exclusão

**Caixa de Diálogo de Confirmação:**

!!! warning "Confirmação de Exclusão"
    **Mensagem:** "Tem certeza que deseja excluir esta FAQ? Esta ação não pode ser desfeita."
    
    Dados da FAQ aparecerão para confirmação:
    
    - Pergunta
    - Categoria
    - Data de criação

**Opções:**

- **"Cancelar"**: Aborta a exclusão, retorna para a página anterior
- **"Excluir"**: Confirma a exclusão permanente

#### Passo 4: Executar a Exclusão

1. Clique em **"Excluir"** para confirmar
2. Um spinner de carregamento aparecerá
3. A FAQ será removida do banco de dados permanentemente
4. Você será redirecionado para a lista de FAQs
5. Mensagem de confirmação: "FAQ excluída com sucesso!"
6. A FAQ desaparece da tabela e não está mais acessível aos usuários

#### ⚠️ Advertências Importantes

!!! danger "Atenção - Ação Irreversível"
    - **Ação Irreversível**: Deletar uma FAQ não pode ser desfeito (sem backup)
    - **Dados Permanentes**: Todos os dados da FAQ são apagados
    - **Sem Soft Delete**: O sistema não mantém cópia arquivada por padrão

!!! tip "Recomendação"
    Se não tem certeza, marque a FAQ como "Inativa" em vez de deletar. Assim você pode reativá-la posteriormente.

#### Exemplo Prático: Deletando uma FAQ

**Situação:** Uma FAQ sobre processo antigo precisa ser removida do sistema.

1. Acesse `/admin/faq`
2. Busque por "processo antigo"
3. Clique no ícone de lixeira
4. Revise a pergunta na caixa de confirmação
5. Clique em "Excluir"
6. FAQ removida com sucesso
7. A pergunta não aparece mais para usuários

### Alternativa: Desativar em vez de Deletar

Se a FAQ pode ser necessária no futuro:

1. Clique em editar na FAQ
2. Desmarque o toggle **"Status Ativo"**
3. Clique em "Salvar Alterações"
4. A FAQ ficará oculta de usuários, mas os dados permanecerão no sistema
5. Você pode reativá-la a qualquer momento

---

## Fluxo Completo: Exemplo Prático de Todo o CRUD

### Cenário: Gerenciar FAQ sobre FGTS

#### 1. CREATE - Adicionar Nova FAQ

```
1. Acesse /admin/faq
2. Clique em "Nova FAQ"
3. Preencha:
   - Pergunta: "Como usar meu FGTS para comprar imóvel?"
   - Resposta: "Você pode usar o FGTS de três formas: sacar o saldo, 
     usar como entrada ou financiar através de linhas de crédito específicas. 
     Cada modalidade tem requisitos diferentes..."
   - Categoria: financiamento
   - Status: Ativo ✓
4. Clique em "Salvar"
5. FAQ criada com sucesso!
```

#### 2. READ - Visualizar a FAQ

```
1. A FAQ aparece na lista com ID #42
2. Use a busca "FGTS" para localizá-la rapidamente
3. Clique em "Visualizar Públicamente" para ver como o usuário vê
4. A FAQ está visível na seção pública do site
```

#### 3. UPDATE - Editar a FAQ

```
1. Depois de 2 meses, as regras de FGTS mudam
2. Acesse /admin/faq e busque por "FGTS"
3. Clique em editar
4. Atualize a resposta com novas informações
5. Deixe pergunta e categoria iguais
6. Clique em "Salvar Alterações"
7. Usuários veem a informação atualizada imediatamente
```

#### 4. DELETE - Remover a FAQ

```
Após 6 meses, essa modalidade de FGTS é descontinuada

Opção 1: Desativar (se pode ser reativada no futuro)
   - Clique em editar
   - Desmarque "Ativo"
   - Salve

Opção 2: Deletar (se não será necessária novamente)
   - Clique no ícone de lixeira
   - Confirme "Excluir"
   - FAQ removida permanentemente
```

---

## Tratamento de Erros

### Erro: Validação de Campos

**Problema:** "Campo 'Pergunta' é obrigatório"

**Solução:** Preencha o campo Pergunta com texto entre 10 e 500 caracteres.

---

### Erro: Categoria Não Selecionada

**Problema:** "Selecione uma categoria válida"

**Solução:** Clique no dropdown de Categoria e escolha uma das opções disponíveis.

---

### Erro: Resposta Muito Curta

**Problema:** "Resposta deve ter no mínimo 20 caracteres"

**Solução:** Expanda a resposta com mais detalhes e informações.

---

### Erro: Falha ao Salvar

**Problema:** "Erro ao salvar FAQ. Tente novamente."

**Solução:**

1. Verifique sua conexão com a internet
2. Aguarde alguns segundos e tente novamente
3. Recarregue a página (Ctrl+R ou Cmd+R)
4. Contacte o administrador se o problema persistir

---

### Erro: Permissão Negada

**Problema:** "Você não tem permissão para realizar esta ação"

**Solução:** Solicite ao administrador que eleve suas permissões para gerenciar FAQ.

---

## Boas Práticas

### Para Gerenciar FAQs

- ✅ Revise FAQs regularmente para manter informação atualizada
- ✅ Monitore perguntas dos usuários para identificar novos tópicos
- ✅ Remova FAQs desatualizadas ou inúteis
- ✅ Agrupe perguntas similares em uma única FAQ
- ✅ Use tags e categorias consistentemente
- ✅ Teste mudanças na visualização pública antes de ir ao ar

### Para Manutenção

- ✅ Faça backup regularmente do conteúdo
- ✅ Documente mudanças importantes
- ✅ Mantenha histórico de versões quando possível
- ✅ Comunique atualizações importantes ao time

---

## Estrutura de Dados - Modelo de Resposta

### Resposta Bem-Sucedida (Criar/Editar)

**Código HTTP:** 200 ou 201

```json
{
  "sucesso": true,
  "mensagem": "FAQ salva com sucesso",
  "dados": {
    "id": 42,
    "pergunta": "Como usar meu FGTS para comprar imóvel?",
    "resposta": "Você pode usar o FGTS de três formas...",
    "categoria": "financiamento",
    "status": true,
    "tags": ["FGTS", "financiamento", "compra"],
    "dataCriacao": "2024-09-13T14:30:00Z",
    "dataAtualizacao": "2024-09-13T14:30:00Z"
  }
}
```

### Resposta com Erro de Validação

**Código HTTP:** 400

```json
{
  "sucesso": false,
  "mensagem": "Erro de validação",
  "erros": [
    "Campo 'pergunta' é obrigatório",
    "Campo 'resposta' deve ter no mínimo 20 caracteres",
    "Categoria selecionada é inválida"
  ]
}
```

### Resposta - FAQ Não Encontrada

**Código HTTP:** 404

```json
{
  "sucesso": false,
  "mensagem": "FAQ não encontrada",
  "detalhes": "A FAQ com ID #999 não existe no sistema"
}
```

---

## Suporte e Documentação Adicional

Para mais informações ou problemas não cobertos neste guia:

- **Documentação API**: [`api/FAQ.md`](FAQ.md)
- **Sistema de Chat**: [`api/ChatSuporte.md`](ChatSuporte.md)
- **Dashboard**: [`api/dashboard.md`](dashboard.md)

---

!!! info "Nota Importante"
    Este guia é voltado para administradores do CMS. Para informações sobre a API REST do FAQ, consulte a documentação técnica em `api/FAQ.md`.
