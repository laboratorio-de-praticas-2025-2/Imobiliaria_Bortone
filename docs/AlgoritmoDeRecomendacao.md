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

Cada imóvel pode conter atributos como `id`, `nome`, `tipo`, `cidade`, `bairro`, `preço`, entre outros.

---

## ⚙️ Lógica Geral do Algoritmo

### 1. Identificação de Imóveis Visitados
A partir do `usuario_id` recebido na requisição, o sistema consulta a tabela `RECOMENDACAO_IMOVEL` para identificar os imóveis que esse usuário já visitou. Os 5 imóveis mais frequentes são usados como base para entender suas preferências.

### 2. Inferência de Preferências
Com os dados dos imóveis visitados (tabela `IMOVEIS`), o algoritmo analisa os atributos mais comuns:
- `tipo`
- `cidade`
- `bairro`
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

## 🛠️ Bibliotecas e Ferramentas Sugeridas

- [`lodash`](https://lodash.com/): manipulação de arrays e objetos
- [`moment`](https://momentjs.com/): tratamento de datas (ex.: visitas recentes)

---

## ⚠️ Desafios e Limitações

- **Usuários sem histórico**: recomendações genéricas podem ser menos relevantes.
- **Escalabilidade**: crescimento da tabela de visitas pode impactar performance.
- **Precisão**: recomendações iniciais podem não refletir preferências reais.

---