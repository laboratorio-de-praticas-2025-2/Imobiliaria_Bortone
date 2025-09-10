import * as blogService from "../services/blogService.js"

export const createBlog = async (req, res) => {
    try {
        const novoBlog = await blogService.createBlog(req.body);
        res.status(201).json({
            messsage: "Novo post de blog criado com sucesso.",
            data: novoBlog,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({error: "Erro ao criar o post de blog."});
    }
};

export const getBlogById = async (req, res) => {
    const {id} = req.params;
    try {
        const blog = await blogService.getBlogById(id);
        if (!blog) {
            return res.status(404).json({error: "Post blog não encontrado."});
        }
        res.status(200).json({
            message: 'Post blog obtido com sucesso.',
            data: blog,
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({error: "Erro ao buscar o post blog."})
    }
};

// implementar o getAllBlogs


// implementar o updateBlog


export const deleteBlog = async (req, res) => {
    const {id} = req.params;
    try {
        const blogDeletado = await blogService.deleteBlog(id);
        if (!blogDeletado) {
            return res.status(404).json({error: "Post de blog não encontrado para exclusão."});
        }
        res.status(200).json({
            message: "Post de blog deletado com sucesso.",
            data: blogDeletado,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Erro ao deletar o post de blog."});
    }
    
}