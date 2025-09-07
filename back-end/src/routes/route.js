import express from "express";


const router = express.Router();



router.get("/", async (req, res) => {
  try {
    const blogs = await db("BLOG").select("*");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar blogs" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const blog = await db("BLOG").where({ id: req.params.id }).first();
    if (!blog) {
      return res.status(404).json({ error: "Blog não encontrado" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar blog" });
  }
});


router.post("/", async (req, res) => {
  try {
    const { titulo, conteudo, data_publicacao, url_imagem, usuario_id } = req.body;

    if (!titulo || !conteudo || !usuario_id) {
      return res.status(400).json({ error: "Campos obrigatórios: titulo, conteudo, usuario_id" });
    }

    const [id] = await db("BLOG").insert({
      titulo,
      conteudo,
      data_publicacao,
      url_imagem,
      usuario_id,
    });

    res.status(201).json({ message: "Blog criado com sucesso", id });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar blog" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { titulo, conteudo, data_publicacao, url_imagem, usuario_id } = req.body;

    const updated = await db("BLOG")
      .where({ id: req.params.id })
      .update({ titulo, conteudo, data_publicacao, url_imagem, usuario_id });

    if (!updated) {
      return res.status(404).json({ error: "Blog não encontrado" });
    }

    res.status(200).json({ message: "Blog atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar blog" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deleted = await db("BLOG").where({ id: req.params.id }).del();

    if (!deleted) {
      return res.status(404).json({ error: "Blog não encontrado" });
    }

    res.status(200).json({ message: "Blog excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir blog" });
  }
});

export default router;
