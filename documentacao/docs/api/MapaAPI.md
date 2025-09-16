# API de Mapa - Imobiliária Bortone

## Visão Geral

A API de Mapa fornece funcionalidades para busca e gerenciamento de imóveis com foco em localização geográfica, permitindo filtros avançados e busca por coordenadas para integração com mapas interativos.

## Estrutura de Arquivos

```
back-end/src/
├── models/
│   └── mapaModels.js          # Modelos Sequelize para imóveis e relacionamentos
├── controllers/
│   └── mapaController.js      # Controladores das rotas de mapa
├── services/
│   └── mapaService.js         # Lógica de negócio para operações de mapa
├── routes/
│   └── mapaRoutes.js          # Definição das rotas da API
├── middlewares/
│   └── validacaoMapa.js       # Middleware de tratamento de erros
└── app.js                     # Configuração principal (atualizado)
```

## Modelos de Dados

### Usuario
```javascript
{
  id: INTEGER (PK, AutoIncrement),
  nome: STRING(100),
  email: STRING(100, Unique),
  senha: STRING(255),
  nivel: ENUM('visitante', 'administrador'),
  celular: STRING(20)
}
```

### Imovel
```javascript
{
  id: INTEGER (PK, AutoIncrement),
  tipo: STRING(50),
  endereco: STRING(255),
  cidade: STRING(100),
  estado: STRING(2),
  preco: DECIMAL(12,2),
  status: STRING(20),
  area: INTEGER,
  descricao: TEXT,
  data_cadastro: DATEONLY,
  murado: BOOLEAN,
  latitude: DECIMAL(10,7),
  longitude: DECIMAL(10,7),
  usuario_id: INTEGER (FK),
  tipo_negociacao: ENUM('venda', 'aluguel')
}
```

### Casa
```javascript
{
  id: INTEGER (PK, AutoIncrement),
  imovel_id: INTEGER (FK),
  quartos: INTEGER,
  banheiros: INTEGER,
  vagas: INTEGER,
  possui_piscina: BOOLEAN,
  possui_jardim: BOOLEAN
}
```

### ImagemImovel
```javascript
{
  id: INTEGER (PK, AutoIncrement),
  imovel_id: INTEGER (FK),
  url_imagem: STRING(255),
  descricao: STRING(255)
}
```

## Endpoints da API

### Base URL
```
http://localhost:4000/mapa
```

### 1. Listar Imóveis
**GET** `/mapa`

Lista todos os imóveis com filtros opcionais.

#### Query Parameters
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `tipo` | string | Tipo do imóvel |
| `precoMin` | number | Preço mínimo |
| `precoMax` | number | Preço máximo |
| `areaMin` | number | Área mínima |
| `areaMax` | number | Área máxima |
| `tipoNegociacao` | string | 'venda' ou 'aluguel' |
| `cidade` | string | Nome da cidade |
| `estado` | string | Sigla do estado |
| `murado` | boolean | Se possui muro |
| `latitude` | number | Latitude para busca por região |
| `longitude` | number | Longitude para busca por região |
| `raio` | number | Raio de busca em graus |

#### Exemplo de Requisição
```http
GET /mapa?tipo=casa&precoMin=100000&precoMax=500000&cidade=São Paulo
```

#### Exemplo de Resposta
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tipo": "casa",
      "endereco": "Rua das Flores, 123",
      "cidade": "São Paulo",
      "estado": "SP",
      "preco": "350000.00",
      "area": 120,
      "latitude": "-23.5505",
      "longitude": "-46.6333",
      "casa": {
        "quartos": 3,
        "banheiros": 2,
        "vagas": 2,
        "possui_piscina": true,
        "possui_jardim": true
      },
      "imagem_imovels": [
        {
          "url_imagem": "https://example.com/imagem1.jpg",
          "descricao": "Fachada da casa"
        }
      ]
    }
  ],
  "total": 1
}
```

### 2. Buscar Imóveis para Mapa
**GET** `/mapa/busca`

Busca imóveis com filtros específicos para exibição em mapa.

#### Query Parameters
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `tipo` | string | Tipo do imóvel |
| `precoMin` | number | Preço mínimo |
| `precoMax` | number | Preço máximo |
| `areaMin` | number | Área mínima |
| `areaMax` | number | Área máxima |
| `quartos` | number | Número de quartos |
| `banheiros` | number | Número de banheiros |
| `possuiPiscina` | boolean | Se possui piscina |
| `possuiJardim` | boolean | Se possui jardim |
| `murado` | boolean | Se possui muro |

#### Exemplo de Requisição
```http
GET /mapa/busca?quartos=3&possuiPiscina=true&precoMax=400000
```

### 3. Buscar por Coordenadas
**GET** `/mapa/coordenadas`

Busca imóveis próximos a uma coordenada geográfica.

#### Query Parameters
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `lat` | number | Sim | Latitude |
| `lng` | number | Sim | Longitude |
| `raio` | number | Não | Raio de busca (padrão: 0.01) |

#### Exemplo de Requisição
```http
GET /mapa/coordenadas?lat=-23.5505&lng=-46.6333&raio=0.01
```

#### Exemplo de Resposta
```json
{
  "success": true,
  "data": [...],
  "total": 5,
  "coordenadas": {
    "latitude": -23.5505,
    "longitude": -46.6333,
    "raio": 0.01
  }
}
```

### 4. Buscar Imóvel por ID
**GET** `/mapa/:id`

Busca um imóvel específico por seu ID.

#### Path Parameters
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | integer | ID do imóvel |

#### Exemplo de Requisição
```http
GET /mapa/123
```

#### Exemplo de Resposta
```json
{
  "success": true,
  "data": {
    "id": 123,
    "tipo": "casa",
    "endereco": "Rua das Flores, 123",
    "cidade": "São Paulo",
    "estado": "SP",
    "preco": "350000.00",
    "area": 120,
    "descricao": "Casa térrea com 3 quartos...",
    "latitude": "-23.5505",
    "longitude": "-46.6333",
    "casa": {
      "quartos": 3,
      "banheiros": 2,
      "vagas": 2,
      "possui_piscina": true,
      "possui_jardim": true
    },
    "imagem_imovels": [...],
    "usuario": {
      "nome": "João Silva",
      "celular": "(11) 99999-9999"
    }
  }
}
```

### 5. Listar Tipos de Imóveis
**GET** `/mapa/tipos`

Lista todos os tipos de imóveis disponíveis.

#### Exemplo de Resposta
```json
{
  "success": true,
  "data": ["casa", "apartamento", "terreno", "comercial"]
}
```

### 6. Listar Cidades
**GET** `/mapa/cidades`

Lista todas as cidades disponíveis.

#### Exemplo de Resposta
```json
{
  "success": true,
  "data": ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador"]
}
```

## Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 400 | Erro de validação (parâmetros inválidos) |
| 404 | Imóvel não encontrado |
| 500 | Erro interno do servidor |
| 503 | Erro de conexão com banco de dados |
| 408 | Timeout na operação |

## Tratamento de Erros

A API retorna erros no seguinte formato:

```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Detalhes técnicos do erro"
}
```

### Tipos de Erro

1. **Erro de Validação (400)**
```json
{
  "success": false,
  "message": "Erro de validação",
  "errors": [
    {
      "field": "precoMin",
      "message": "Preço mínimo deve ser um número"
    }
  ]
}
```

2. **Imóvel Não Encontrado (404)**
```json
{
  "success": false,
  "message": "Imóvel não encontrado"
}
```

3. **Erro de Conexão (503)**
```json
{
  "success": false,
  "message": "Erro de conexão com o banco de dados"
}
```

## Exemplos de Uso

### Busca Básica
```javascript
// Buscar casas em São Paulo com preço entre 200k e 500k
fetch('/mapa?tipo=casa&cidade=São Paulo&precoMin=200000&precoMax=500000')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Busca por Coordenadas
```javascript
// Buscar imóveis próximos ao centro de São Paulo
fetch('/mapa/coordenadas?lat=-23.5505&lng=-46.6333&raio=0.02')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Busca para Mapa
```javascript
// Buscar casas com 3+ quartos e piscina para exibir no mapa
fetch('/mapa/busca?quartos=3&possuiPiscina=true')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Relacionamentos

- **Usuario** → **Imovel** (1:N)
- **Imovel** → **Casa** (1:1)
- **Imovel** → **ImagemImovel** (1:N)

## Notas Técnicas

- Todas as coordenadas são armazenadas em formato decimal
- O raio de busca é especificado em graus (0.01 ≈ 1.1km)
- Filtros de texto usam busca com LIKE (case-insensitive)
- Ordenação padrão: data de cadastro (mais recentes primeiro)
- Suporte a paginação pode ser implementado futuramente
