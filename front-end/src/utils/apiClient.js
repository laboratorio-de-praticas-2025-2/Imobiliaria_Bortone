// Cliente API simplificado para contornar problemas de CSP
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Cliente axios configurado com configurações específicas para desenvolvimento
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Configurações adicionais para contornar problemas de CSP
  withCredentials: false,
  maxRedirects: 5,
});

// Interceptor de resposta para tratar erros
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Se houver erro de rede (possivelmente CSP), tentar usar proxy
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.warn('Network error detected, attempting proxy fallback...');
      
      const originalConfig = error.config;
      if (originalConfig && !originalConfig._retryWithProxy) {
        originalConfig._retryWithProxy = true;
        
        try {
          // Construir URL completa para o proxy
          const fullUrl = originalConfig.baseURL + originalConfig.url;
          const proxyUrl = `/api/proxy?url=${encodeURIComponent(fullUrl)}`;
          
          const proxyResponse = await axios({
            ...originalConfig,
            url: proxyUrl,
            baseURL: '',
            method: originalConfig.method || 'GET'
          });
          
          return proxyResponse;
        } catch (proxyError) {
          console.error('Proxy fallback also failed:', proxyError);
          return Promise.reject(error);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Funções de conveniência que usam o cliente configurado
export const apiGet = (endpoint, config = {}) => {
  return apiClient.get(endpoint, config);
};

export const apiPost = (endpoint, data, config = {}) => {
  return apiClient.post(endpoint, data, config);
};

export const apiPut = (endpoint, data, config = {}) => {
  return apiClient.put(endpoint, data, config);
};

export const apiDelete = (endpoint, config = {}) => {
  return apiClient.delete(endpoint, config);
};

// Função para diagnóstico
export const checkApiConnection = async () => {
  try {
    const response = await apiGet('/health');
    return { success: true, data: response.data, method: 'direct' };
  } catch (error) {
    try {
      // Tentar através do proxy
      const proxyResponse = await axios.get(`/api/proxy?url=${encodeURIComponent(API_BASE_URL + '/health')}`);
      return { success: true, data: proxyResponse.data, method: 'proxy' };
    } catch (proxyError) {
      return { 
        success: false, 
        error: error.message,
        proxyError: proxyError.message,
        apiUrl: API_BASE_URL 
      };
    }
  }
};

export default apiClient;