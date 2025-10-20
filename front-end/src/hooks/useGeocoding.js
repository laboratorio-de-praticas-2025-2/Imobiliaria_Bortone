import { useState } from 'react';

/**
 * Hook para geocodificação reversa usando OpenStreetMap Nominatim
 * Converte coordenadas (latitude, longitude) em endereço
 */
export const useGeocoding = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Geocodificação reversa: coordenadas → endereço
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<Object>} Objeto com cidade, estado, país, etc.
   */
  const reverseGeocode = async (lat, lng) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=pt-BR`,
        {
          headers: {
            'User-Agent': 'ImobiliariaBortone/1.0' // Nominatim requer User-Agent
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar localização');
      }

      const data = await response.json();
      
      // Extrair informações relevantes
      const address = data.address || {};
      
      return {
        cidade: address.city || 
                address.town || 
                address.village || 
                address.municipality || 
                address.county || 
                'Cidade não encontrada',
        estado: address.state || 'Estado não encontrado',
        pais: address.country || 'Brasil',
        endereco_completo: data.display_name || '',
        cep: address.postcode || '',
        bairro: address.suburb || address.neighbourhood || '',
        rua: address.road || '',
        raw: data // Dados completos para debug
      };
    } catch (err) {
      setError(err.message);
      console.error('Erro na geocodificação reversa:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Geocodificação direta: busca endereços por texto
   * @param {string} query - Texto de busca (ex: "São Paulo, SP")
   * @returns {Promise<Array>} Lista de locais encontrados
   */
  const searchLocation = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=br&accept-language=pt-BR`,
        {
          headers: {
            'User-Agent': 'ImobiliariaBortone/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar local');
      }

      const data = await response.json();
      
      return data.map(item => ({
        nome: item.display_name,
        cidade: item.address?.city || 
                item.address?.town || 
                item.address?.village || 
                item.address?.municipality,
        estado: item.address?.state,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        raw: item
      }));
    } catch (err) {
      setError(err.message);
      console.error('Erro na busca de localização:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Busca específica por cidades brasileiras
   * @param {string} cityName - Nome da cidade
   * @param {string} state - Sigla do estado (opcional)
   * @returns {Promise<Array>} Lista de cidades encontradas
   */
  const searchCity = async (cityName, state = '') => {
    const query = state 
      ? `${cityName}, ${state}, Brasil`
      : `${cityName}, Brasil`;
    
    return await searchLocation(query);
  };

  return {
    reverseGeocode,
    searchLocation,
    searchCity,
    loading,
    error
  };
};
