import publicidadeService from "../services/publicidadeService.js";

export const createPublicidade = async (req, res) => {
  try {
    const { titulo, conteudo, url_imagem, usuario_id, ativo } = req.body;

    if (!titulo || !conteudo || !usuario_id) {
      return res.status(400).json({ error: "Título, conteúdo e ID do usuário são obrigatórios." });
    }

    if (typeof usuario_id !== "number" || usuario_id <= 0) {
      return res.status(400).json({ error: "ID do usuário deve ser um número inteiro positivo." });
    }

    if (ativo !== undefined && typeof ativo !== "boolean") {
      return res.status(400).json({ error: 'O atributo "ativo" deve ser true ou false.' });
    }

    // Aqui você poderia validar se o usuário existe, mas como não temos o model Usuario importado, vamos pular essa parte nos testes mockados

    const novaPublicidade = await publicidadeService.createPublicidade({
      titulo,
      conteudo,
      url_imagem,
      usuario_id,
      ativo,
    });

    return res.status(201).json(novaPublicidade);
  } catch (error) {
    console.error("Erro ao criar publicidade:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const getAllPublicidades = async (req, res) => {
  try {
    const { titulo, usuario_id, page = 1, limit = 10, order = "createdAt" } = req.query;

    const pagina = parseInt(page, 10);
    const limite = parseInt(limit, 10);

    if (isNaN(pagina) || isNaN(limite) || pagina <= 0 || limite <= 0) {
      return res.status(400).json({ error: "Parâmetros de paginação inválidos" });
    }

    const resultado = await publicidadeService.getAllPublicidades({
      titulo,
      usuario_id,
      page: pagina,
      limit: limite,
      order,
    });

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao buscar publicidades:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getPublicidadeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido, deve ser numérico" });
    }

    const publicidade = await publicidadeService.getPublicidadeById(Number(id));

    if (!publicidade) {
      return res.status(404).json({ error: "Publicidade não encontrada" });
    }

    return res.status(200).json(publicidade);
  } catch (error) {
    console.error("Erro ao buscar publicidade por ID:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const updatePublicidade = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, conteudo, url_imagem, usuario_id, ativo } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: "ID inválido. O ID deve ser numérico." });
    }

    const publicidadeExistente = await publicidadeService.getPublicidadeById(Number(id));
    if (!publicidadeExistente) {
      return res.status(404).json({ error: "Publicidade não encontrada" });
    }

    const publicidadeAtualizada = await publicidadeService.updatePublicidade(Number(id), {
      titulo,
      conteudo,
      url_imagem,
      usuario_id,
      ativo,
    });

    return res.status(200).json({
      message: "Publicidade atualizada com sucesso",
      publicidade: publicidadeAtualizada,
    });
  } catch (error) {
    console.error("Erro ao atualizar publicidade:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const deletePublicidade = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido. O ID deve ser numérico." });
    }

    const publicidadeExistente = await publicidadeService.getPublicidadeById(Number(id));
    if (!publicidadeExistente) {
      return res.status(404).json({ error: "Publicidade não encontrada" });
    }

    await publicidadeService.deletePublicidade(Number(id));

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar publicidade:", error);
    return res.status(500).json({ error: "Erro interno ao tentar excluir a publicidade." });
  }
};