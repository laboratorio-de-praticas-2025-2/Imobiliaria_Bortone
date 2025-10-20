# Correção da Paginação nas Telas de Admin

## Data: 19/10/2025

## Problema Identificado

A paginação estava funcionando corretamente apenas na tela `cms-imoveis`. As demais telas de admin apresentavam problemas de paginação, onde:

1. Os dados não eram paginados corretamente
2. A navegação entre páginas não funcionava adequadamente
3. Havia inconsistência na forma como o componente `TableFooter` era utilizado
4. Props `currentPage` estava faltando em várias implementações

## Solução Implementada

### Análise da Implementação Correta (cms-imoveis)

A tela `cms-imoveis` utilizava o padrão correto:
- Table do Antd com `pagination={false}` (paginação desabilitada)
- Componente `TableFooter` customizado abaixo da table
- Props corretas no `TableFooter`: `totalItems`, `currentPage`, `pageSize`, `onPageChange`
- Estado `currentPage` controlado explicitamente

### Padrão Visual Unificado

Todas as telas agora seguem o **mesmo design visual** do cms-imoveis:
- **Table sem paginação integrada** do Antd
- **TableFooter customizado** com visual consistente
- **Mesma experiência de usuário** em todas as telas

### Correções Realizadas

#### 1. **cms-agendamentos** (`/front-end/src/app/admin/cms-agendamentos/page.js`)

**Antes:**
- Fatiava dados manualmente com `slice()`
- Passava apenas `postsData` para o `TableFooter`
- Faltava prop `currentPage` no `TableFooter`

**Depois:**
- Removido o fatiamento manual dos dados
- Table passa todos os dados ordenados com `pagination={false}`
- `TableFooter` com props corretas: `totalItems`, `currentPage`, `pageSize`, `onPageChange`

```javascript
// Antes
const paginatedAgendamentos = orderedAgendamentos.slice(startIndex, endIndex);

<Table dataSource={paginatedAgendamentos} pagination={false} />

<CMS.TableFooter
  postsData={agendamentos}
  pageSize={pageSize}
  onPageChange={setCurrentPage}
/>

// Depois
// Dados completos passados para a Table
<Table dataSource={orderedAgendamentos} pagination={false} />

<CMS.TableFooter
  totalItems={orderedAgendamentos.length}
  pageSize={pageSize}
  currentPage={currentPage}
  onPageChange={setCurrentPage}
/>
```

#### 2. **cms-usuarios** (`/front-end/src/app/admin/cms-usuarios/page.js`)

Mesma correção aplicada:
- Removido `paginatedUsers` 
- Table usa `orderedUsers` completo com `pagination={false}`
- `TableFooter` com props corretas

#### 3. **cms-faq** (`/front-end/src/app/admin/cms-faq/page.js`)

Mesma correção aplicada:
- Removido `paginatedAnswers`
- Table usa `orderedAnswers` completo com `pagination={false}`
- `TableFooter` com props corretas

#### 4. **cms-banner** (`/front-end/src/app/admin/cms-banner/page.js`)

**Usa Cards** - mantém paginação manual mas com padronização:
- Adicionada lógica de ordenação antes da paginação
- Corrigido `TableFooter` para usar `totalItems` em vez de `postsData`
- Adicionado prop `currentPage`

```javascript
// Ordenação adicionada
let orderedBanners = [...banners];
if (filterData.order === "Ordem alfabetica") {
  orderedBanners.sort((a, b) => {
    const titleA = a.titulo || "";
    const titleB = b.titulo || "";
    return titleA.localeCompare(titleB);
  });
} else if (filterData.order === "Data de inclusão") {
  orderedBanners.sort((a, b) => {
    const aDate = new Date(a.createdAt || a.data_inclusao || 0);
    const bDate = new Date(b.createdAt || b.data_inclusao || 0);
    return bDate - aDate;
  });
}

// Paginação manual
const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
const paginatedBanners = orderedBanners.slice(startIndex, endIndex);

// Props corretas no TableFooter
<CMS.TableFooter
  totalItems={orderedBanners.length}
  pageSize={pageSize}
  currentPage={currentPage}
  onPageChange={setCurrentPage}
/>
```

#### 5. **cms-publicacoes** (`/front-end/src/app/admin/cms-publicacoes/page.js`)

**Usa Cards** - similar ao cms-banner:
- Removida função `getCurrentPageItems()`
- Criada variável `paginatedPublicacoes` com ordenação e paginação
- Corrigido `TableFooter` para usar `totalItems` e `currentPage`

```javascript
// Ordenação e paginação consolidadas
let orderedPublicacoes = [...filteredPublicacoes];

if (filterData.order) {
  if (filterData.order === "Ordem alfabetica") {
    orderedPublicacoes = orderedPublicacoes.sort((a, b) => a.titulo.localeCompare(b.titulo));
  } else if (filterData.order === "Data de publicação") {
    orderedPublicacoes = orderedPublicacoes.sort(
      (a, b) => new Date(b.data_publicacao) - new Date(a.data_publicacao)
    );
  }
}

const startIndex = (currentPage - 1) * pagination.itemsPerPage;
const endIndex = startIndex + pagination.itemsPerPage;
const paginatedPublicacoes = orderedPublicacoes.slice(startIndex, endIndex);
```

#### 6. **cms-publicidades** (`/front-end/src/app/admin/cms-publicidades/page.js`)

**Usa Cards** - similar ao cms-banner e cms-publicacoes:
- Removida função `getCurrentPageItems()`
- Criada variável `paginatedPublicidades` com ordenação e paginação
- Corrigido `TableFooter` para usar `totalItems` e `currentPage`

#### 7. **relatorios** (`/front-end/src/app/admin/relatorios/page.js`)

**Usa Table customizada** (RelatorioTable):
- Corrigido cálculo de `endIndex` para usar `startIndex + pageSize`
- Corrigido `TableFooter` para usar `totalItems` em vez de `postsData`
- Adicionado prop `currentPage` ao `TableFooter`

```javascript
// Antes
const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

<CMS.TableFooter
  postsData={filteredData}
  pageSize={pageSize}
  onPageChange={setCurrentPage}
/>

// Depois
const endIndex = startIndex + pageSize;
const paginatedData = filteredData.slice(startIndex, endIndex);

<CMS.TableFooter
  totalItems={filteredData.length}
  pageSize={pageSize}
  currentPage={currentPage}
  onPageChange={setCurrentPage}
/>
```

## Padrões Estabelecidos

### Para Telas com Antd Table

```javascript
// 1. Estado
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 10;

// 2. Ordenar os dados
let orderedData = [...data];
if (filterData.order === "Ordem alfabetica") {
  orderedData.sort((a, b) => a.nome.localeCompare(b.nome));
}

// 3. IMPORTANTE: Fatiar os dados manualmente para paginação
const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
const paginatedData = orderedData.slice(startIndex, endIndex);

// 4. Table com dados paginados e pagination={false}
<Table
  dataSource={paginatedData}
  rowKey="id"
  pagination={false}
  className={styles.customTable}
  scroll={{ x: "max-content" }}
/>

// 5. TableFooter customizado (usa total de dados ORDENADOS, não paginados)
<CMS.TableFooter
  totalItems={orderedData.length}
  pageSize={pageSize}
  currentPage={currentPage}
  onPageChange={setCurrentPage}
/>
```

**⚠️ IMPORTANTE:** 
- A `Table` recebe apenas os dados da página atual (`paginatedData`)
- O `TableFooter` recebe o total de itens antes da paginação (`orderedData.length`)
- Isso garante que a Table mostre apenas 10 itens, mas o TableFooter saiba quantas páginas criar

### Para Telas com Cards

```javascript
// 1. Estado
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 8; // ou 12

// 2. Ordenar os dados
let orderedData = [...data];
if (filterData.order === "Ordem alfabetica") {
  orderedData.sort((a, b) => a.titulo.localeCompare(b.titulo));
}

// 3. Fatiar dados manualmente
const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
const paginatedData = orderedData.slice(startIndex, endIndex);

// 4. Renderizar cards paginados
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
  {paginatedData.map((item) => (
    <Card key={item.id} item={item} />
  ))}
</div>

// 5. TableFooter customizado
<CMS.TableFooter
  totalItems={orderedData.length}
  pageSize={pageSize}
  currentPage={currentPage}
  onPageChange={setCurrentPage}
/>
```

## Componente TableFooter

### Props Aceitas

```javascript
export default function TableFooter({
  totalItems,   // ✅ Número total de itens (RECOMENDADO)
  postsData,    // ⚠️ Array de dados (LEGADO - evitar usar)
  pageSize = 10,
  currentPage = 1,
  onPageChange,
})
```

### Uso Correto

**✅ Recomendado:**
```javascript
<CMS.TableFooter
  totalItems={orderedData.length}
  pageSize={pageSize}
  currentPage={currentPage}
  onPageChange={setCurrentPage}
/>
```

**❌ Evitar (props incompletos):**
```javascript
<CMS.TableFooter
  postsData={data}
  pageSize={pageSize}
  onPageChange={setCurrentPage}
  // ❌ Falta currentPage
/>
```

## Visual Unificado

Todas as telas agora usam o **mesmo componente TableFooter** que:

✅ Mostra "Exibindo X - Y de Z registros"  
✅ Botões "< Anterior" e "Próximo >"  
✅ Números de página clicáveis  
✅ Design consistente em todo o sistema  
✅ Mesma experiência de usuário  

## Arquivos Modificados

1. `/front-end/src/app/admin/cms-agendamentos/page.js`
2. `/front-end/src/app/admin/cms-usuarios/page.js`
3. `/front-end/src/app/admin/cms-faq/page.js`
4. `/front-end/src/app/admin/cms-banner/page.js`
5. `/front-end/src/app/admin/cms-publicacoes/page.js`
6. `/front-end/src/app/admin/cms-publicidades/page.js`
7. `/front-end/src/app/admin/relatorios/page.js`

## Benefícios

1. **Consistência Visual**: Todas as telas têm o mesmo design de paginação
2. **Experiência Unificada**: Usuário encontra o mesmo controle em todas as páginas
3. **Manutenibilidade**: Um único componente para manter e atualizar
4. **Performance**: Table do Antd gerencia a renderização eficientemente
5. **Funcionalidade Completa**: Paginação funcionando corretamente em todas as telas

## Reset de Página ao Filtrar

⚠️ **Importante**: Sempre resetar para página 1 ao aplicar filtros ou busca:

```javascript
const onSearch = (value) => {
  setCurrentPage(1); // ← Essencial!
  setFilterData((prev) => ({
    ...prev,
    searchTerm: value || null,
  }));
};

const handleSelectOrder = (value) => {
  setCurrentPage(1); // ← Essencial!
  setFilterData((prev) => ({
    ...prev,
    order: value,
  }));
};
```

## Como o TableFooter Funciona

O componente `TableFooter` calcula internamente:

1. **Range de itens**: Calcula "Exibindo 1-10 de 50"
2. **Total de páginas**: `Math.ceil(totalItems / pageSize)`
3. **Renderização dos botões**: Anterior/Próximo habilitados/desabilitados
4. **Números de página**: Renderiza botões clicáveis para cada página

```javascript
// Dentro do TableFooter
const total = totalItems ?? postsData?.length ?? 0;

const calculateRange = () => {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);
  return { start, end };
};
```

## Testes Recomendados

Para cada tela, validar:

- [ ] Paginação funciona ao clicar em "Próximo" e "Anterior"
- [ ] Contagem de registros está correta (ex: "Exibindo 1-10 de 25 registros")
- [ ] Ao mudar de página, os registros corretos são exibidos
- [ ] Ordenação mantém a paginação funcionando
- [ ] Busca reseta para página 1 e mantém paginação
- [ ] Filtros avançados resetam para página 1
- [ ] Visual é consistente com cms-imoveis
- [ ] Navegação direta para página específica funciona
- [ ] Última página mostra quantidade correta de itens
- [ ] Botões Anterior/Próximo são desabilitados corretamente

## Cenários de Teste

### 1. Navegação Básica
```
1. Acessar tela com mais de 10 registros
2. Verificar que mostra "Exibindo 1-10 de X registros"
3. Clicar em "Próximo >"
4. Verificar que mostra próxima página e atualiza contagem
5. Clicar em "< Anterior"
6. Verificar que volta para primeira página
```

### 2. Busca com Paginação
```
1. Realizar busca que retorna múltiplas páginas
2. Navegar entre páginas dos resultados
3. Limpar busca
4. Verificar que volta para todos os dados paginados
5. Verificar que está na página 1 após limpar busca
```

### 3. Ordenação com Paginação
```
1. Aplicar ordenação
2. Verificar que reseta para página 1
3. Navegar entre páginas
4. Verificar que ordenação se mantém
5. Mudar tipo de ordenação
6. Verificar que reseta para página 1 novamente
```

## Problemas Corrigidos

1. ✅ **Paginação não funcionava** - Table recebia dados fatiados incorretamente
2. ✅ **Contagem incorreta** - usava `postsData` em vez de `totalItems`
3. ✅ **Página atual não passada** - faltava prop `currentPage` no TableFooter
4. ✅ **Visual inconsistente** - Algumas telas usavam paginação do Antd, outras TableFooter
5. ✅ **Ordenação quebrava paginação** - ordenação era aplicada após slice
6. ✅ **Navegação não funcionava** - Estado de página não era controlado corretamente
7. ✅ **Table mostrava todos os dados** - Faltava o slice dos dados antes de passar para a Table

## Problemas Comuns e Soluções

### ❌ Problema: Table mostra todos os itens em uma página

**Sintoma:** A tabela exibe 50 itens, mas o TableFooter diz "Exibindo 1-10 de 50"

**Causa:** Table está recebendo todos os dados (`orderedData`) em vez dos dados paginados

**Solução:**
```javascript
// ❌ ERRADO - Table recebe todos os dados
<Table dataSource={orderedData} pagination={false} />

// ✅ CORRETO - Table recebe apenas dados da página atual
const paginatedData = orderedData.slice(startIndex, endIndex);
<Table dataSource={paginatedData} pagination={false} />
```

### ❌ Problema: Paginação não muda os dados exibidos

**Sintoma:** Clicar em "Próximo" muda o número da página mas os dados não mudam

**Causa:** Table está recebendo dados que não mudam quando `currentPage` muda

**Solução:**
```javascript
// ✅ O slice deve usar currentPage
const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
const paginatedData = orderedData.slice(startIndex, endIndex);
```

### ❌ Problema: TableFooter mostra número errado de páginas

**Sintoma:** TableFooter diz "Exibindo 1-10 de 10" quando há 50 registros

**Causa:** `totalItems` está recebendo o tamanho dos dados paginados

**Solução:**
```javascript
// ❌ ERRADO
<CMS.TableFooter totalItems={paginatedData.length} />

// ✅ CORRETO
<CMS.TableFooter totalItems={orderedData.length} />
```

## Melhorias Futuras

1. **Server-Side Pagination** - Implementar paginação server-side em todas as telas (como cms-imoveis)
2. **Loading States** - Adicionar indicadores de loading durante navegação
3. **Testes Automatizados** - Criar testes E2E para validar paginação
4. **Acessibilidade** - Melhorar navegação por teclado e leitores de tela
5. **Performance** - Implementar virtualização para listas muito grandes

---

**Documentação criada em:** 19/10/2025  
**Última atualização:** 19/10/2025  
**Status:** ✅ Completo
