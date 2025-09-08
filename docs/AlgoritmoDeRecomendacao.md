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

Uma lista de até **10 imóveis recomendados**, com base em:

- Similaridade com imóveis visitados
- Popularidade (fallback para usuários sem histórico)

Cada imóvel pode conter atributos como `id`, `nome`, `tipo`, `cidade`, `estado`, `preço`, entre outros.

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
O sistema busca imóveis que compartilham os atributos identificados e que ainda não foram visitados pelo usuário. O resultado é uma lista de até 10 imóveis recomendados.

### 4. Fallback para Usuários Sem Histórico
Se o usuário não tiver registros na tabela `RECOMENDACAO_IMOVEL`, o algoritmo retorna os imóveis mais populares no sistema — ou seja, os mais visitados por outros usuários.


---

## 🧠 Abordagem Utilizada

- **Filtragem baseada em conteúdo**: recomenda imóveis com atributos semelhantes aos já visitados.
- **Popularidade como fallback**: garante recomendações mesmo sem histórico.
- **Critério temporal**: pode ser incorporado para dar mais peso a visitas recentes.

---

## Como testar os endpoints

```http
POST    /recomendacao_imovel       → Adiciona um novo registro em `recomendacao_imovel'
GET     /recomendacoes             → Lista de 20 imovéis com base nas preferências do usuário
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
```json
http://localhost:4000/recomendacoes?usuario_id=10
```

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

---

## 🛠️ Bibliotecas e Ferramentas Sugeridas

- [`lodash`](https://lodash.com/): manipulação de arrays e objetos
- [`moment`](https://momentjs.com/): tratamento de datas (ex.: visitas recentes)

---

## ⚠️ Desafios e Limitações

- **Usuários sem histórico**: recomendações genéricas podem ser menos relevantes.
- **Escalabilidade**: crescimento da tabela de visitas pode impactar performance.
- **Precisão**: recomendações iniciais podem não refletir preferências reais.

---