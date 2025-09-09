import publicidadeService from "../services/publicidadeService.js";
import Publicidade from "../services/publicidadeService.js";

// GET /publicidade
export const getAllPublicidades = async (req, res) => {
  try {
    // O controller deve validar os dados recebidos

    // O controller deve chamar os métodos do Service e passar os parametros caso haja filtros de busca
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

    // O controller não deve pesquisar o registro referente ao id recebido, e sim chamar o metodo do service, se retornar vazio é porque não existe
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
    // receber o atributo "ativo"
    const { titulo, conteudo, url_imagem, usuario_id } = req.body;

    if (!titulo || !conteudo || !usuario_id) {
      return res.status(400).json({ error: "Título, conteúdo e ID do usuário são obrigatórios." });
    }

    if (typeof usuario_id !== "number" || usuario_id <= 0) {
      return res.status(400).json({ error: "ID do usuário deve ser um número inteiro positivo." });
    }
    // Verificar se o id do usuário é válido
    // Verificar o atributo "ativo"

    // O controller deve chamar o método do service e passar os dados recebidos
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
    // Receber o atributo "ativo"
    const { titulo, conteudo, url_imagem, usuario_id } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: "ID inválido. O ID deve ser numérico." });
    }

    // Validar o id do usuário e o atributo "ativo"

    const publicidade = await Publicidade.findByPk(id);
    if (!publicidade) {
      return res.status(404).json({ error: "Publicidade não encontrada" });
    }

    // Chamar o método do service
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

    const deletePublicidade = await Publicidade.findByPk(id);
    if (!publicidade) {
      return res.status(404).json({ error: "Publicidade não encontrada" });
    }

    // Chamar o método do service
    await publicidadeService.delete(id);

    res.status(204).send();

  } catch (error) {
    console.error("Erro ao deletar publicidade:", error);
    res.status(500).json({ error: "Erro interno ao tentar excluir a publicidade." });
  }
};
