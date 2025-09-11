import blogService from "../services/blogService.js";

// Tudo oq for BLOG, alterar para ARTIGO

// Colocar o controller em uma classe 

// Alterar para createArtigo
export const createBlog = async (req, res) => {
  try {
    const novoBlog = await blogService.createBlog(req.body);
    res.status(201).json({
      // Alterar para "novo artigo criado ...""
      messsage: "Novo post de blog criado com sucesso.",
      data: novoBlog,
    });
  } catch (err) {
    // Melhorar a forma como o erro é mostrado no console
    console.log(err);
    // Alterar para "... criar artigo de ..."
    res.status(500).json({ error: "Erro ao criar o post de blog." });
  }
};

// Alterar para getArtigoById
export const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await blogService.getBlogById(id);
    if (!blog) {
      // Alterar para "Artigo não encontrada."
      return res.status(404).json({ error: "Post blog não encontrado." });
    }
    res.status(200).json({
      // Alterar para "Artigo obtido ..."
      message: "Post blog obtido com sucesso.",
      data: blog,
    });
  } catch (err) {
    // Melhorar a forma como o erro é mostrado no console
    console.error(err);
    //   Alterar para "... buscar o artigo de ID: ..."
    res.status(500).json({ error: "Erro ao buscar o post blog." });
  }
};

// essa rota precisa passar os parametros de pesquisa ou ordenação para o service
export const getAllArtigos = async (req, res) => {
  try {
    const blogs = await blogService.getAll();
    res.status(200).json({ blog: blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const updateArtigo = async (req, res) => {
    try {
        if (objectId.isValid(req.params.id)) {
            const id = req.params.id;
            const { usuario_id, titulo, conteudo, data_publicacao, url_imagem} = req.body;
            await blogService.update(usuario_id, titulo, conteudo, data_publicacao, url_imagem)
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        console.log(error) 
        res.status(500).json({error: "Erro interno do servidor."});
    }
};

// Alterar para deleteArtigo
export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blogDeletado = await blogService.deleteBlog(id);
    if (!blogDeletado) {
      // Alterar "Artigo de ID: ... não encontrado ..."
      return res
        .status(404)
        .json({ error: "Post de blog não encontrado para exclusão." });
    }
    res.status(200).json({
      // Alterar para "Artigo deletado ..."
      message: "Post de blog deletado com sucesso.",
      data: blogDeletado,
    });
  } catch (err) {
    // Melhorar a forma como o erro é mostrado no console
    console.error(err);
    // Alterar para "... deletar artigo."
    res.status(500).json({ error: "Erro ao deletar o post de blog." });
  }
};


// Exporta o classe