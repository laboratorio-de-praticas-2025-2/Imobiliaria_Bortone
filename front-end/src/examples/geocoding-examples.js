/* 
 * 🎯 EXEMPLO DE USO: Sistema de Geocodificação
 * 
 * Este arquivo demonstra como usar os novos componentes de geocodificação
 * em diferentes cenários do sistema.
 */

// ============================================
// EXEMPLO 1: Formulário Completo com CEP
// ============================================
import { Form } from 'antd';
import CEPField from '@/components/cms/form/fields/CEPField';
import TextField from '@/components/cms/form/fields/TextField';
import { useState } from 'react';

export function FormularioComCEP() {
  const [form] = Form.useForm();
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const handleCEPEncontrado = (dadosEndereco) => {
    // Quando o CEP é encontrado, preenche os campos automaticamente
    if (dadosEndereco) {
      setCidade(dadosEndereco.cidade);
      setEstado(dadosEndereco.estado);
      
      form.setFieldsValue({
        endereco: dadosEndereco.rua,
        bairro: dadosEndereco.bairro,
        cidade: dadosEndereco.cidade,
        estado: dadosEndereco.estado
      });
    }
  };

  return (
    <Form form={form}>
      {/* Campo CEP com busca automática */}
      <Form.Item name="cep" label="CEP">
        <CEPField onAddressFound={handleCEPEncontrado} />
      </Form.Item>

      {/* Campos que serão preenchidos automaticamente */}
      <Form.Item name="endereco" label="Endereço">
        <TextField placeholder="Rua, Avenida..." />
      </Form.Item>

      <Form.Item name="bairro" label="Bairro">
        <TextField placeholder="Bairro" />
      </Form.Item>

      <Form.Item name="cidade" label="Cidade">
        <TextField placeholder="Cidade" value={cidade} />
      </Form.Item>

      <Form.Item name="estado" label="Estado">
        <TextField placeholder="Estado" value={estado} />
      </Form.Item>
    </Form>
  );
}

// ============================================
// EXEMPLO 2: Autocomplete de Cidade Standalone
// ============================================
import CityAutocomplete from '@/components/cms/form/fields/CityAutocomplete';

export function BuscaCidade() {
  const handleSelecionarCidade = (valor, opcao) => {
    console.log('Cidade selecionada:', {
      textoCompleto: valor,        // "São Paulo, SP"
      cidade: opcao.cidade,         // "São Paulo"
      estado: opcao.estado,         // "São Paulo"
      latitude: opcao.latitude,     // -23.5505
      longitude: opcao.longitude    // -46.6333
    });
  };

  return (
    <div>
      <h3>Buscar Cidade</h3>
      <CityAutocomplete
        placeholder="Digite o nome da cidade..."
        onSelect={handleSelecionarCidade}
      />
    </div>
  );
}

// ============================================
// EXEMPLO 3: Mapa com Geocodificação Reversa
// ============================================
import MapPick from '@/components/cms/form/fields/MapPick';
import { getStateName } from '@/utils/stateMapping';

export function FormularioComMapa() {
  const [form] = Form.useForm();
  const [localEncontrado, setLocalEncontrado] = useState(null);

  const handleLocalizacaoDoMapa = (dadosLocal) => {
    console.log('📍 Localização clicada no mapa:', dadosLocal);
    
    setLocalEncontrado(dadosLocal);
    
    // Converter sigla do estado para nome completo se necessário
    const estadoCompleto = getStateName(dadosLocal.estado);
    
    // Preencher campos do formulário
    form.setFieldsValue({
      cidade: dadosLocal.cidade,
      estado: estadoCompleto,
      endereco: dadosLocal.rua || form.getFieldValue('endereco')
    });
  };

  return (
    <Form form={form}>
      <div style={{ height: '400px', marginBottom: '20px' }}>
        <MapPick 
          form={form}
          onCityStateFound={handleLocalizacaoDoMapa}
          initialCenter={[-24.4886, -47.8442]} // Registro, SP
          initialZoom={13}
        />
      </div>

      {localEncontrado && (
        <div style={{ padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
          <strong>Local encontrado:</strong> {localEncontrado.cidade} - {localEncontrado.estado}
        </div>
      )}

      <Form.Item name="latitude" label="Latitude">
        <TextField readOnly />
      </Form.Item>

      <Form.Item name="longitude" label="Longitude">
        <TextField readOnly />
      </Form.Item>
    </Form>
  );
}

// ============================================
// EXEMPLO 4: Hook useGeocoding Direto
// ============================================
import { useGeocoding } from '@/hooks/useGeocoding';
import { Button, Spin } from 'antd';

export function ExemploUseGeocoding() {
  const { reverseGeocode, searchCity, loading, error } = useGeocoding();
  const [resultado, setResultado] = useState(null);

  const buscarPorCoordenadas = async () => {
    // Coordenadas de Registro, SP
    const dados = await reverseGeocode(-24.4886, -47.8442);
    setResultado(dados);
  };

  const buscarCidade = async () => {
    const cidades = await searchCity('Registro', 'SP');
    console.log('Cidades encontradas:', cidades);
    if (cidades.length > 0) {
      setResultado(cidades[0]);
    }
  };

  return (
    <div>
      <h3>Teste de Geocodificação</h3>
      
      <Button onClick={buscarPorCoordenadas} loading={loading}>
        Buscar por Coordenadas
      </Button>
      
      <Button onClick={buscarCidade} loading={loading}>
        Buscar Cidade "Registro"
      </Button>

      {loading && <Spin />}
      {error && <div style={{ color: 'red' }}>Erro: {error}</div>}
      
      {resultado && (
        <pre>{JSON.stringify(resultado, null, 2)}</pre>
      )}
    </div>
  );
}

// ============================================
// EXEMPLO 5: Hook useViaCEP Direto
// ============================================
import { useViaCEP } from '@/hooks/useViaCEP';

export function ExemploUseViaCEP() {
  const { buscarCEP, formatarCEP, loading } = useViaCEP();
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState(null);

  const handleBuscarCEP = async () => {
    const dados = await buscarCEP(cep);
    if (dados) {
      setEndereco(dados);
      console.log('Endereço encontrado:', {
        cep: dados.cep,           // "11900-000"
        cidade: dados.cidade,     // "Registro"
        estado: dados.estado,     // "SP"
        rua: dados.rua,          // "Rua XV de Novembro"
        bairro: dados.bairro     // "Centro"
      });
    }
  };

  return (
    <div>
      <h3>Buscar CEP</h3>
      
      <input
        type="text"
        placeholder="Digite o CEP"
        value={cep}
        onChange={(e) => setCep(e.target.value)}
        maxLength={9}
      />
      
      <Button onClick={handleBuscarCEP} loading={loading}>
        Buscar
      </Button>

      {endereco && (
        <div>
          <p><strong>CEP:</strong> {endereco.cep}</p>
          <p><strong>Rua:</strong> {endereco.rua}</p>
          <p><strong>Bairro:</strong> {endereco.bairro}</p>
          <p><strong>Cidade:</strong> {endereco.cidade}</p>
          <p><strong>Estado:</strong> {endereco.estado}</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// EXEMPLO 6: Formulário Completo Integrado
// ============================================
export function FormularioCadastroImovel() {
  const [form] = Form.useForm();
  
  // Handler unificado para todas as fontes de dados
  const preencherEndereco = (fonte, dados) => {
    console.log(`📝 Preenchendo endereço via ${fonte}:`, dados);
    
    const updates = {};
    
    if (dados.cidade) updates.cidade = dados.cidade;
    if (dados.estado) updates.estado = dados.estado;
    if (dados.rua) updates.endereco = dados.rua;
    if (dados.bairro) updates.bairro = dados.bairro;
    if (dados.cep) updates.cep = dados.cep;
    
    form.setFieldsValue(updates);
  };

  return (
    <Form form={form} layout="vertical">
      {/* Método 1: CEP */}
      <Form.Item name="cep" label="CEP">
        <CEPField 
          onAddressFound={(dados) => preencherEndereco('CEP', dados)}
        />
      </Form.Item>

      {/* Campos de endereço */}
      <Form.Item name="endereco" label="Endereço">
        <TextField />
      </Form.Item>

      <Form.Item name="bairro" label="Bairro">
        <TextField />
      </Form.Item>

      {/* Método 2: Autocomplete de Cidade */}
      <Form.Item name="cidade" label="Cidade">
        <CityAutocomplete
          onSelect={(valor, opcao) => {
            preencherEndereco('Autocomplete', {
              cidade: opcao.cidade,
              estado: opcao.estado
            });
          }}
        />
      </Form.Item>

      <Form.Item name="estado" label="Estado">
        <TextField />
      </Form.Item>

      {/* Método 3: Mapa */}
      <div style={{ height: '300px', marginBottom: '20px' }}>
        <MapPick 
          form={form}
          onCityStateFound={(dados) => preencherEndereco('Mapa', dados)}
        />
      </div>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Cadastrar Imóvel
        </Button>
      </Form.Item>
    </Form>
  );
}

// ============================================
// EXEMPLO 7: Conversão de Estados
// ============================================
import { getStateName, getStateAbbr, statesMap } from '@/utils/stateMapping';

export function ExemploConversaoEstados() {
  // Converter sigla para nome completo
  console.log(getStateName('SP'));  // "São Paulo"
  console.log(getStateName('RJ'));  // "Rio de Janeiro"
  console.log(getStateName('MG'));  // "Minas Gerais"

  // Converter nome completo para sigla
  console.log(getStateAbbr('São Paulo'));     // "SP"
  console.log(getStateAbbr('Rio de Janeiro')); // "RJ"
  console.log(getStateAbbr('Minas Gerais'));   // "MG"

  // Acessar mapa completo
  console.log(statesMap); // { "Acre": "AC", "Alagoas": "AL", ... }
}

// ============================================
// EXEMPLO 8: Tratamento de Erros
// ============================================
export function ExemploTratamentoErros() {
  const { buscarCEP, loading, error } = useViaCEP();
  const [mensagem, setMensagem] = useState('');

  const buscarComTratamento = async (cep) => {
    try {
      const resultado = await buscarCEP(cep);
      
      if (!resultado) {
        setMensagem('CEP não encontrado. Verifique e tente novamente.');
        return;
      }
      
      if (resultado.erro) {
        setMensagem('Este CEP não existe na base de dados.');
        return;
      }
      
      setMensagem(`Sucesso! Cidade: ${resultado.cidade} - ${resultado.estado}`);
      
    } catch (err) {
      setMensagem(`Erro ao buscar CEP: ${err.message}`);
      console.error('Erro:', err);
    }
  };

  return (
    <div>
      <Button onClick={() => buscarComTratamento('11900-000')}>
        Buscar CEP Válido
      </Button>
      
      <Button onClick={() => buscarComTratamento('00000-000')}>
        Buscar CEP Inválido
      </Button>

      {loading && <Spin />}
      {mensagem && <div>{mensagem}</div>}
      {error && <div style={{ color: 'red' }}>Erro: {error}</div>}
    </div>
  );
}
