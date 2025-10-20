# Documentação de Componentização do Frontend

## Visão Geral

Esta documentação descreve a estrutura de componentização do frontend da Imobiliária Bortone, desenvolvido em **Next.js 14** com **App Router**. O projeto utiliza uma arquitetura modular baseada em componentes reutilizáveis, seguindo as melhores práticas de React e Next.js.

---

## 🏗️ Arquitetura de Componentes

### Estrutura de Diretórios

```
front-end/src/components/
├── auth/                    # Componentes de autenticação
│   ├── AdminRoute.js       # HOC para rotas administrativas
│   ├── ConditionalAuth.js  # Autenticação condicional
│   └── ProtectedRoute.js   # HOC para rotas protegidas
│
├── blog/                    # Componentes do blog
│   └── [componentes de blog]
│
├── chat/                    # Sistema de chat
│   └── [componentes de chat]
│
├── cms/                     # Componentes do CMS (Admin)
│   ├── Card.js             # Card reutilizável do dashboard
│   ├── ConfirmModal.js     # Modal de confirmação
│   ├── DropdownFilterPublicidade.js
│   ├── FaqModal.js         # Modal para gerenciar FAQs
│   ├── PostCard.js         # Card para posts do blog
│   ├── Sidebar.js          # Barra lateral do admin
│   ├── SidebarLinks.js     # Links da sidebar
│   ├── SidebarNav.js       # Navegação da sidebar
│   ├── form/               # Componentes de formulário
│   └── table/              # Componentes de tabela
│
├── Contato/                 # Componentes de contato
│   └── [formulários de contato]
│
├── dash/                    # Dashboard
│   └── [componentes do dashboard]
│
├── faq/                     # FAQ público
│   └── [componentes de FAQ]
│
├── home/                    # Página inicial
│   ├── Header.js           # Cabeçalho principal
│   ├── HeaderSlider.js     # Slider do cabeçalho
│   ├── HomeFooter.js       # Rodapé da home
│   ├── HomeNavbar.js       # Navegação da home
│   ├── ImovelCard.js       # Card de imóvel
│   ├── PropriedadesSelecionadas.js
│   └── PublicidadeCarousel.js
│
├── mapa/                    # Componentes de mapa
│   └── [componentes do Google Maps]
│
├── notifications/           # Sistema de notificações
│   └── [componentes de notificação]
│
├── relatorio/              # Relatórios
│   └── [componentes de relatório]
│
├── SEO/                    # Componentes de SEO
│   └── [meta tags, structured data]
│
├── simulacao/              # Simulador de financiamento
│   └── [componentes de simulação]
│
├── ui/                     # Componentes UI reutilizáveis
│   └── CloudinaryImage.js # Componente de imagem otimizada
│
├── vitrine/                # Vitrine de imóveis
│   ├── DropdownFilter.js  # Filtro dropdown
│   ├── Filtros.js         # Sistema de filtros
│   ├── GridImoveis.js     # Grid de imóveis
│   ├── GridImoveisFooter.js
│   ├── ImageCarroussel.js # Carrossel de imagens
│   ├── ImovelCard.js      # Card de imóvel na vitrine
│   ├── LocationInput.js   # Input de localização
│   └── PesquisaAvancada/  # Busca avançada
│
├── DebugAuth.js            # Componente de debug
├── Popup.js                # Popup genérico
├── PublicidadeImage.js     # Imagem de publicidade
└── SplashScreen.js         # Tela de carregamento
```

---

## 📦 Categorias de Componentes

### 1. Componentes de Autenticação (`auth/`)

#### `ProtectedRoute.js`
**Propósito:** Higher-Order Component (HOC) para proteger rotas que requerem autenticação.

**Funcionalidades:**
- Verifica se o usuário está autenticado
- Redireciona para login se não autenticado
- Suporta níveis de acesso (admin, operador, cliente)

**Uso:**
```javascript
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function MinhaRota() {
  return (
    <ProtectedRoute>
      <ConteudoProtegido />
    </ProtectedRoute>
  );
}
```

#### `AdminRoute.js`
**Propósito:** HOC específico para rotas administrativas.

**Funcionalidades:**
- Verifica se o usuário tem permissões de administrador
- Redireciona usuários não autorizados
- Integrado com sistema de níveis de usuário

**Uso:**
```javascript
import AdminRoute from '@/components/auth/AdminRoute';

export default function PainelAdmin() {
  return (
    <AdminRoute>
      <DashboardAdmin />
    </AdminRoute>
  );
}
```

#### `ConditionalAuth.js`
**Propósito:** Renderiza componentes diferentes baseado no estado de autenticação.

**Uso:**
```javascript
<ConditionalAuth
  authenticated={<ComponenteAutenticado />}
  unauthenticated={<ComponentePublico />}
/>
```

---

### 2. Componentes CMS/Admin (`cms/`)

#### `Sidebar.js`, `SidebarNav.js`, `SidebarLinks.js`
**Propósito:** Sistema de navegação lateral do painel administrativo.

**Funcionalidades:**
- Menu lateral colapsável
- Links organizados por categoria
- Indicador de rota ativa
- Responsivo para mobile

**Estrutura:**
```javascript
<Sidebar>
  <SidebarNav>
    <SidebarLinks links={adminLinks} />
  </SidebarNav>
</Sidebar>
```

#### `Card.js`
**Propósito:** Card reutilizável para dashboard e listagens.

**Props:**
- `title`: Título do card
- `subtitle`: Subtítulo ou descrição
- `icon`: Ícone do card
- `children`: Conteúdo interno
- `actions`: Botões de ação

**Uso:**
```javascript
<Card 
  title="Total de Imóveis" 
  subtitle="150 propriedades"
  icon={<HomeIcon />}
>
  <ConteudoDoCard />
</Card>
```

#### `ConfirmModal.js`
**Propósito:** Modal de confirmação para ações destrutivas.

**Props:**
- `isOpen`: Controla visibilidade
- `onConfirm`: Callback de confirmação
- `onCancel`: Callback de cancelamento
- `title`: Título do modal
- `message`: Mensagem de confirmação
- `confirmText`: Texto do botão confirmar
- `cancelText`: Texto do botão cancelar
- `variant`: 'danger' | 'warning' | 'info'

**Uso:**
```javascript
<ConfirmModal
  isOpen={showModal}
  onConfirm={handleDelete}
  onCancel={() => setShowModal(false)}
  title="Confirmar Exclusão"
  message="Tem certeza que deseja excluir este imóvel?"
  confirmText="Excluir"
  variant="danger"
/>
```

#### `FaqModal.js`
**Propósito:** Modal para criar/editar FAQs no CMS.

**Funcionalidades:**
- Formulário de pergunta e resposta
- Seleção de categoria
- Toggle de status (ativo/inativo)
- Validação de campos

#### Componentes de Formulário (`cms/form/`)

Componentes reutilizáveis para formulários administrativos:
- Input de texto
- Textarea
- Select/Dropdown
- Checkbox/Radio
- Upload de arquivos
- Editor de texto rico (WYSIWYG)

#### Componentes de Tabela (`cms/table/`)

Componentes para tabelas administrativas:
- Tabela com paginação
- Ordenação de colunas
- Filtros inline
- Ações por linha (editar, deletar)
- Seleção múltipla

---

### 3. Componentes de Vitrine (`vitrine/`)

#### `GridImoveis.js`
**Propósito:** Grid responsivo de imóveis.

**Funcionalidades:**
- Layout em grid responsivo
- Suporte a paginação
- Loading states
- Empty states

**Uso:**
```javascript
<GridImoveis 
  imoveis={imoveis}
  loading={isLoading}
  onPageChange={handlePageChange}
/>
```

#### `ImovelCard.js`
**Propósito:** Card individual de imóvel na vitrine.

**Props:**
- `imovel`: Objeto com dados do imóvel
- `onClick`: Callback ao clicar
- `showActions`: Mostra ações (favoritar, compartilhar)
- `variant`: 'default' | 'compact' | 'featured'

**Estrutura do Card:**
```javascript
<ImovelCard>
  <ImageCarroussel images={imovel.imagens} />
  <CardBody>
    <Title>{imovel.titulo}</Title>
    <Location>{imovel.localizacao}</Location>
    <Price>{imovel.preco}</Price>
    <Features>
      <Feature icon={<BedIcon />}>{imovel.quartos}</Feature>
      <Feature icon={<BathIcon />}>{imovel.banheiros}</Feature>
      <Feature icon={<AreaIcon />}>{imovel.area}</Feature>
    </Features>
  </CardBody>
</ImovelCard>
```

#### `Filtros.js`
**Propósito:** Sistema de filtros para busca de imóveis.

**Funcionalidades:**
- Filtro por tipo (casa, apartamento, terreno)
- Filtro por faixa de preço
- Filtro por localização
- Filtro por características (quartos, banheiros, área)
- Reset de filtros

**Uso:**
```javascript
<Filtros
  onFilterChange={handleFilterChange}
  initialFilters={filters}
/>
```

#### `ImageCarroussel.js`
**Propósito:** Carrossel de imagens de imóveis.

**Funcionalidades:**
- Navegação por setas
- Indicadores de página
- Swipe em mobile
- Lightbox para visualização ampliada
- Lazy loading de imagens

#### `PesquisaAvancada/`
**Propósito:** Componentes de busca avançada de imóveis.

**Funcionalidades:**
- Múltiplos critérios de busca
- Filtros combinados
- Salvamento de buscas
- Sugestões de busca

---

### 4. Componentes de Home (`home/`)

#### `HomeNavbar.js`
**Propósito:** Barra de navegação principal do site.

**Funcionalidades:**
- Logo da imobiliária
- Menu de navegação
- Botões de login/cadastro
- Menu mobile (hamburger)
- Indicador de rota ativa

#### `HeaderSlider.js`
**Propósito:** Slider de destaque na home.

**Funcionalidades:**
- Carrossel automático
- Imagens de banners
- Call-to-actions
- Navegação manual

#### `PropriedadesSelecionadas.js`
**Propósito:** Seção de imóveis em destaque na home.

**Funcionalidades:**
- Exibe imóveis selecionados
- Carrossel de propriedades
- Link para vitrine completa

#### `PublicidadeCarousel.js`
**Propósito:** Carrossel de publicidade.

**Funcionalidades:**
- Banners publicitários rotativos
- Links externos
- Tracking de cliques

---

### 5. Componentes UI Reutilizáveis (`ui/`)

#### `CloudinaryImage.js`
**Propósito:** Componente otimizado para imagens do Cloudinary.

**Funcionalidades:**
- Otimização automática de imagens
- Lazy loading
- Placeholder blur
- Responsive images
- Transformações dinâmicas

**Props:**
- `src`: URL da imagem no Cloudinary
- `alt`: Texto alternativo
- `width`: Largura
- `height`: Altura
- `quality`: Qualidade (1-100)
- `transform`: Transformações customizadas

**Uso:**
```javascript
<CloudinaryImage
  src="imobiliaria/imoveis/imovel_123.jpg"
  alt="Casa em São Paulo"
  width={800}
  height={600}
  quality={80}
  transform={{ crop: 'fill', gravity: 'auto' }}
/>
```

**Benefícios:**
- ✅ Carregamento otimizado
- ✅ Formato automático (WebP, AVIF)
- ✅ CDN global (Cloudinary)
- ✅ Redimensionamento dinâmico

---

### 6. Componentes de Chat (`chat/`)

**Funcionalidades:**
- Chat em tempo real (WebSocket)
- Interface de conversação
- Indicadores de digitação
- Notificações de mensagens
- Histórico de conversas

---

### 7. Componentes de Mapa (`mapa/`)

**Funcionalidades:**
- Integração com Google Maps API
- Marcadores de imóveis
- InfoWindows personalizadas
- Filtros no mapa
- Clustering de marcadores

---

### 8. Componentes SEO (`SEO/`)

**Funcionalidades:**
- Meta tags dinâmicas
- Open Graph
- Twitter Cards
- Schema.org (JSON-LD)
- Canonical URLs

**Uso:**
```javascript
import SEO from '@/components/SEO';

<SEO
  title="Casa 3 Quartos - São Paulo"
  description="Bela casa com 3 quartos..."
  image="https://..."
  type="product"
/>
```

---

## 🎨 Padrões de Componentização

### 1. Componentes Funcionais

Todos os componentes utilizam a sintaxe de componentes funcionais com Hooks:

```javascript
import { useState, useEffect } from 'react';

export default function MeuComponente({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### 2. Componentes Client vs Server

**Server Components (padrão no Next.js 14):**
```javascript
// app/page.js
export default async function Page() {
  const data = await fetchData(); // Fetch no servidor
  return <Component data={data} />;
}
```

**Client Components (com interatividade):**
```javascript
'use client'; // Diretiva obrigatória

import { useState } from 'react';

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 3. Composição de Componentes

Preferência por composição ao invés de herança:

```javascript
// ❌ Evitar herança
class ImovelCard extends BaseCard { }

// ✅ Usar composição
function ImovelCard({ children, ...props }) {
  return (
    <Card {...props}>
      {children}
    </Card>
  );
}
```

### 4. Props Destructuring

```javascript
// ✅ Bom
function Component({ title, description, onClick }) {
  return <div onClick={onClick}>...</div>;
}

// ❌ Evitar
function Component(props) {
  return <div onClick={props.onClick}>...</div>;
}
```

### 5. PropTypes ou TypeScript

Para validação de tipos (se usando TypeScript):

```typescript
interface ComponentProps {
  title: string;
  count?: number;
  onAction: () => void;
}

export default function Component({ title, count = 0, onAction }: ComponentProps) {
  // ...
}
```

---

## 🔄 Fluxo de Dados

### 1. Props Down, Events Up

```javascript
// Parent
function Parent() {
  const [value, setValue] = useState('');
  
  return (
    <Child 
      value={value} 
      onChange={(newValue) => setValue(newValue)} 
    />
  );
}

// Child
function Child({ value, onChange }) {
  return (
    <input 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
    />
  );
}
```

### 2. Context para Estado Global

```javascript
// contexts/AuthContext.js
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

### 3. Custom Hooks para Lógica Reutilizável

```javascript
// hooks/useImoveis.js
export function useImoveis(filters) {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImoveis(filters).then(data => {
      setImoveis(data);
      setLoading(false);
    });
  }, [filters]);

  return { imoveis, loading };
}
```

---

## 🖼️ Gerenciamento de Imagens

### Integração com Cloudinary

Todas as imagens do sistema utilizam o Cloudinary para:

- ✅ Upload direto do frontend
- ✅ Otimização automática
- ✅ CDN global
- ✅ Transformações dinâmicas
- ✅ Armazenamento permanente

**Componente Principal:**
```javascript
import CloudinaryImage from '@/components/ui/CloudinaryImage';

<CloudinaryImage
  src="imobiliaria/imoveis/foto.jpg"
  alt="Descrição"
  width={800}
  height={600}
/>
```

**Serviço de Upload:**
```javascript
import { uploadImovelImage } from '@/services/netlifyUploadService';

const url = await uploadImovelImage(file, imovelId);
```

---

## 📱 Responsividade

### Mobile-First Approach

Todos os componentes são desenvolvidos com abordagem mobile-first:

```css
/* Mobile (padrão) */
.component {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .component {
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .component {
    padding: 3rem;
  }
}
```

### Breakpoints

```javascript
const breakpoints = {
  sm: '640px',   // Mobile grande
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Desktop grande
  '2xl': '1536px' // Ultra-wide
};
```

---

## 🧪 Testes de Componentes

### Estrutura de Testes

```javascript
// __tests__/ImovelCard.test.js
import { render, screen } from '@testing-library/react';
import ImovelCard from '@/components/vitrine/ImovelCard';

describe('ImovelCard', () => {
  it('renderiza o título do imóvel', () => {
    render(<ImovelCard imovel={mockImovel} />);
    expect(screen.getByText('Casa em São Paulo')).toBeInTheDocument();
  });
});
```

---

## 🎯 Boas Práticas

### 1. Nomenclatura

- ✅ Componentes em PascalCase: `ImovelCard.js`
- ✅ Hooks em camelCase: `useImoveis.js`
- ✅ Utilitários em camelCase: `formatPrice.js`

### 2. Organização de Imports

```javascript
// 1. Imports do React/Next
import { useState } from 'react';
import Link from 'next/link';

// 2. Imports de bibliotecas externas
import axios from 'axios';

// 3. Imports de componentes
import ImovelCard from '@/components/vitrine/ImovelCard';

// 4. Imports de utilitários
import { formatPrice } from '@/utils/format';

// 5. Imports de estilos
import styles from './styles.module.css';
```

### 3. Performance

- ✅ Usar `React.memo()` para componentes puros
- ✅ Lazy loading de componentes pesados
- ✅ Debounce em inputs de busca
- ✅ Virtualização de listas longas

### 4. Acessibilidade

- ✅ Usar tags semânticas HTML
- ✅ Atributos ARIA quando necessário
- ✅ Suporte a navegação por teclado
- ✅ Contraste adequado de cores

---

## 🚀 Próximos Passos

### Melhorias Futuras

1. **Migração para TypeScript**
   - Type safety completo
   - Melhor autocomplete
   - Menos bugs em produção

2. **Storybook**
   - Documentação visual de componentes
   - Testes de UI isolados
   - Design system

3. **Component Library**
   - Biblioteca de componentes reutilizáveis
   - Temas customizáveis
   - Tokens de design

4. **Testes E2E**
   - Cypress ou Playwright
   - Testes de fluxos completos
   - CI/CD integrado

---

## 📚 Referências

- [Documentação Next.js](https://nextjs.org/docs)
- [React Best Practices](https://react.dev/learn)
- [Cloudinary React SDK](https://cloudinary.com/documentation/react_integration)
- [Componentes Acessíveis](https://www.w3.org/WAI/ARIA/apg/)

---

## 🔗 Documentação Relacionada

- [Arquitetura Cloudinary](../CloudinaryArchitecture.md)
- [Configuração Next.js](NextConfig.md)
- [API de Imagens](../api/imagens.md)
- [Sistema de Chat](../api/ChatSuporte.md)
