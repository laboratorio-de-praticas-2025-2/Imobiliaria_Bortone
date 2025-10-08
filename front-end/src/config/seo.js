export const seoConfig = {
  // Página inicial
  home: {
    title: "Imobiliária Bortone",
    description: "A sua imobiliária de confiança. Encontre o imóvel dos seus sonhos com a melhor equipe de corretores.",
    keywords: "imobiliária, imóveis, comprar casa, alugar apartamento, corretor, financiamento imobiliário",
    url: "https://imobiliaria-bortone.vercel.app",
    type: "website"
  },
  
  // Página de simulação
  simulacao: {
    title: "Simulação de Financiamento",
    description: "Simule seu financiamento imobiliário e descubra as melhores condições para comprar seu imóvel.",
    keywords: "simulação, financiamento, imóvel, compra, banco, crédito imobiliário",
    url: "https://imobiliaria-bortone.vercel.app/simulacao",
    type: "website"
  },
  
  // Página de login
  login: {
    title: "Login",
    description: "Faça login na sua conta da Imobiliária Bortone e acesse seus imóveis favoritos.",
    keywords: "login, conta, acesso, imobiliária",
    url: "https://imobiliaria-bortone.vercel.app/login",
    type: "website"
  },
  
  // Página de cadastro
  cadastro: {
    title: "Cadastro",
    description: "Crie sua conta na Imobiliária Bortone e tenha acesso a imóveis exclusivos e ofertas especiais.",
    keywords: "cadastro, conta, registro, imobiliária, ofertas",
    url: "https://imobiliaria-bortone.vercel.app/cadastro",
    type: "website"
  },
  
  // Página de imóveis
  imoveis: {
    title: "Imóveis",
    description: "Explore nossa seleção de imóveis. Casas, apartamentos e terrenos para compra e locação.",
    keywords: "imóveis, casas, apartamentos, terrenos, compra, locação, venda",
    url: "https://imobiliaria-bortone.vercel.app/imoveis",
    type: "website"
  },
  
  // Página de blog
  blog: {
    title: "Blog",
    description: "Dicas, notícias e informações sobre o mercado imobiliário. Fique por dentro das últimas tendências.",
    keywords: "blog, dicas, notícias, mercado imobiliário, tendências, informações",
    url: "https://imobiliaria-bortone.vercel.app/blog",
    type: "website"
  },
  
  // Página de FAQ
  faq: {
    title: "Perguntas Frequentes",
    description: "Encontre respostas para as principais dúvidas sobre compra, venda e locação de imóveis.",
    keywords: "perguntas, frequentes, dúvidas, imóveis, compra, venda, locação",
    url: "https://imobiliaria-bortone.vercel.app/faq",
    type: "website"
  },
  
  // Página de mapa
  mapa: {
    title: "Mapa de Imóveis",
    description: "Visualize imóveis disponíveis em um mapa interativo. Encontre a localização perfeita.",
    keywords: "mapa, localização, imóveis, interativo, visualização",
    url: "https://imobiliaria-bortone.vercel.app/mapa",
    type: "website"
  },
  
  // Página bem-vindo
  "bem-vindo": {
    title: "Bem-vindo",
    description: "Bem-vindo à Imobiliária Bortone. Crie sua conta ou faça login para acessar nossos serviços exclusivos.",
    keywords: "bem-vindo, imobiliária, cadastro, login, conta",
    url: "https://imobiliaria-bortone.vercel.app/bem-vindo",
    type: "website"
  }
};

// Função para obter configuração por rota
export const getSEOConfig = (pathname) => {
  const route = pathname.replace('/', '') || 'home';
  return seoConfig[route] || seoConfig.home;
};