# Implementação da API de Mapa - Documentação Técnica

## Arquitetura

A API de Mapa segue o padrão MVC (Model-View-Controller) com separação clara de responsabilidades:

```
Controller → Service → Model → Database
```

## Estrutura de Arquivos Detalhada

### 1. Modelos (`src/models/mapaModels.js`)

**Responsabilidade**: Definição dos modelos Sequelize e relacionamentos

**Características**:
- Usa ES6 modules (import/export)
- Define 4 modelos principais: Usuario, Imovel, Casa, ImagemImovel
- Configura relacionamentos entre tabelas
- Suporte a coordenadas geográficas (latitude/longitude)

**Relacionamentos**:
```javascript
Usuario.hasMany(Imovel, { foreignKey: 'usuario_id' });
Imovel.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Imovel.hasMany(ImagemImovel, { foreignKey: 'imovel_id' });
Imovel.hasOne(Casa, { foreignKey: 'imovel_id' });
```

### 2. Serviços (`src/services/mapaService.js`)

**Responsabilidade**: Lógica de negócio e operações de dados

**Métodos Principais**:
- `buscarImoveis(filtros)` - Busca geral com filtros
- `buscarImoveisParaMapa(filtros)` - Busca otimizada para mapas
- `buscarImoveisPorCoordenadas(lat, lng, raio)` - Busca geográfica
- `buscarImovelPorId(id)` - Busca individual
- `buscarTiposImoveis()` - Lista tipos disponíveis
- `buscarCidades()` - Lista cidades disponíveis

**Características**:
- Filtros dinâmicos usando Sequelize Op
- Suporte a busca por coordenadas com raio
- Includes otimizados para performance
- Tratamento de erros robusto

### 3. Controladores (`src/controllers/mapaController.js`)

**Responsabilidade**: Interface HTTP e validação de entrada

**Endpoints**:
- `GET /mapa` - Lista imóveis
- `GET /mapa/busca` - Busca para mapa
- `GET /mapa/coordenadas` - Busca por coordenadas
- `GET /mapa/:id` - Busca por ID
- `GET /mapa/tipos` - Lista tipos
- `GET /mapa/cidades` - Lista cidades

**Características**:
- Validação de parâmetros de entrada
- Conversão de tipos (string → number)
- Respostas padronizadas
- Tratamento de erros HTTP

### 4. Rotas (`src/routes/mapaRoutes.js`)

**Responsabilidade**: Definição das rotas e middleware

**Estrutura**:
```javascript
router.get('/', mapaController.listarImoveis);
router.get('/busca', mapaController.buscarImoveisParaMapa);
router.get('/coordenadas', mapaController.buscarImoveisPorCoordenadas);
router.get('/tipos', mapaController.listarTiposImoveis);
router.get('/cidades', mapaController.listarCidades);
router.get('/:id', mapaController.buscarImovelPorId);
```

### 5. Middleware (`src/middlewares/validacaoMapa.js`)

**Responsabilidade**: Tratamento centralizado de erros

**Tipos de Erro Tratados**:
- SequelizeValidationError (400)
- SequelizeConnectionError (503)
- SequelizeTimeoutError (408)
- Erros genéricos (500)

## Funcionalidades Implementadas

### 1. Busca com Filtros Avançados

**Filtros Suportados**:
- Texto: tipo, cidade, estado
- Numérico: preço, área, quartos, banheiros
- Booleano: murado, possuiPiscina, possuiJardim
- Geográfico: latitude, longitude, raio
- Enum: tipoNegociacao (venda/aluguel)

**Implementação**:
```javascript
// Filtro dinâmico baseado em parâmetros
if (filtros.tipo) {
  whereClause.tipo = filtros.tipo;
}

if (filtros.precoMin || filtros.precoMax) {
  whereClause.preco = {};
  if (filtros.precoMin) whereClause.preco[Op.gte] = filtros.precoMin;
  if (filtros.precoMax) whereClause.preco[Op.lte] = filtros.precoMax;
}
```

### 2. Busca Geográfica

**Funcionalidade**: Busca imóveis em um raio específico de coordenadas

**Implementação**:
```javascript
whereClause.latitude = {
  [Op.between]: [lat - raio, lat + raio]
};
whereClause.longitude = {
  [Op.between]: [lng - raio, lng + raio]
};
```

### 3. Filtros Específicos para Casas

**Funcionalidade**: Filtros que se aplicam apenas ao modelo Casa

**Implementação**:
```javascript
if (filtros.quartos) {
  includeClause[1].where = { quartos: filtros.quartos };
}
```

### 4. Includes Otimizados

**Funcionalidade**: Carregamento eficiente de relacionamentos

**Estrutura**:
```javascript
const includeClause = [
  {
    model: ImagemImovel,
    as: 'imagem_imovels',
    attributes: ['url_imagem', 'descricao']
  },
  {
    model: Casa,
    as: 'casa',
    attributes: ['quartos', 'banheiros', 'vagas', 'possui_piscina', 'possui_jardim']
  }
];
```

## Padrões de Resposta

### Resposta de Sucesso
```json
{
  "success": true,
  "data": [...],
  "total": 10
}
```

### Resposta de Erro
```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Detalhes técnicos"
}
```

## Tratamento de Erros

### 1. Validação de Entrada
- Verificação de tipos de dados
- Validação de parâmetros obrigatórios
- Conversão segura de strings para números

### 2. Erros de Banco de Dados
- Conexão perdida (503)
- Timeout de query (408)
- Erro de validação (400)

### 3. Erros de Negócio
- Imóvel não encontrado (404)
- Parâmetros inválidos (400)

## Performance e Otimizações

### 1. Queries Otimizadas
- Uso de includes específicos
- Filtros aplicados no banco
- Ordenação por índice

### 2. Filtros Eficientes
- Filtros aplicados na query SQL
- Uso de operadores Sequelize
- Evita carregamento desnecessário

### 3. Estrutura de Dados
- Campos indexados (id, tipo, cidade)
- Relacionamentos bem definidos
- Tipos de dados apropriados

## Integração com Frontend

### 1. CORS Configurado
- Permite requisições do frontend
- Headers apropriados

### 2. Formato de Dados
- JSON padronizado
- Estrutura consistente
- Campos relevantes para mapas

### 3. Coordenadas
- Formato decimal
- Compatível com bibliotecas de mapa
- Precisão adequada

## Configuração no App Principal

### 1. Importação das Rotas
```javascript
import mapaRoutes from "./routes/mapaRoutes.js";
```

### 2. Registro das Rotas
```javascript
app.use("/mapa", mapaRoutes);
```

### 3. Middleware de Erro
```javascript
// Pode ser adicionado globalmente se necessário
app.use(validacaoMapa);
```

## Considerações de Segurança

### 1. Validação de Entrada
- Sanitização de parâmetros
- Validação de tipos
- Limites de valores

### 2. SQL Injection
- Uso de Sequelize ORM
- Parâmetros preparados
- Validação de entrada

### 3. Rate Limiting
- Pode ser implementado futuramente
- Middleware de throttling

## Extensibilidade

### 1. Novos Filtros
- Fácil adição de filtros
- Estrutura modular
- Configuração centralizada

### 2. Novos Endpoints
- Padrão consistente
- Reutilização de serviços
- Documentação automática

### 3. Cache
- Pode ser implementado no service
- Redis ou memória
- Invalidação inteligente

## Monitoramento e Logs

### 1. Logs de Erro
- Console.error para erros
- Stack trace em desenvolvimento
- Logs estruturados

### 2. Métricas
- Tempo de resposta
- Número de queries
- Erros por endpoint

### 3. Debug
- Logs de desenvolvimento
- Informações de query
- Validação de dados
