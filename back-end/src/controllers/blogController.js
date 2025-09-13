import blogService from "../services/blogService.js";

// Colocar o controller em uma classe

export const createArtigo = async (req, res) => {
  try {
    const novoArtigo = await blogService.createArtigo(req.body);
    res.status(201).json({
      messsage: "Novo artigo criado com sucesso.",
      data: novoArtigo,
    });
  } catch (err) {
    console.error("Erro ao criar artigo:", err.message);
    res.status(500).json({ error: "Erro ao criar o artigo." });
  }
};

export const getArtigoById = async (req, res) => {
  const { id } = req.params;
  try {
    const artigo = await blogService.getArtigoById(id);
    if (!artigo) {
      return res
        .status(404)
        .json({ error: `Artigo com o ID ${id} não encontrado.` });
    }
    res.status(200).json({
      message: "Artigo obtido com sucesso.",
      data: artigo,
    });
  } catch (err) {
    console.error(`Erro ao buscar o artigo de ID ${id}:`, err.message);
    res.status(500).json({ error: `Erro ao buscar o artigo de ID ${id}.` });
  }
};

// essa rota precisa passar os parametros de pesquisa ou ordenação para o service
export const getAllArtigos = async (req, res) => {
  try {
    const artigos = await blogService.getAllArtigos();
    res.status(200).json({ artigo: artigos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const updateArtigo = async (req, res) => {
  try {
    if (objectId.isValid(req.params.id)) {
      const id = req.params.id;
      const { usuario_id, titulo, conteudo, data_publicacao, url_imagem } =
        req.body;
      await blogService.updateArtigo(
        usuario_id,
        titulo,
        conteudo,
        data_publicacao,
        url_imagem
      );
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const deleteArtigo = async (req, res) => {
  const { id } = req.params;
  try {
    const artigoDeletado = await blogService.deleteArtigo(id);
    if (!artigoDeletado) {
      return res
        .status(404)
        .json({ error: `Artigo com o ID ${id} não encontrado para exclusão.` });
    }
    res.status(200).json({
      message: "Artigo deletado com sucesso.",
      data: artigoDeletado,
    });
  } catch (err) {
    console.error(`Erro ao deletar o artigo de ID ${id}:`, err.message);
    res.status(500).json({ error: `Erro ao deletar o artigo de ID ${id}.` });
  }
};

// Exporta o classe
