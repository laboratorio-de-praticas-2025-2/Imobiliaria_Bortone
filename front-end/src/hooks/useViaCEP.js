import { useState } from 'react';

/**
 * Hook para buscar informações de endereço por CEP usando ViaCEP
 * API gratuita brasileira sem necessidade de chave
 */
export const useViaCEP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Busca endereço completo por CEP
   * @param {string} cep - CEP no formato "12345678" ou "12345-678"
   * @returns {Promise<Object>} Objeto com dados do endereço
   */
  const buscarCEP = async (cep) => {
    setLoading(true);
    setError(null);

    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '');

    // Validação básica de CEP
    if (cepLimpo.length !== 8) {
      setError('CEP inválido. Deve conter 8 dígitos.');
      setLoading(false);
      return null;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

      if (!response.ok) {
        throw new Error('Erro ao buscar CEP');
      }

      const data = await response.json();

      // ViaCEP retorna {erro: true} quando não encontra o CEP
      if (data.erro) {
        setError('CEP não encontrado');
        return null;
      }

      return {
        cep: data.cep,
        rua: data.logradouro,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
        ibge: data.ibge,
        gia: data.gia,
        ddd: data.ddd,
        siafi: data.siafi,
        raw: data
      };
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar CEP:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formata CEP para o padrão brasileiro (12345-678)
   * @param {string} cep - CEP sem formatação
   * @returns {string} CEP formatado
   */
  const formatarCEP = (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return cep;
    return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  /**
   * Busca CEP por endereço (pesquisa reversa)
   * @param {string} uf - Sigla do estado (ex: "SP")
   * @param {string} cidade - Nome da cidade
   * @param {string} logradouro - Nome da rua
   * @returns {Promise<Array>} Lista de CEPs encontrados
   */
  const buscarEndereco = async (uf, cidade, logradouro) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${uf}/${encodeURIComponent(cidade)}/${encodeURIComponent(logradouro)}/json/`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar endereço');
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        setError('Nenhum endereço encontrado');
        return [];
      }

      return data.map(item => ({
        cep: item.cep,
        rua: item.logradouro,
        complemento: item.complemento,
        bairro: item.bairro,
        cidade: item.localidade,
        estado: item.uf,
        ibge: item.ibge,
        raw: item
      }));
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar endereço:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    buscarCEP,
    buscarEndereco,
    formatarCEP,
    loading,
    error
  };
};
