# 📦 Algoritmo de Recomendação de Imóveis

Este módulo é responsável por gerar recomendações personalizadas de imóveis para usuários com base em seu histórico de visitas. A lógica está implementada em Express.js e utiliza consultas SQL para inferir preferências e sugerir novos imóveis.

---

## 🎯 Objetivo do Algoritmo

Recomendar imóveis relevantes para usuários com base em:

- Histórico de visitas anteriores
- Popularidade dos imóveis (caso não haja histórico)

---

## 📥 Dados de Entrada

A recomendação é baseada na tabela `RECOMENDACAO_IMOVEL`, que registra visitas de usuários a imóveis:

- `id`: Identificador único da visita
- `usuario_id`: Identificador do usuário
- `imovel_id`: Identificador do imóvel
- `data_visita`: Data da visita

📌 A entrada real do algoritmo é apenas o `usuario_id`, passado via rota. Os demais dados são consultados automaticamente pelo sistema.

---

## 📤 Saída Esperada

Uma lista de até **20 imóveis recomendados**, com base em:

- Similaridade com imóveis visitados
- Popularidade (fallback para usuários sem histórico)

---

## ⚙️ Lógica Geral do Algoritmo

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

## 🧠 Abordagem Utilizada

- **Filtragem baseada em conteúdo**: recomenda imóveis com atributos semelhantes aos já visitados.
- **Popularidade como fallback**: garante recomendações mesmo sem histórico.

---

## Como testar os endpoints
Você pode testar os endpoints no Insomnia.

```http
POST    /recomendacao_imovel       → Adiciona um novo registro em `recomendacao_imovel`
GET     /recomendacoes             → Lista de 20 imóveis com base nas preferências do usuário
```

### POST - exemplo de entrada 
```json
{
	"usuario_id": 1,
	"imovel_id": 2,
	"data_visita": "2025-03-03"
}
```

### POST - exemplo de saída 
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

### GET - exemplo de entrada
Para testar o endpoint `GET`, utilize a URL:
`http://localhost:4000/recomendacoes`

No campo `Params`, digite `usuario_id` no campo `name` e, `2` no campo `value`.

### GET - exemplo de saída
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
			"tipo_negociacao": "venda",
			"status": "disponivel",
			"data_update_status": null
		}]}
```

O exemplo acima é apenas 1 dos 20 imóveis que podem ser retornados.

Agora, se o usuário não possuir registros na tabela `recomendacao_imovel` (sem histórico de visitas), o sistema buscará os imóveis mais populares (mais visitados) e os recomendará ao usuário. Para saber se o usuário não possui histórico, procure no log: `Usuário sem histórico. Retornando imóveis populares.`

Se o usuário tem um histórico de visitas menor, por exemplo, apenas uma visita, o sistema tenta outras opções.

O algoritmo funciona em etapas:

- Primeira tentativa: busca a combinação mais específica de preferências do usuário.

- Segunda tentativa: se a primeira busca não tiver resultados, o sistema suaviza os filtros, buscando apenas por imóveis que correspondam ao tipo preferido. Log: `Nenhuma recomendação encontrada com filtros estritos. Expandindo a busca...`

- Terceira tentativa: se a segunda tentativa ainda assim não encontrar resultados, o sistema ignora as preferências e retorna os imóveis mais populares do site. Log: `Nenhuma recomendação encontrada com filtros expandidos. Retornando populares.`

---

## 🛠️ Bibliotecas e Ferramentas Sugeridas

- [`lodash`](https://lodash.com/): manipulação de arrays e objetos

---

## ⚠️ Desafios e Limitações

- **Usuários sem histórico**: recomendações genéricas podem ser menos relevantes.
- **Escalabilidade**: crescimento da tabela de visitas pode impactar performance.

---