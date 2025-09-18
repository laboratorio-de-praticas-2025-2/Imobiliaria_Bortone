# Documentação de Imagens API

Esta seção descreve os endpoints da API relacionados ao gerenciamento de imagens.

### POST /api/imagens/upload

Descrição: Faz upload de uma nova imagem para um imóvel.

Método: POST

URL: `/api/imagens/upload`

Parâmetros:
- body `imagem` (obrigatório): O arquivo de imagem a ser enviado.
- body `imovel_id` (obrigatório): O ID do imóvel ao qual a imagem será associada.
- body `descricao` (obrigatório): Uma descrição para a imagem.

Exemplo de Requisição:

```js
POST /api/imagens/upload
Content-Type: multipart/form-data

// No corpo da requisição (exemplo com formData em JavaScript):
// const formData = new FormData();
// formData.append('imagem', fileInput.files[0]);
// formData.append('imovel_id', 1);
// formData.append('descricao', 'Vista frontal do imóvel');
```

Exemplo de Resposta (201):

```json
{
  "id": 1,
  "imovel_id": 1,
  "url_imagem": "/images/imoveis/nome_d-imagem.png",
  "descricao": "Vista frontal do imóvel",
  "createdAt": "2023-01-01T12:00:00.000Z",
  "updatedAt": "2023-01-01T12:00:00.000Z"
}
```

Códigos de Status: 201, 400, 500

Autenticação: não requer

### DELETE /api/imagens/:id

Descrição: Exclui uma imagem específica pelo seu ID.

Método: DELETE

URL: `/api/imagens/:id`

Parâmetros:
- path `id` (obrigatório): O ID da imagem a ser excluída.

Exemplo de Requisição:

```js
DELETE /api/imagens/1
```

Exemplo de Resposta (200):

```json
{
  "message": "Imagem excluída com sucesso."
}
```

Códigos de Status: 200, 404, 500

Autenticação: não requer

### GET /api/imagens/:id

Descrição: Retorna uma imagem específica pelo seu ID.

Método: GET

URL: `/api/imagens/:id`

Parâmetros:
- path `id` (obrigatório): O ID da imagem a ser recuperada.

Exemplo de Requisição:

```js
GET /api/imagens/1
```

Exemplo de Resposta (200):

```json
{
  "id": 1,
  "imovel_id": 1,
  "url_imagem": "/images/imoveis/nome_d-imagem.png",
  "descricao": "Vista frontal do imóvel",
  "createdAt": "2023-01-01T12:00:00.000Z",
  "updatedAt": "2023-01-01T12:00:00.000Z"
}
```

Códigos de Status: 200, 404, 500

Autenticação: não requer

### GET /api/imagens/imovel/:imovelId

Descrição: Retorna todas as imagens associadas a um imóvel específico pelo ID do imóvel.

Método: GET

URL: `/api/imagens/imovel/:imovelId`

Parâmetros:
- path `imovelId` (obrigatório): O ID do imóvel para o qual as imagens serão recuperadas.

Exemplo de Requisição:

```js
GET /api/imagens/imovel/1
```

Exemplo de Resposta (200):

```json
[
  {
    "id": 1,
    "imovel_id": 1,
    "url_imagem": "/images/imoveis/nome_d-imagem_1.png",
    "descricao": "Vista frontal do imóvel",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  },
  {
    "id": 2,
    "imovel_id": 1,
    "url_imagem": "/images/imoveis/nome_d-imagem_2.png",
    "descricao": "Cozinha do imóvel",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  }
]
```

Códigos de Status: 200, 404, 500

Autenticação: não requer
