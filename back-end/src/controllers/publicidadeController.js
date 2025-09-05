import publicidade from "../models/publicidade.js";

const createPublicidade = async (req, res) => {
    try {
        const { titulo, conteudo, url_imagem, usuario_id} = req.body;

        if (!titulo || !conteudo || !usuario_id) {
            return res.status(400).json({error: "Título, conteúdo e ID do usuário são obrigatórios."});
        }

        if (typeof usuario_id !== "number" || usuario_id <= 0) {
            return res.status(400).json({ error: "ID do usuário deve ser um número inteiro positivo."});
        }

        if (typeof titulo !== "string" || typeof conteudo !== "string") {
            return res.status(400).json({error: "Título e conteúdo devem ser strings"});
        }

        const newAdData = {titulo, conteudo, url_imagem, usuario_id};
        const createAd = await publicidade.create(newAdData);
        res.status(201).json(createAd);
    } catch (error){
      console.error("Erro ao criar a publicidade:", error);
      res.status(500).json({error: "Erro interno no servidor"});
    }
};

// Validação de ID numérico
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: "ID inválido. O ID deve ser numérico." });
    };

// Update Imobiliaria Bortone
const updatePublicidade = async (req, res) => {
    try {
      const { id } = req.params;
      const { titulo, descricao, imagem, link, ativo } = req.body;
  
      const publicidade = await Publicidade.findByPk(id);
  
      if (!publicidade) {
        return res.status(404).json({ error: "Publicidade não encontrada" });
      }
  
      await publicidade.update({ titulo, descricao, imagem, link, ativo });
  
      return res.status(200).json({
        message: "Publicidade atualizada com sucesso",
        publicidade,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Erro ao atualizar publicidade",
        details: error.message,
      });
    }
  };


export default {createPublicidade, updatePublicidade};