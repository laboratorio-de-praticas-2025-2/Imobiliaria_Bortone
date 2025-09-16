# Algoritmo de Recomendação de Imóveis

Este módulo é responsável por gerar recomendações personalizadas de imóveis para usuários com base em seu histórico de visitas. A lógica está implementada em Express.js e utiliza consultas SQL para inferir preferências e sugerir novos imóveis.

---

## Objetivo do Algoritmo

Recomendar imóveis relevantes para usuários com base em:

- Histórico de visitas anteriores
- Popularidade dos imóveis (caso não haja histórico)

---

## Dados de Entrada

A recomendação é baseada na tabela `RECOMENDACAO_IMOVEL`, que registra visitas de usuários a imóveis:

- `id`: Identificador único da visita
- `usuario_id`: Identificador do usuário
- `imovel_id`: Identificador do imóvel
- `data_visita`: Data da visita

A entrada real do algoritmo é apenas o `usuario_id`, passado via rota. Os demais dados são consultados automaticamente pelo sistema.

---

## Saída Esperada

Uma lista de até **20 imóveis recomendados**, com base em:

- Similaridade com imóveis visitados
- Popularidade (fallback para usuários sem histórico)

---

## Lógica Geral do Algoritmo

### 1. Identificação de Imóveis Visitados
A partir do `usuario_id` recebido na requisição, o sistema consulta a tabela `RECOMENDACAO_IMOVEL` para identificar os imóveis que esse usuário já visitou. Os 5 imóveis mais frequentes são usados como base para entender suas preferências.

### 2. Inferência de Preferências
Com os dados dos imóveis visitados (tabela `IMOVEIS`), o algoritmo analisa os atributos mais comuns:
- `tipo`
- `cidade`
- `estado`
- `preço`

Esses atributos ajudam a construir o perfil de interesse do usuário.

### 3. Geração de Recomendações
O sistema busca imóveis que compartilham os atributos identificados e que ainda não foram visitados pelo usuário. O resultado é uma lista de até 20 imóveis recomendados.

### 4. Fallback para Usuários Sem Histórico
Se o usuário não tiver registros na tabela `RECOMENDACAO_IMOVEL`, o algoritmo retorna os imóveis mais populares no sistema — ou seja, os mais visitados por outros usuários.


---

## Abordagem Utilizada

- **Filtragem baseada em conteúdo**: recomenda imóveis com atributos semelhantes aos já visitados.
- **Popularidade como fallback**: garante recomendações mesmo sem histórico.

---

## Bibliotecas utilizada

- [`lodash`](https://lodash.com/): manipulação de arrays e objetos

---

## Desafios e Limitações

- **Usuários sem histórico**: recomendações genéricas podem ser menos relevantes.
- **Escalabilidade**: crescimento da tabela de visitas pode impactar performance.

---

## Entendendo o código 
### Modelos de Dados (Sequelize)

Os modelos definem a estrutura das tabelas no banco de dados e são a base para todas as operações de leitura e escrita.

---

#### recomendacaoImovelModel.js

Este modelo representa a tabela `recomendacao_imovel`, que armazena o histórico de visitas dos usuários a determinados imóveis.

#### Tabela: `recomendacao_imovel`

| Campo        | Tipo     | Descrição                                      |
|--------------|----------|------------------------------------------------|
| `id`         | INTEGER  | PK, Auto-incremento. Identificador único da visita. |
| `usuario_id` | INTEGER  | ID do usuário que visitou o imóvel.           |
| `imovel_id`  | INTEGER  | ID do imóvel que foi visitado.                |
| `data_visita`| DATE     | Data e hora da visita.                        |

---

#### Imovel.js

Este modelo representa a tabela `imoveis`, que contém todos os detalhes dos imóveis disponíveis no sistema. Ele é a fonte de dados para as recomendações geradas.

#### Tabela: `imoveis`

| Campo    | Tipo           | Descrição                                      |
|----------|----------------|------------------------------------------------|
| `id`     | INTEGER        | PK, Auto-incremento. Identificador único do imóvel. |
| `tipo`   | STRING(50)     | Tipo do imóvel (ex: 'Casa', 'Apartamento').   |
| `cidade` | STRING(100)    | Cidade onde o imóvel está localizado.         |
| `estado` | STRING(2)      | Estado (UF) do imóvel.                        |
| `preco`  | DECIMAL(12, 2) | Preço do imóvel.                              |
| `status` | ENUM           | Status do imóvel (ex: 'disponivel').          |


> Os atributos que estão sendo listados são apenas os utilizados no algoritmo. Não é uma cópia exata da tabela do banco de dados. 

--- 

### Lógica de Inserção de Dados
A seguir, o fluxo de inserção de um novo registro de visita na tabela `recomendacao_imovel`, que é o primeiro passo para o sistema de recomendação.

#### `recomendacaoImovelService.js`
A função `createRecomendacao` é a camada de serviço responsável por interagir diretamente com o banco de dados.

```js
export const createRecomendacao = async (data) => {
    try {
        const novaRecomendacao = await RecomendacaoImovel.create(data);
        return novaRecomendacao;
    } catch (error) {
        throw new Error('Não foi possível criar a recomendação: ' + error.message);
    }
};
```

- **Descrição:** Esta é uma função assíncrona que recebe um objeto data contendo as informações da visita. Ela utiliza o método create do modelo RecomendacaoImovel para inserir um novo registro na tabela correspondente.

- **Comportamento:** Se a operação for bem-sucedida, a função retorna o objeto do registro recém-criado. Em caso de falha, ela lança uma exceção com uma mensagem mais clara.

--- 

#### Validação dos Dados de Entrada (Middleware)
O middleware `validacaoRecomendacaoImovel` garante que os dados enviados na requisição sejam válidos antes de serem processados.

```js
export const validacaoRecomendacaoImovel = (req, res, next) => {
  const { usuario_id, imovel_id, data_visita } = req.body;

    if (!usuario_id || !imovel_id || !data_visita) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    if (typeof usuario_id !== 'number' || typeof imovel_id !== 'number') {
        return res.status(400).json({ error: 'IDs devem ser números.' });
    }
  
  next();
};
```

- **Descrição:** Essa função atua como um filtro pré-requisição. Ela verifica a presença e o tipo de dados dos campos `usuario_id`, `imovel_id` e `data_visita` no corpo da requisição.

- **Comportamento:** Se qualquer uma das validações falhar, o middleware interrompe a execução e envia uma resposta de erro `(400 Bad Request)` ao cliente. Se todos os dados estiverem corretos, ele chama `next()`, permitindo que a requisição prossiga para o controlador.

--- 

#### Controlador do método POST
O controlador `createRecomendacaoImovel` orquestra a requisição. Ele extrai os dados, chama o serviço de inserção e lida com a resposta.

```js
export const createRecomendacaoImovel = async (req, res) => {
  const { usuario_id, imovel_id, data_visita } = req.body;

  try {
    const novaRecomendacao = await recomendacaoImovelService.createRecomendacao({
      usuario_id,
      imovel_id,
      data_visita
    });
    res.status(201).json({
      message: 'Novo registro na tabela recomendacao_imovel.',
      data: novaRecomendacao,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

```

- **Descrição:** Este controlador é a ponte entre a rota e a lógica de negócio. Ele recebe a requisição, extrai as informações do corpo e as passa para a função de serviço `createRecomendacao`.

- **Comportamento:** Se a chamada ao serviço for bem-sucedida, ele retorna um status `201 Created` com uma mensagem de sucesso e os dados do novo registro. Se houver um erro, ele retorna um status `500 Internal Server Error`.

--- 

#### Rota de POST
A rota `POST /recomendacao_imovel` define o endpoint para a criação de um registro de visita.

```js
import express from 'express';
import { createRecomendacaoImovel } from '../controllers/recomendacaoImovelController.js';
import { validacaoRecomendacaoImovel } from '../middlewares/validacaoRecomendacaoImovel.js';

const recomendacoesRoutes = express.Router();

recomendacoesRoutes.post('/recomendacao_imovel', validacaoRecomendacaoImovel, createRecomendacaoImovel);

export default recomendacoesRoutes;
```

- **Fluxo de Execução:** A requisição POST para `/recomendacao_imovel` primeiro passa pelo middleware `validacaoRecomendacaoImovel`. Se a validação for aprovada, a requisição é então passada para o controlador `createRecomendacaoImovel` para ser processada. Essa ordem garante que a lógica de negócio só seja executada com dados válidos.

---

### Lógica do algoritmo de recomendação 
A seguir, o fluxo da criação da lista de até 20 imóveis recomendados para o cliente. 
A lógica principal está contida no arquivo `recomendacaoImovelService.js`, que coordena as etapas de coleta de dados, inferência de preferências e busca por recomendações.

--- 

#### Passo 1: coleta de histórico do usuário - `recomendacaoImovelService.js`
```js
const getTopImoveisVisitados = async (usuario_id) => {
    return await RecomendacaoImovel.findAll({
        attributes: [
            'imovel_id',
            // Usa COUNT para contar a frequência de cada `imovel_id`.
            [Sequelize.fn('COUNT', Sequelize.col('imovel_id')), 'visitas']
        ],
        where: { usuario_id },
        group: ['imovel_id'],
        // Ordena do mais visitado para o menos visitado.
        order: [[Sequelize.fn('COUNT', Sequelize.col('imovel_id')), 'DESC']],

        raw: true
    });
};
```

- **Descrição:** Esta função executa uma consulta agregada no banco de dados. Ela conta quantas vezes cada `imovel_id` aparece para um determinado `usuario_id`, agrupando os resultados. O uso de Sequelize.fn permite a execução de funções nativas do SQL, como COUNT().

- **Retorno:** A função retorna uma lista de objetos, onde cada objeto contém o `imovel_id` e a contagem de visitas (visitas) para aquele imóvel, ordenados de forma decrescente.

--- 

#### Passo 2: Inferência de Preferências do Usuário
Com o histórico de visitas em mãos, o próximo passo é inferir o perfil de preferências do usuário. A função `inferirPreferencias` analisa os dados dos imóveis mais visitados para determinar o tipo, cidade, estado e faixa de preço de preferência.
```js
const inferirPreferencias = async (idsImoveis) => {
    if (_.isEmpty(idsImoveis)) {
        return null;
    }

    // Busca no banco de dados os dados completos (tipo, cidade, estado, preco) dos imóveis visitados.
    const imoveisReferencia = await Imovel.findAll({
      // É um operador do Sequelize. Ele representa o operador SQL IN
        where: { id: { [Sequelize.Op.in]: idsImoveis } },
        attributes: ['tipo', 'cidade', 'estado', 'preco'],
        raw: true
    });

    if (_.isEmpty(imoveisReferencia)) {
        return null;
    }

    // Com o lodash, encontra o 'tipo', 'cidade' e 'estado' mais frequentes.
    // 1. `_.countBy`: Conta a frequência de cada atributo (ex: {"Casa": 3, "Terreno": 2}).
    // 2. `_.toPairs`: Converte o objeto de contagem em um array de pares (ex: [["Casa", 3], ["Terreno", 2]]).
    // 3. `_.maxBy`: Encontra o par com o maior valor (a maior contagem).
    // 4. `_.head`: Pega o primeiro elemento do par, que é o nome do atributo (ex: "Casa").
    const preferencias = {
        tipo: _.head(_.maxBy(_.toPairs(_.countBy(imoveisReferencia, 'tipo')), _.last)),
        cidade: _.head(_.maxBy(_.toPairs(_.countBy(imoveisReferencia, 'cidade')), _.last)),
        estado: _.head(_.maxBy(_.toPairs(_.countBy(imoveisReferencia, 'estado')), _.last)),
    };
    
    // Pega todos os preços dos imóveis de referência.
    const precos = _.map(imoveisReferencia, 'preco');
    // Calcula o preço médio.
    const precoMedio = _.mean(precos);

    // Define uma faixa de preço (entre 80% e 120% do preço médio) para a recomendação.
    preferencias.precoMin = precoMedio * 0.8;
    preferencias.precoMax = precoMedio * 1.2;
    
    return preferencias;
};
```

- **Descrição:** Esta função é a inteligência do sistema. Ela realiza as seguintes operações:

1. ***Consulta de Dados:*** Busca no modelo `Imovel` os detalhes completos (tipo, cidade, estado, preco) dos imóveis visitados. O operador Sequelize.Op.in permite buscar múltiplos IDs em uma única consulta eficiente.

2. ***Análise de Frequência (lodash):*** Utiliza a biblioteca lodash para analisar o `imoveisReferencia` e identificar os valores mais comuns para tipo, cidade e estado. O fluxo é:

	- _.countBy(): Cria um objeto contando a ocorrência de cada valor (ex: { 'Casa': 3, 'Apartamento': 1 }).

	- _.toPairs(): Converte o objeto de contagem em um array de arrays ([['Casa', 3], ['Apartamento', 1]]).

	- _.maxBy(): Encontra o array com a maior contagem (o mais frequente).

	- _.head(): Pega o nome do atributo mais frequente.

3. ***Cálculo da Faixa de Preço:*** Calcula o preço médio dos imóveis visitados e define uma faixa de tolerância de 20% para cima e para baixo (80% a 120% do preço médio). Isso cria uma faixa flexível para as recomendações.

- **Retorno:** Um objeto contendo as preferências inferidas do usuário (tipo, cidade, estado e uma faixa de preço).

---

#### Passo 3: Buscar Imóveis Populares como Fallback
A função `getImoveisPopulares` serve como um plano B, ou fallback, para garantir que o sistema sempre retorne uma lista de recomendações, mesmo se o usuário não tiver histórico de visitas ou se a busca personalizada não gerar resultados. Ela encontra os imóveis mais visitados em todo o sistema, independentemente do usuário.

```js
// Retorna até 20 imóveis mais populares do sistema (geral), usados como fallback.
const getImoveisPopulares = async () => {
    // `attributes` define as colunas que vão vir como resposta.
    const imoveisPopulares = await RecomendacaoImovel.findAll({
        attributes: [
            'imovel_id', 
            // `Sequelize.fn` permite usar funções SQL, como COUNT.
            [Sequelize.fn('COUNT', Sequelize.col('imovel_id')), 'visitas']
        ],
        group: ['imovel_id'],
        // A consulta ordena pelo número de visitas (a contagem) de forma descendente (`DESC`), ou seja, do mais visitado para o menos visitado.
        order: [[Sequelize.fn('COUNT', Sequelize.col('imovel_id')), 'DESC']],
        // Retornará os 20 imóveis mais visitados.
        limit: 20,
        // `raw: true` garante que o Sequelize retorne um array de objetos JSON
        raw: true
    });
    
    // Extrai apenas os IDs dos imóveis mais populares.
    const idsPopulares = _.map(imoveisPopulares, 'imovel_id');

    // Retorna os dados completos desses imóveis, filtrando por status 'disponivel'.
    return await Imovel.findAll({
        where: {
            id: {
                [Sequelize.Op.in]: idsPopulares
            },
            status: 'disponivel' 
        },
        limit: 20
    });
};
```

- **Descrição:** Essa função executa um processo em duas etapas:

1. ***Identifica os Populares:*** Primeiro, ela consulta a tabela recomendacao_imovel para encontrar os 20 imóveis que foram mais visitados no total. A consulta usa COUNT e GROUP BY para somar as visitas por `imovel_id` e ORDER BY para listar os mais populares primeiro.

2. ***Filtra e Retorna Dados Completos:*** Em seguida, a função extrai apenas os ids desses imóveis populares. Com essa lista de ids, ela faz uma nova consulta no modelo `Imovel`. Essa segunda consulta garante que apenas imóveis que estão `disponivel` sejam retornados, oferecendo uma lista de recomendações que o usuário pode, de fato, alugar ou comprar.

- **Comportamento:** A função retorna uma lista completa de objetos de imóveis, prontos para serem enviados na resposta da API. Ela é a última linha de defesa do algoritmo de recomendação, garantindo que o cliente não receba uma resposta vazia.

--- 

#### Passo 4: Função principal do algoritmo 
A função `getRecomendacoesByUserId` é o coração do sistema. Ela orquestra toda a lógica de recomendação, combinando as funções auxiliares para gerar a lista de imóveis. O fluxo é desenhado com uma estratégia de fallback progressivo para garantir que uma resposta seja sempre retornada.
```js
export const getRecomendacoesByUserId = async (usuario_id) => {
    try {
        // Pega o histórico de imóveis visitados pelo usuário.
        const imoveisVisitados = await getTopImoveisVisitados(usuario_id);

        // Se o usuário não tiver NENHUM histórico, retorna os imóveis populares.
        if (_.isEmpty(imoveisVisitados)) {
            console.log('Usuário sem histórico. Retornando imóveis populares.');
            return await getImoveisPopulares();
        }

        // Extrai os IDs dos imóveis visitados para evitar recomendá-los novamente.
        const idsImoveisVisitados = _.map(imoveisVisitados, 'imovel_id');
        // Infere as preferências do usuário com base no histórico.
        const preferencias = await inferirPreferencias(idsImoveisVisitados);

        // Constrói os filtros base (sempre aplicados)
        const filtrosBase = {
            id: {
                [Sequelize.Op.notIn]: idsImoveisVisitados
            },
            status: 'disponivel'
        };

        // Primeira tentativa (fallback): busca com todos os filtros de preferência
        let filtros = {
            ...filtrosBase,
            tipo: preferencias.tipo,
            cidade: preferencias.cidade,
            estado: preferencias.estado
        };
        if (!_.isNaN(preferencias.precoMin) && !_.isNaN(preferencias.precoMax)) {
            filtros.preco = {
                [Sequelize.Op.between]: [preferencias.precoMin, preferencias.precoMax]
            };
        }
        let imoveisRecomendados = await Imovel.findAll({ where: filtros, limit: 20 });

        // Segunda tentativa (fallback): se a primeira falhar, suaviza a busca
        if (_.isEmpty(imoveisRecomendados)) {
            console.log('Nenhuma recomendação encontrada com filtros estritos. Expandindo a busca...');
            
            // Remove os filtros de preço, cidade e estado, mantendo apenas o tipo
            let filtrosExpandidos = {
                ...filtrosBase,
                tipo: preferencias.tipo
            };
            imoveisRecomendados = await Imovel.findAll({ where: filtrosExpandidos, limit: 20 });
        }
        
        // Terceira tentativa (fallback final): se a busca expandida também falhar
        if (_.isEmpty(imoveisRecomendados)) {
             console.log('Nenhuma recomendação encontrada com filtros expandidos. Retornando populares.');
             return await getImoveisPopulares();
        }

        // Retorna a lista de imóveis recomendados.
        return imoveisRecomendados;

    } catch (error) {
        console.error(error);
        throw new Error('Não foi possível buscar as recomendações: ' + error.message);
    }
};
```
- **Descrição:** Esta função implementa o fluxo completo da lógica de recomendação. Ela começa buscando o histórico do usuário e, se não encontrar, aciona o primeiro fallback, retornando os imóveis mais populares do sistema. Se houver histórico, a função infere as preferências do usuário para construir um conjunto de filtros de busca.

- **Fluxo de Busca e Fallbacks:**

1. ***Busca Estrita:*** A função tenta encontrar imóveis que correspondam a todos os filtros de preferência (tipo, cidade, estado e faixa de preço).

2. ***Fallback para Busca Expandida:*** Caso a primeira busca não retorne resultados `(_.isEmpty(imoveisRecomendados))`, o algoritmo relaxa os critérios, removendo os filtros de localização e preço e mantendo apenas o tipo preferido.

3. ***Fallback Final:*** Se a busca expandida ainda não produzir resultados, a função aciona o fallback final, chamando `getImoveisPopulares` para garantir que o usuário receba uma lista de imóveis.

- **Observação de Desenvolvimento:** Todo esse tratamento de fallback foi implementado porque, durante a fase de testes do algoritmo, percebeu-se que ao tentar enviar um `usuario_id` que possuía apenas um registro na tabela `recomendacao_imovel`, o retorno da lista de recomendação era vazio. Isso acontecia porque a inferência de preferências, com base em um único ponto de dados, resultava em filtros de busca muito restritivos, levando a um resultado nulo. A lógica de fallback resolveu esse problema, garantindo que a API sempre entregue um conjunto de recomendações ao usuário.

--- 

#### Controlador do método GET
O controlador `getRecomendacoes` é o ponto de entrada para a requisição de recomendações. Ele gerencia o fluxo da requisição HTTP, validando a entrada e chamando a lógica de negócio para obter os dados.
```js
export const getRecomendacoes = async (req, res) => {
  const { usuario_id } = req.query; 

  if (!usuario_id) {
    return res.status(400).json({ error: 'O ID do usuário é obrigatório.' });
  }

  try {
    const recomendacoes = await recomendacaoImovelService.getRecomendacoesByUserId(usuario_id);
    res.status(200).json({
      message: 'Recomendações geradas com sucesso.',
      data: recomendacoes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar recomendações: ' + err.message });
  }
};
```

- **Descrição:** Este controlador é responsável por orquestrar a busca por recomendações. Ele primeiro verifica se o `usuario_id` foi fornecido na requisição. Se estiver ausente, a requisição é rejeitada com um erro `400 Bad Request`. Se a validação passar, o controlador chama a função de serviço `getRecomendacoesByUserId`, que contém toda a lógica do algoritmo.

- **Comportamento:**

	- Sucesso: Se a chamada ao serviço for bem-sucedida, ele retorna um status `200 OK` com uma mensagem de sucesso e a lista de imóveis recomendados no corpo da resposta (data).

	- Erro: Em caso de qualquer falha na lógica do serviço (como um problema de conexão com o banco de dados), o erro é capturado e uma resposta `500 Internal Server Error` é enviada ao cliente. O erro detalhado é registrado no console do servidor para fins de depuração.

--- 

#### Rota de GET
Esta rota define o endpoint da API que os clientes utilizarão para solicitar recomendações.
```js
import express from 'express';
import { getRecomendacoes } from '../controllers/recomendacaoImovelController.js';

const recomendacoesRoutes = express.Router();

recomendacoesRoutes.get('/recomendacoes', getRecomendacoes);

export default recomendacoesRoutes;
```

- **Descrição:** A rota GET `/recomendacoes` é configurada para acionar o controlador `getRecomendacoes` sempre que uma requisição GET for feita para este caminho.

---

## Como testar os endpoints
Você pode testar os endpoints no Insomnia.

```http
POST    /recomendacao_imovel       → Adiciona um novo registro em `recomendacao_imovel'
GET     /recomendacoes             → Lista de 20 imovéis com base nas preferências do usuário
```

---

#### POST - exemplo de entrada 
```json
{
	"usuario_id": 1,
	"imovel_id": 2,
	"data_visita": "2025-03-03"
}
```

#### POST - exemplo de saída 
```json
{
	"message": "Novo registro na tabela recomendacao_imovel.",
	"data": {
		"id": 9750,
		"usuario_id": 1,
		"imovel_id": 2,
		"data_visita": "2025-03-03T00:00:00.000Z"
	}
}
```

---

#### GET - exemplo de entrada
Para testar o endpoint `GET`, é necessário que a rota esteja assim: 
```json
http://localhost:4000/recomendacoes
```

No campo `Params`, digite `usuario_id` no campo `name` e, `2` no campo `value`.

#### GET - exemplo de saída
```json
{
	"message": "Recomendações geradas com sucesso.",
	"data": [
		{
			"id": 8,
			"tipo": "Apartamento",
			"endereco": "Av. Leste, 147",
			"cidade": "Manaus",
			"estado": "AM",
			"preco": "600000.00",
			"area": 75,
			"descricao": "Apartamento com vista",
			"data_cadastro": "2024-10-28",
			"murado": 1,
			"latitude": "-3.1190280",
			"longitude": "-60.0217310",
			"usuario_id": 4,
			"tipo_negociacao": "vaenda",
			"status": "disponivel",
			"data_update_status": null
		}]}
```

O exemplo acima é apenas 1 dos 20 imóveis que podem retornados.

---
