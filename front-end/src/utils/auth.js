// Função utilitária para logout centralizado
export const handleLogout = () => {
  // Remove todos os dados de autenticação do localStorage
  localStorage.removeItem("authToken");
  localStorage.removeItem("userInfo");
  
  // Limpa qualquer cache adicional se necessário
  // localStorage.clear(); // Use apenas se quiser limpar TUDO do localStorage
  
  // Redireciona para a página inicial
  window.location.href = "/bem-vindo";
};

// Função para verificar se o usuário está logado
export const isUserAuthenticated = () => {
  const authToken = localStorage.getItem("authToken");
  const userInfo = localStorage.getItem("userInfo");
  return !!(authToken && userInfo);
};

// Função para obter dados do usuário do localStorage
export const getUserInfo = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Erro ao parsing dos dados do usuário:", error);
    return null;
  }
};

// Função para obter token de autenticação
export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};