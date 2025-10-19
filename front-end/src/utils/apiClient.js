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

// Interceptor de requisição para incluir automaticamente o token de autenticação
apiClient.interceptors.request.use(
  (config) => {
    // Verificar se estamos no lado do cliente (browser)
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar erros
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
     
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