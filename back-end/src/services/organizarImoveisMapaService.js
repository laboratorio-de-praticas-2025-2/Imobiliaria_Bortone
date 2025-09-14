export const organizarImoveisMapView = (imoveis) => {
  return imoveis.map((imovel) => {
    // Se for Terreno, retorna apenas as informações essenciais
    if (imovel.tipo === "Terreno") {
      return {
        id: imovel.id,
        tipo: imovel.tipo,
        endereco: imovel.endereco,
        cidade: imovel.cidade,
        estado: imovel.estado,
        preco: imovel.preco,
        latitude: imovel.latitude,
        longitude: imovel.longitude,
        imagem:
          imovel.imagem_imovel && imovel.imagem_imovel.length > 0
            ? imovel.imagem_imovel[0].url_imagem
            : null, // Primeira imagem ou null
      };
    }

    // Para Casa, Apartamento, Cobertura, retorna informações completas
    return {
      id: imovel.id,
      tipo: imovel.tipo,
      endereco: imovel.endereco,
      cidade: imovel.cidade,
      estado: imovel.estado,
      preco: imovel.preco,
      latitude: imovel.latitude,
      longitude: imovel.longitude,
      quartos: imovel.casa.quartos,
      banheiros: imovel.casa.banheiros,
      vagas: imovel.casa.vagas,
      possui_piscina: imovel.casa.possui_piscina,
      possui_jardim: imovel.casa.possui_jardim,
      imagem:
        imovel.imagem_imovel && imovel.imagem_imovel.length > 0
          ? imovel.imagem_imovel[0].url_imagem
          : null, // Primeira imagem ou null
    };
  });
};

export const organizarImoveisCarrossel = (imoveis) => {
  return imoveis.map((imovel) => {
    // Para Terreno, retorna apenas as informações essenciais
    if (imovel.tipo === "Terreno") {
      return {
        id: imovel.id,
        tipo: imovel.tipo,
        endereco: imovel.endereco,
        cidade: imovel.cidade,
        estado: imovel.estado,
        preco: imovel.preco,
        status: imovel.status,
        area: imovel.area,
        descricao: imovel.descricao,
        imagens:
          imovel.imagem_imovel && imovel.imagem_imovel.length > 0
            ? imovel.imagem_imovel.map((img) => ({
                url_imagem: img.url_imagem,
                descricao: img.descricao,
              }))
            : [], // Usando o campo correto para imagens ou array vazio
        bairro: imovel.bairro,
      };
    }

    // Para Casa, Apartamento, Cobertura, retorna informações completas
    return {
      id: imovel.id,
      tipo: imovel.tipo,
      endereco: imovel.endereco,
      cidade: imovel.cidade,
      estado: imovel.estado,
      preco: imovel.preco,
      status: imovel.status,
      area: imovel.area,
      descricao: imovel.descricao,
      data_cadastro: imovel.data_cadastro,
      quartos: imovel.casa.quartos,
      banheiros: imovel.casa.banheiros,
      vagas: imovel.casa.vagas,
      possui_piscina: imovel.casa.possui_piscina,
      possui_jardim: imovel.casa.possui_jardim,
      imagens:
        imovel.imagem_imovel && imovel.imagem_imovel.length > 0
          ? imovel.imagem_imovel.map((img) => ({
              url_imagem: img.url_imagem,
              descricao: img.descricao,
            }))
          : imovel.imagens && imovel.imagens.length > 0 // Verifique o campo `imagens` como fallback
          ? imovel.imagens.map((img) => ({
              url_imagem: img.url_imagem,
              descricao: img.descricao,
            }))
          : [], // Usando o campo correto para imagens ou array vazio
      bairro: imovel.bairro,
    };
  });
};
