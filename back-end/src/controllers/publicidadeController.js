import Publicidade from "../services/publicidade.js";

// GET /publicidade
export const getAllPublicidades = async (req, res) => {
  try {
    const publicidades = await Publicidade.findAll();
    res.status(200).json(publicidades);
  } catch (error) {
    console.error("Erro ao buscar publicidades:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// GET /publicidade/:id
export const getPublicidadeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: "ID inválido. O ID deve ser numérico." });
    }

    const publicidade = await Publicidade.findByPk(id);
    if (!publicidade) {
      return res.status(404).json({ error: "Publicidade não encontrada" });
    }

    res.status(200).json(publicidade);
  } catch (error) {
    console.error("Erro ao buscar publicidade:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// POST /publicidade
export const createPublicidade = async (req, res) => {
  try {
    const { titulo, conteudo, url_imagem, usuario_id } = req.body;

    if (!titulo || !conteudo || !usuario_id) {
      return res.status(400).json({ error: "Título, conteúdo e ID do usuário são obrigatórios." });
    }

    if (typeof usuario_id !== "number" || usuario_id <= 0) {
      return res.status(400).json({ error: "ID do usuário deve ser um número inteiro positivo." });
    }

    const novaPublicidade = await Publicidade.create({ titulo, conteudo, url_imagem, usuario_id });
    res.status(201).json(novaPublicidade);
  } catch (error) {
    console.error("Erro ao criar publicidade:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// PUT /publicidade/:id
export const updatePublicidade = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, conteudo, url_imagem, usuario_id } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: "ID inválido. O ID deve ser numérico." });
    }

    const publicidade = await Publicidade.findByPk(id);
    if (!publicidade) {
      return res.status(404).json({ error: "Publicidade não encontrada" });
    }

    await publicidade.update({ titulo, conteudo, url_imagem, usuario_id });
    res.status(200).json({ message: "Publicidade atualizada com sucesso", publicidade });
  } catch (error) {
    console.error("Erro ao atualizar publicidade:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// DELETE /publicidade/:id
export const deletePublicidade = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido. O ID deve ser numérico." });
    }

    const publicidade = await Publicidade.findByPk(id);
    if (!publicidade) {
      return res.status(404).json({ error: "Publicidade não encontrada" });
    }

    await publicidade.destroy();

    res.status(204).send();

  } catch (error) {
    console.error("Erro ao deletar publicidade:", error);
    res.status(500).json({ error: "Erro interno ao tentar excluir a publicidade." });
  }
};
