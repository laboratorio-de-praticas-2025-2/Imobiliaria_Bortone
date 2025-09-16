
# Dashboard

## Rota
```
GET /dashboard
```

## Descrição
Retorna estatísticas gerais do sistema, incluindo imóveis, usuários, vendas e aluguéis.  

Essa rota é utilizada para alimentar os gráficos e cards do **dashboard**.

---

## Resposta (JSON)

### Exemplo:
```json
{
  "imoveis": {
    "total": 73,
    "porTipo": {
      "apartamentos": 31,
      "casas": 22,
      "terrenos": 20
    },
    "porNegociacao": {
      "venda": 54,
      "locacao": 19
    }
  },
  "usuarios": {
    "total": 10,
    "administradores": 1,
    "visitantes": 9
  },
  "vendasRecentes": [
    {
      "tipo": "Apartamento",
      "quantidade": 1,
      "porcentagem": 33.33
    },
    {
      "tipo": "Casa",
      "quantidade": 0,
      "porcentagem": 0
    },
    {
      "tipo": "Terreno",
      "quantidade": 2,
      "porcentagem": 66.67
    }
  ],
  "alugueisPorMes": [
    {
      "mes": "2024-10",
      "Apartamento": 0,
      "Casa": 0,
      "Terreno": 0
    },
    {
      "mes": "2024-11",
      "Apartamento": 0,
      "Casa": 1,
      "Terreno": 0
    }
    // ...
  ]
}
```

---

## Estrutura dos Dados

### Imóveis Disponíveis
- `total`: número total de imóveis ativos no sistema.
- `porTipo`: imóveis agrupados por tipo (`apartamentos`, `casas`, `terrenos`).
- `porNegociacao`: imóveis agrupados por tipo de negociação (`venda`, `locacao`).

### Usuários
- `total`: total de usuários cadastrados.
- `administradores`: número de administradores.
- `visitantes`: número de usuários visitantes.

### Vendas
- Estatísticas de vendas nos **últimos 30 dias**.
- Campos:
  - `tipo`: tipo de imóvel.
  - `quantidade`: quantidade de vendas.
  - `porcentagem`: percentual sobre o total.

### Aluguéis por Mês
- Evolução de aluguéis no **último ano**.
- Estrutura:
  - `mes`: referência no formato `YYYY-MM`.
  - `Apartamento`, `Casa`, `Terreno`: quantidade de imóveis alugados naquele mês.

---

## Uso no Frontend

Esses dados podem ser consumidos para:
- **Cards numéricos** (usuários totais, usuários por categoria, imóveis disponíveis, imóveis disponíveis por tipo, imóveis disponíveis por negociação)
- **Gráficos de pizza** (vendas por tipo).
- **Gráficos de linha/coluna** (aluguéis mês a mês).
---
