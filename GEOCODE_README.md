# 🌍 Geocodificação e Autocomplete - Guia Rápido

## ✨ O que foi implementado?

Sistema completo de autocomplete e geocodificação para facilitar o cadastro de imóveis e agendamentos:

### 🎯 Funcionalidades

1. **📮 Busca por CEP** - Digite o CEP e os campos são preenchidos automaticamente
2. **🗺️ Clique no Mapa** - Clique no mapa e obtenha cidade/estado automaticamente
3. **🔍 Autocomplete de Cidades** - Busca inteligente de cidades brasileiras

## 🚀 Uso Rápido

### 1. Campo de CEP com Autocomplete

```jsx
import CEPField from '@/components/cms/form/fields/CEPField';

<FormAntd.Item name="cep" label="CEP">
  <CEPField 
    onAddressFound={(data) => {
      console.log(data.cidade);    // Ex: "Registro"
      console.log(data.estado);    // Ex: "SP"
      console.log(data.rua);       // Ex: "Rua XV de Novembro"
      console.log(data.bairro);    // Ex: "Centro"
    }}
  />
</FormAntd.Item>
```

### 2. Autocomplete de Cidades

```jsx
import CityAutocomplete from '@/components/cms/form/fields/CityAutocomplete';

<Form.Item name="cidade" label="Cidade">
  <CityAutocomplete
    placeholder="Digite o nome da cidade"
    onSelect={(value, option) => {
      console.log(value);           // "Registro, São Paulo"
      console.log(option.cidade);   // "Registro"
      console.log(option.estado);   // "São Paulo"
      console.log(option.latitude); // -24.4886
    }}
  />
</Form.Item>
```

### 3. Mapa com Geocodificação Reversa

```jsx
<MapPick 
  form={form}
  onCityStateFound={(location) => {
    console.log(location.cidade);  // Ex: "Registro"
    console.log(location.estado);  // Ex: "São Paulo"
    console.log(location.rua);     // Ex: "Rua XV de Novembro"
  }}
/>
```

## 📍 Onde está implementado?

### ✅ Cadastro de Imóveis (`/admin/cms-imoveis/criar`)
- Campo CEP com preenchimento automático
- Mapa com geocodificação reversa ao clicar
- Auto-preenchimento de cidade, estado e endereço

### ✅ Agendamento de Visita (`/agendamento/[id]`)
- Autocomplete de cidade/estado
- Busca inteligente com sugestões em tempo real

## 🎨 Exemplo Prático

### Cenário: Cadastrando um imóvel em Registro/SP

**Opção 1: Usar CEP**
```
1. Digite: 11900-000
2. ✨ Mágica! Campos preenchidos:
   - Cidade: Registro
   - Estado: SP
   - Endereço: (rua será preenchida se o CEP for específico)
```

**Opção 2: Clicar no Mapa**
```
1. Clique em qualquer ponto do mapa
2. 🗺️ Aparece: "Local: Registro - São Paulo"
3. ✨ Campos preenchidos automaticamente!
```

**Opção 3: Buscar pela Cidade**
```
1. Digite: "Regi"
2. 🔍 Sugestões aparecem:
   - Registro - São Paulo
   - Registo - Minas Gerais (se houver)
3. Selecione a cidade desejada
```

## 🔧 APIs Gratuitas Utilizadas

### 🇧🇷 ViaCEP
- **Para que serve:** Buscar endereços por CEP brasileiro
- **Gratuita:** ✅ Sim, sem limites
- **Exemplo:** `https://viacep.com.br/ws/11900000/json/`

### 🌍 OpenStreetMap Nominatim
- **Para que serve:** Geocodificação reversa e busca de cidades
- **Gratuita:** ✅ Sim, limite de 1 req/segundo
- **Exemplo:** Converter coordenadas em endereço

## 💡 Dicas de Uso

### ⚡ Performance
- Autocomplete só busca após digitar 3+ caracteres
- Debounce de 500ms para evitar requisições excessivas
- Cache automático de resultados durante a sessão

### 🎯 Melhores Práticas
1. **CEP primeiro**: Se tem o CEP, use-o! É o mais rápido
2. **Mapa para precisão**: Use o mapa quando não sabe o CEP
3. **Autocomplete para usuário**: Deixe o usuário digitar quando preferir

### ⚠️ Limitações
- Nominatim: máx. 1 requisição/segundo
- CEPs novos podem não estar no ViaCEP ainda
- Coordenadas muito remotas podem não retornar cidade

## 🐛 Resolução de Problemas

| Problema | Solução |
|----------|---------|
| CEP não encontrado | Verificar se o CEP existe (8 dígitos) |
| Autocomplete vazio | Digitar pelo menos 3 caracteres |
| Erro "Too Many Requests" | Aguardar 1 segundo entre cliques no mapa |
| Cidade errada no mapa | Clicar novamente ou digitar manualmente |

## 📚 Arquivos Importantes

```
front-end/src/
├── hooks/
│   ├── useGeocoding.js      # Hook de geocodificação
│   └── useViaCEP.js         # Hook de busca por CEP
├── components/cms/form/fields/
│   ├── CityAutocomplete.js  # Autocomplete de cidades
│   ├── CEPField.js          # Campo de CEP
│   └── MapPick.js           # Mapa com geocodificação
└── utils/
    └── stateMapping.js      # Conversão estado ↔ sigla
```

## 🎉 Resultado Final

Agora seus usuários podem:
- ✅ Cadastrar imóveis mais rápido
- ✅ Preencher endereços automaticamente
- ✅ Agendar visitas com menos digitação
- ✅ Ter uma experiência mais fluida e moderna

---

**Documentação completa:** `/documentacao/docs/GeocodeAutocomplete.md`
