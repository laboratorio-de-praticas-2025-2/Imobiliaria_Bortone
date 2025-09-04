import publicidade from "../models/publicidade.js";

const createPublicidade = async (req, res) => {
    try {
        const { titulo, conteudo, url_imagem, usuario_id} = req.body;

        if (!titulo || !conteudo || !usuario) {
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

export default {createPublicidade};