# 🗺️ Sistema de Geocodificação e Autocomplete

## 📋 Visão Geral

Este documento descreve o sistema de geocodificação implementado no projeto Imobiliária Bortone, que permite preencher automaticamente informações de município/cidade a partir de:

1. **CEP digitado** (ViaCEP)
2. **Clique no mapa** (Nominatim - OpenStreetMap)
3. **Busca por nome de cidade** (Nominatim - OpenStreetMap)

## 🛠️ Componentes Criados

### 1. **Hooks**

#### `useGeocoding` (`/hooks/useGeocoding.js`)
Hook para geocodificação usando OpenStreetMap Nominatim API.

**Funcionalidades:**
- ✅ Geocodificação reversa: converte coordenadas (lat/lng) em endereço
- ✅ Busca de locais por texto
- ✅ Busca específica de cidades brasileiras

**Uso:**
```javascript
import { useGeocoding } from '@/hooks/useGeocoding';

const { reverseGeocode, searchCity, loading, error } = useGeocoding();

// Geocodificação reversa
const locationData = await reverseGeocode(-23.5505, -46.6333);
console.log(locationData.cidade); // "São Paulo"
console.log(locationData.estado); // "São Paulo"

// Buscar cidades
const cities = await searchCity("São Paulo", "SP");
```

#### `useViaCEP` (`/hooks/useViaCEP.js`)
Hook para buscar endereços por CEP usando ViaCEP API (gratuita, brasileira).

**Funcionalidades:**
- ✅ Buscar endereço completo por CEP
- ✅ Buscar CEP por endereço (reverso)
- ✅ Formatação automática de CEP

**Uso:**
```javascript
import { useViaCEP } from '@/hooks/useViaCEP';

const { buscarCEP, formatarCEP, loading } = useViaCEP();

// Buscar por CEP
const address = await buscarCEP("01310-100");
console.log(address.cidade); // "São Paulo"
console.log(address.estado); // "SP"
console.log(address.rua); // "Avenida Paulista"
```

### 2. **Componentes de Formulário**

#### `CityAutocomplete` (`/components/cms/form/fields/CityAutocomplete.js`)
Campo de autocomplete inteligente para cidades brasileiras.

**Props:**
- `value`: Valor inicial
- `onChange`: Callback quando o valor muda
- `onSelect`: Callback quando uma cidade é selecionada
- `placeholder`: Texto placeholder
- `state`: Sigla do estado para filtrar (opcional)
- `disabled`: Desabilitar campo
- `style`: Estilos customizados

**Uso:**
```javascript
import CityAutocomplete from '@/components/cms/form/fields/CityAutocomplete';

<Form.Item name="cidade_estado" label="Cidade/Estado">
  <CityAutocomplete
    placeholder="Digite o nome da cidade"
    onSelect={(value, option) => {
      console.log("Selecionado:", value);
      // value: "São Paulo, SP"
      // option: { cidade, estado, latitude, longitude }
    }}
  />
</Form.Item>
```

#### `CEPField` (`/components/cms/form/fields/CEPField.js`)
Campo de CEP com busca automática de endereço.

**Props:**
- `value`: Valor inicial do CEP
- `onChange`: Callback quando o CEP muda
- `onAddressFound`: Callback quando o endereço é encontrado
- `disabled`: Desabilitar campo
- `style`: Estilos customizados

**Uso:**
```javascript
import CEPField from '@/components/cms/form/fields/CEPField';

<Form.Item name="cep" label="CEP">
  <CEPField 
    onAddressFound={(addressData) => {
      // Preencher outros campos automaticamente
      form.setFieldsValue({
        cidade: addressData.cidade,
        estado: addressData.estado,
        endereco: addressData.rua,
        bairro: addressData.bairro
      });
    }}
  />
</Form.Item>
```

### 3. **Componente de Mapa Atualizado**

#### `MapPick` (`/components/cms/form/fields/MapPick.js`)
Componente de mapa com geocodificação reversa ao clicar.

**Nova funcionalidade:**
- Ao clicar no mapa, busca automaticamente a cidade e estado daquelas coordenadas
- Exibe notificação com a localização encontrada
- Retorna dados via callback

**Uso:**
```javascript
<MapPick 
  form={form}
  onCityStateFound={(locationData) => {
    // Preencher campos automaticamente
    setCidade(locationData.cidade);
    setEstado(locationData.estado);
  }}
/>
```

## 🎯 Implementações

### 1. **Formulário de Cadastro de Imóveis**
**Arquivo:** `/app/admin/cms-imoveis/criar/page.js`

**Funcionalidades implementadas:**
- ✅ Campo de CEP com preenchimento automático de cidade, estado e rua
- ✅ Clique no mapa preenche automaticamente cidade e estado
- ✅ Notificações visuais quando os campos são preenchidos

**Fluxo:**
1. Usuário digita o CEP → campos preenchidos automaticamente
2. Usuário clica no mapa → cidade e estado preenchidos
3. Campos podem ser editados manualmente se necessário

### 2. **Formulário de Agendamento**
**Arquivo:** `/app/agendamento/[id]/page.js`

**Funcionalidades implementadas:**
- ✅ Autocomplete de cidade com busca inteligente
- ✅ Busca em tempo real conforme o usuário digita
- ✅ Debounce de 500ms para evitar requisições excessivas

**Experiência do usuário:**
1. Usuário começa a digitar o nome da cidade
2. Após 3 caracteres, sugestões aparecem
3. Usuário seleciona a cidade desejada
4. Campo preenchido no formato "Cidade, Estado"

## 🌐 APIs Utilizadas

### 1. **OpenStreetMap Nominatim**
- **URL:** `https://nominatim.openstreetmap.org`
- **Tipo:** Gratuita
- **Limite:** 1 requisição por segundo
- **Uso:** Geocodificação reversa e busca de cidades

**Importante:** Requer header `User-Agent` customizado (configurado como `ImobiliariaBortone/1.0`)

### 2. **ViaCEP**
- **URL:** `https://viacep.com.br`
- **Tipo:** Gratuita, sem limites
- **Uso:** Busca de endereços por CEP brasileiro

**Formato do CEP:** Aceita com ou sem hífen (`12345-678` ou `12345678`)

## 🔧 Utilitários

### `stateMapping.js` (atualizado)
Adicionadas funções para converter entre nome completo e sigla de estados:

```javascript
import { getStateName, getStateAbbr } from '@/utils/stateMapping';

getStateName('SP'); // "São Paulo"
getStateAbbr('São Paulo'); // "SP"
```

## 🚀 Como Testar

### Testando CEP:
1. Vá para `/admin/cms-imoveis/criar`
2. Digite um CEP válido (ex: `11900-000`)
3. Observe os campos cidade, estado e endereço sendo preenchidos

### Testando Clique no Mapa:
1. Vá para `/admin/cms-imoveis/criar`
2. Clique em qualquer ponto do mapa
3. Observe a notificação com cidade/estado
4. Verifique que os dropdowns foram atualizados

### Testando Autocomplete de Cidade:
1. Vá para `/agendamento/[id]` (escolha um imóvel)
2. No campo "Cidade/Estado", digite "são"
3. Veja as sugestões aparecerem
4. Selecione uma cidade

## ⚠️ Considerações Importantes

### Limites de Taxa
- **Nominatim:** Máximo 1 requisição por segundo
- **ViaCEP:** Sem limites, mas use com moderação

### Debouncing
O autocomplete de cidades possui debounce de 500ms para:
- Reduzir número de requisições
- Melhorar performance
- Respeitar limites da API

### Tratamento de Erros
Todos os hooks possuem tratamento de erros:
- Mensagens de erro são logadas no console
- Estados de loading são gerenciados
- Feedback visual ao usuário em caso de falha

## 📝 Melhorias Futuras

1. **Cache de resultados**: Armazenar cidades já buscadas
2. **Geolocalização**: Detectar localização do usuário automaticamente
3. **Mapbox**: Considerar Mapbox para geocodificação mais precisa
4. **Histórico**: Salvar cidades recentemente buscadas
5. **Validação**: Adicionar validação de coordenadas

## 🐛 Troubleshooting

### Problema: "Erro ao buscar localização"
- **Causa:** Limite de taxa do Nominatim excedido
- **Solução:** Aguardar 1 segundo antes de nova requisição

### Problema: CEP não encontrado
- **Causa:** CEP inválido ou não existe
- **Solução:** Verificar se o CEP está correto (8 dígitos)

### Problema: Autocomplete não mostra resultados
- **Causa:** Texto muito curto (< 3 caracteres)
- **Solução:** Digite pelo menos 3 caracteres

## 📚 Referências

- [Nominatim API Docs](https://nominatim.org/release-docs/latest/api/Overview/)
- [ViaCEP Docs](https://viacep.com.br/)
- [OpenStreetMap Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)
