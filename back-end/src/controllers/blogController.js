import blogService from "../services/blogService.js";

export const createArtigo = async (req, res) => {
  try {
    console.log("=== BACK-END DEBUG BLOG ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("req.files:", req.files);
    console.log("req.headers:", req.headers);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("===========================");

    const { titulo, conteudo, usuario_id } = req.body;

    const url_imagem = req.file ? `/images/blogImages/${req.file.filename}` : null;

    console.log("url_imagem calculada:", url_imagem);

    const usuarioIdNumber = parseInt(usuario_id, 10);

    if (!titulo || !conteudo || !usuario_id) {
      return res.status(400).json({ error: "Título, conteúdo e ID do usuário são obrigatórios." });
    }

    if (isNaN(usuarioIdNumber) || usuarioIdNumber <= 0) {
      return res.status(400).json({ error: "ID do usuário deve ser um número inteiro positivo." });
    }

    const novoArtigo = await blogService.createArtigo({
      titulo,
      conteudo,
      url_imagem,
      usuario_id: usuarioIdNumber,
      // data_publicacao é preenchida automaticamente pelo Sequelize
    });

    return res.status(201).json(novoArtigo);
  } catch (error) {
    console.error("Erro ao criar artigo:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const getAllArtigos = async (req, res) => {
  try {
    const { titulo, usuario_id, ordenarPor, direcao, page, limit } = req.query;

    console.log("Query params recebidos (BLOG):", { titulo, usuario_id, ordenarPor, direcao, page, limit });

    const resultado = await blogService.getAllArtigos({
      titulo,
      usuario_id,
      ordenarPor,
      direcao,
      page,
      limit,
    });

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao buscar artigos:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getArtigoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido, deve ser numérico" });
    }

    const artigo = await blogService.getArtigoById(Number(id));

    if (!artigo) {
      return res.status(404).json({ error: "Artigo não encontrado" });
    }

    return res.status(200).json(artigo);
  } catch (error) {
    console.error("Erro ao buscar artigo por ID:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const updateArtigo = async (req, res) => {
  try {
    console.log("=== UPDATE DEBUG BLOG ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("req.params:", req.params);
    console.log("=========================");

    const { id } = req.params;
    const { titulo, conteudo, usuario_id } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: "ID inválido. O ID deve ser numérico." });
    }

    // Preparar dados para atualização - apenas campos que foram enviados
    const updateData = {};

    if (titulo !== undefined) updateData.titulo = titulo;
    if (conteudo !== undefined) updateData.conteudo = conteudo;

    if (usuario_id !== undefined) {
      const usuarioIdNumber = parseInt(usuario_id, 10);
      if (isNaN(usuarioIdNumber) || usuarioIdNumber <= 0) {
        return res.status(400).json({ error: "ID do usuário deve ser um número inteiro positivo." });
      }
      updateData.usuario_id = usuarioIdNumber;
    }

    // Se há arquivo enviado, usar o caminho completo
    if (req.file) {
      updateData.url_imagem = `/images/blogImages/${req.file.filename}`;
    }

    console.log("updateData (BLOG):", updateData);

    const artigoAtualizado = await blogService.updateArtigo(Number(id), updateData);

    return res.status(200).json({
      message: "Artigo atualizado com sucesso",
      artigo: artigoAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar artigo:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const deleteArtigo = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido. O ID deve ser numérico." });
    }

    const artigoExistente = await blogService.getArtigoById(Number(id));
    if (!artigoExistente) {
      return res.status(404).json({ error: "Artigo não encontrado" });
    }

    await blogService.deleteArtigo(Number(id));

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar artigo:", error);
    return res.status(500).json({ error: "Erro interno ao tentar excluir o artigo." });
  }
};