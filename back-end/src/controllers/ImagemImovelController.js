import path from 'path';
import * as ImagemImovelService from '../services/ImagemImovelService.js';

export const createImageReference = async (req, res) => {
  try {
    const { imovel_id, url_imagem, descricao } = req.body;

    console.log("Create image reference request body:", { imovel_id, url_imagem, descricao });

    if (!imovel_id || !url_imagem) {
      return res.status(400).json({ error: "Campos obrigatórios: imovel_id e url_imagem." });
    }

    const novaImagem = await ImagemImovelService.createImagem({
      imovel_id: parseInt(imovel_id),
      url_imagem,
      descricao: descricao || "Imagem do imóvel",
    });
    
    console.log("Referência de imagem salva com sucesso:", novaImagem);
    res.status(201).json(novaImagem);
  } catch (error) {
    console.error("Erro ao salvar referência da imagem no banco:", error);
    res.status(500).json({ 
      error: "Erro interno do servidor ao salvar referência da imagem.", 
      details: error.message 
    });
  }
};

export const deleteImage = async (req, res) => {
  const { id } = req.params;
  try {
    // Primeiro buscar a imagem para obter a URL
    const imagem = await ImagemImovelService.getImageById(id);
    if (!imagem) {
      return res.status(404).json({ error: "Imagem não encontrada." });
    }

    // Extrair o nome do arquivo da URL para eventual limpeza no Netlify
    const filename = path.basename(imagem.url_imagem);
    console.log("Deletando imagem:", { id, filename, url_imagem: imagem.url_imagem });

    // Deletar o registro do banco (o arquivo físico agora é responsabilidade do Netlify)
    const deleted = await ImagemImovelService.deleteImagem(id);
    if (!deleted) {
      return res.status(404).json({ error: "Erro ao excluir imagem do banco de dados." });
    }
    
    res.status(200).json({ 
      message: "Referência de imagem excluída com sucesso.",
      fileName: filename // Retorna nome do arquivo para eventual limpeza no frontend
    });
  } catch (error) {
    console.error("Erro ao excluir imagem:", error);
    res.status(500).json({ error: "Erro interno do servidor ao excluir imagem." });
  }
};

export const getImageById = async (req, res) => {
  const { id } = req.params;
  try {
    const image = await ImagemImovelService.getImageById(id);
    if (!image) {
      return res.status(404).json({ error: "Imagem não encontrada." });
    }
    res.status(200).json(image);
  } catch (error) {
    console.error("Erro ao buscar imagem por ID:", error);
    res.status(500).json({ error: "Erro interno do servidor ao buscar imagem." });
  }
};

export const getImagesByImovelId = async (req, res) => {
  const { imovelId } = req.params;
  try {
    const images = await ImagemImovelService.getImagesByImovelId(imovelId);
    if (!images || images.length === 0) {
      return res.status(404).json({ error: "Nenhuma imagem encontrada para este imóvel." });
    }
    res.status(200).json(images);
  } catch (error) {
    console.error("Erro ao buscar imagens por ID do imóvel:", error);
    res.status(500).json({ error: "Erro interno do servidor ao buscar imagens do imóvel." });
  }
};

// Função alternativa para criar imagem apenas com URL (sem upload)
export const createImageFromUrl = async (req, res) => {
  try {
    const { imovel_id, url_imagem, descricao } = req.body;

    if (!imovel_id || !url_imagem) {
      return res.status(400).json({ error: "Campos obrigatórios: imovel_id, url_imagem." });
    }

    const novaImagem = await ImagemImovelService.createImagem({
      imovel_id: parseInt(imovel_id),
      url_imagem,
      descricao: descricao || "Imagem do imóvel",
    });

    console.log("Imagem criada com sucesso:", novaImagem);
    res.status(201).json(novaImagem);
  } catch (error) {
    console.error("Erro ao criar imagem:", error);
    res.status(500).json({ 
      error: "Erro interno do servidor ao criar imagem.", 
      details: error.message 
    });
  }
};