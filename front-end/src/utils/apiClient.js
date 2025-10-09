// Cliente API simplificado para contornar problemas de CSP
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://imobiliaria-bortone.onrender.com';

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
  (response) => {
    console.log('✅ API Success:', {
      method: response.config?.method?.toUpperCase(),
      url: response.config?.url,
      status: response.status,
      dataLength: Array.isArray(response.data) ? response.data.length : 'objeto'
    });
    return response;
  },
  async (error) => {
    console.error('❌ API Error detalhado:', {
      message: error.message,
      code: error.code,
      name: error.name,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      responseData: error.response?.data,
      headers: error.config?.headers
    });
    
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
    return { 
      success: false, 
      error: error.message,
      apiUrl: API_BASE_URL 
    };
  }
};

export default apiClient;