import publicidadeService from "../services/publicidadeService.js";

// GET /publicidade
export const getAllPublicidades = async (req, res) => {
  try {
    const { titulo, usuario_id, page = 1, limit = 10, order = "createdAt" } = req.query;

    // Validação de paginação
    const pagina = parseInt(page, 10);
    const limite = parseInt(limit, 10);

    if (isNaN(pagina) || isNaN(limite) || pagina <= 0 || limite <= 0) {
      return res.status(400).json({ error: "Parâmetros de paginação inválidos" });
    }

    // Chama o service passando filtros, paginação e ordenação
    const resultado = await publicidadeService.getAll({
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

// GET /publicidade/:id
export const getPublicidadeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validação de ID numérico
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido, deve ser numérico" });
    }

    const publicidade = await publicidadeService.getById(Number(id));

    // Verificação de existência
    if (!publicidade) {
      return res.status(404).json({ error: "Publicidade não encontrada" });
    }

    return res.status(200).json(publicidade);
  } catch (error) {
    console.error("Erro ao buscar publicidade por ID:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// POST /publicidade
export const createPublicidade = async (req, res) => {
  try {
    
    const { titulo, conteudo, url_imagem, usuario_id, ativo } = req.body;

    if (!titulo || !conteudo || !usuario_id) {
      return res.status(400).json({ error: "Título, conteúdo e ID do usuário são obrigatórios." });
    }

    if (typeof usuario_id !== "number" || usuario_id <= 0) {
      return res.status(400).json({ error: "ID do usuário deve ser um número inteiro positivo." });
    }

    // Verificar se o id do usuário é válido ✔️
    const usuario = await Usuario.getById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Verificar o atributo "ativo" ✔️
    if (ativo !== undefined && typeof ativo !== "boolean") {
      return res.status(400).json({ error: 'O atributo "ativo" deve ser true ou false.' });
    }
    
    const novaPublicidade = await publicidadeService.create({ 
      titulo, 
      conteudo, 
      url_imagem, 
      usuario_id, 
      ativo });
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
    // Receber o atributo "ativo"
    const { titulo, conteudo, url_imagem, usuario_id } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: "ID inválido. O ID deve ser numérico." });
    }

    // Validar o id do usuário e o atributo "ativo"

    const updatePublicidade = await publicidadeService.getById(Number(id));
    if (!publicidade) {
      return res.status(404).json({ error: "Publicidade não encontrada" });
    }

    // Chamar o método do service
    await updatePublicidade.update(Number(id)),({ titulo, conteudo, url_imagem, usuario_id, ativo });
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

    const deletePublicidade = await publicidadeService.getById(id);
    if (!deletePublicidade) {
      return res.status(404).json({ error: "Publicidade não encontrada" });
    }

    await publicidadeService.delete(id);

    res.status(204).send();

  } catch (error) {
    console.error("Erro ao deletar publicidade:", error);
    res.status(500).json({ error: "Erro interno ao tentar excluir a publicidade." });
  }
};
