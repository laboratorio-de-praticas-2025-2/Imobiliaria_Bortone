# Documentação de Imóveis API

Esta seção descreve os endpoints da API relacionados ao gerenciamento de imóveis.

### POST /api/imoveis

Descrição: Cria um novo imóvel, opcionalmente com dados da tabela 'casa'

Método: POST

URL: `/api/imoveis`

Parâmetros:
- body `tipo` (obrigatório): Tipo do imóvel (ex: 'casa', 'apartamento', 'terreno').
- body `endereco` (obrigatório): Endereço completo do imóvel.
- body `cidade` (obrigatório): Cidade do imóvel.
- body `estado` (obrigatório): Estado do imóvel.
- body `preco` (obrigatório): Preço do imóvel.
- body `area` (opcional): Área do imóvel em m².
- body `descricao` (opcional): Descrição detalhada do imóvel.
- body `murado` (opcional): Booleano indicando se o terreno é murado (para terrenos).
- body `latitude` (opcional): Latitude da localização do imóvel.
- body `longitude` (opcional): Longitude da localização do imóvel.
- body `usuario_id` (opcional): ID do usuário proprietário do imóvel.
- body `tipo_negociacao` (opcional): Tipo de negociação ('aluguel' ou 'venda', padrão: 'venda').
- body `status` (opcional): Status do imóvel ('disponivel', 'indisponivel', 'vendido', 'locado', padrão: 'disponivel').
- body `quartos` (condicional, para 'casa' ou 'apartamento'): Número de quartos.
- body `banheiros` (condicional, para 'casa' ou 'apartamento'): Número de banheiros.
- body `vagas` (condicional, para 'casa' ou 'apartamento'): Número de vagas de garagem.
- body `possui_piscina` (condicional, para 'casa' ou 'apartamento'): Booleano indicando se possui piscina.
- body `possui_jardim` (condicional, para 'casa' ou 'apartamento'): Booleano indicando se possui jardim.

Exemplo de Requisição:

```js
POST /api/imoveis
Content-Type: application/json

{
  "tipo": "casa",
  "endereco": "Rua Exemplo, 123",
  "cidade": "São Paulo",
  "estado": "SP",
  "preco": 500000.00,
  "area": 150,
  "descricao": "Bela casa com 3 quartos",
  "quartos": 3,
  "banheiros": 2,
  "vagas": 2,
  "possui_piscina": true,
  "possui_jardim": false
}
```

Exemplo de Resposta (201):

```json
{
  "id": 1,
  "tipo": "casa",
  "endereco": "Rua Exemplo, 123",
  "cidade": "São Paulo",
  "estado": "SP",
  "preco": 500000,
  "area": 150,
  "descricao": "Bela casa com 3 quartos",
  "murado": 0,
  "latitude": null,
  "longitude": null,
  "usuario_id": null,
  "tipo_negociacao": "venda",
  "status": "disponivel",
  "data_cadastro": "2023-01-01T12:00:00.000Z",
  "data_update_status": "2023-01-01T12:00:00.000Z",
  "casa": {
    "id": 1,
    "imovel_id": 1,
    "quartos": 3,
    "banheiros": 2,
    "vagas": 2,
    "possui_piscina": 1,
    "possui_jardim": 0,
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  },
  "terreno": null
}
```

Códigos de Status: 201, 400, 500

### GET /api/imoveis

Descrição: Lista imóveis com filtros opcionais.

Método: GET

URL: `/api/imoveis`

Parâmetros:
- query `tipo_negociacao` (opcional): Filtra por tipo de negociação ('aluguel' ou 'venda').
- query `tipo` (opcional): Filtra por tipo de imóvel ('casa', 'apartamento', 'terreno').
- query `minPreco` (opcional): Preço mínimo do imóvel.
- query `maxPreco` (opcional): Preço máximo do imóvel.
- query `minArea` (opcional): Área mínima do imóvel em m².
- query `maxArea` (opcional): Área máxima do imóvel em m².

Exemplo de Requisição:

```js
GET /api/imoveis?tipo_negociacao=venda&tipo=casa&minPreco=100000&maxPreco=200000
```

Exemplo de Resposta (200):

```json
[
  {
    "id": 1,
    "tipo": "casa",
    "endereco": "Rua Exemplo, 123",
    "cidade": "São Paulo",
    "estado": "SP",
    "preco": 500000,
    "area": 150,
    "descricao": "Bela casa com 3 quartos",
    "murado": 0,
    "latitude": null,
    "longitude": null,
    "usuario_id": null,
    "tipo_negociacao": "venda",
    "status": "disponivel",
    "data_cadastro": "2023-01-01T12:00:00.000Z",
    "data_update_status": "2023-01-01T12:00:00.000Z",
    "casa": {
      "id": 1,
      "imovel_id": 1,
      "quartos": 3,
      "banheiros": 2,
      "vagas": 2,
      "possui_piscina": 1,
      "possui_jardim": 0,
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    },
    "terreno": null
  }
]
```

Códigos de Status: 200, 500

### GET /api/imoveis/status/:status

Descrição: Retorna imóveis filtrados por status.

Método: GET

URL: `/api/imoveis/status/:status`

Parâmetros:
- path `status` (obrigatório): O status do imóvel ('disponivel', 'indisponivel', 'vendido', 'locado').

Exemplo de Requisição:

```js
GET /api/imoveis/status/disponivel
```

Exemplo de Resposta (200):

```json
[
  {
    "id": 1,
    "tipo": "casa",
    "status": "disponivel"
  }
]
```

Códigos de Status: 200, 500


### GET /api/imoveis/negociacao/:tipo

Descrição: Retorna imóveis filtrados por tipo de negociação.

Método: GET

URL: `/api/imoveis/negociacao/:tipo`

Parâmetros:
- path `tipo` (obrigatório): O tipo de negociação ('aluguel' ou 'venda').

Exemplo de Requisição:

```js
GET /api/imoveis/negociacao/venda
```

Exemplo de Resposta (200):

```json
[
  {
    "id": 1,
    "tipo": "casa",
    "tipo_negociacao": "venda"
  }
]
```

Códigos de Status: 200, 500


### GET /api/imoveis/:id

Descrição: Retorna um imóvel específico pelo seu ID.

Método: GET

URL: `/api/imoveis/:id`

Parâmetros:
- path `id` (obrigatório): O ID do imóvel a ser recuperado.

Exemplo de Requisição:

```js
GET /api/imoveis/1
```

Exemplo de Resposta (200):

```json
{
  "id": 1,
  "tipo": "casa",
  "endereco": "Rua Exemplo, 123"
}
```

Códigos de Status: 200, 404, 500


### PUT /api/imoveis/:id

Descrição: Atualiza um imóvel existente pelo seu ID.

Método: PUT

URL: `/api/imoveis/:id`

Parâmetros:
- path `id` (obrigatório): O ID do imóvel a ser atualizado.
- body (obrigatório): Os dados do imóvel a serem atualizados. (Mesmos parâmetros do POST, mas todos opcionais).

Exemplo de Requisição:

```js
PUT /api/imoveis/1
Content-Type: application/json

{
  "preco": 550000.00,
  "descricao": "Linda casa reformada com 3 quartos"
}
```

Exemplo de Resposta (200):

```json
{
  "id": 1,
  "tipo": "casa",
  "endereco": "Rua Exemplo, 123",
  "preco": 550000
}
```

Códigos de Status: 200, 400, 404, 500

### PATCH /api/imoveis/:id/status

Descrição: Atualiza o status de um imóvel específico pelo seu ID.

Método: PATCH

URL: `/api/imoveis/:id/status`

Parâmetros:
- path `id` (obrigatório): O ID do imóvel a ter o status atualizado.
- body `status` (obrigatório): O novo status do imóvel ('disponivel', 'indisponivel', 'vendido', 'locado').

Exemplo de Requisição:

```js
PATCH /api/imoveis/1/status
Content-Type: application/json

{
  "status": "vendido"
}
```

Exemplo de Resposta (200):

```json
{
  "message": "Status do imóvel atualizado com sucesso."
}
```

Códigos de Status: 200, 400, 404, 500


### DELETE /api/imoveis/:id

Descrição: Exclui um imóvel específico pelo seu ID, incluindo todas as entidades relacionadas (Casa, Terreno, Imagens).

Método: DELETE

URL: `/api/imoveis/:id`

Parâmetros:
- path `id` (obrigatório): O ID do imóvel a ser excluído.

Exemplo de Requisição:

```js
DELETE /api/imoveis/1
```

Exemplo de Resposta (200):

```json
{
  "message": "Imóvel e todas as entidades relacionadas foram excluídos com sucesso."
}
```

Códigos de Status: 200, 404, 500
