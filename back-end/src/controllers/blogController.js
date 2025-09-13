import blogService from "../services/blogService.js";
import { isValidObjectId } from "mongoose";

class BlogController {
  
  async createArtigo(req, res) {
    try {
      const novoArtigo = await blogService.createArtigo(req.body);
      res.status(201).json({
        message: "Novo artigo criado com sucesso.",
        data: novoArtigo,
      });
    } catch (err) {
      console.error("Erro ao criar artigo:", err.message);
      res.status(500).json({ error: "Erro ao criar o artigo." });
    }
  }

  async getArtigoById(req, res) {
    const { id } = req.params;
    try {
      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: "ID de artigo inválido." });
      }

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
  }

  async getAllArtigos(req, res) {
    try {
      const query = req.query;
      const artigos = await blogService.getAllArtigos(query); // Passa os parâmetros para o service
      res.status(200).json({ artigos: artigos });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async updateArtigo(req, res) {
    const { id } = req.params;
    try {
      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: "ID de artigo inválido." });
      }

      const artigoAtualizado = await blogService.updateArtigo(id, req.body);
      if (!artigoAtualizado) {
        return res
          .status(404)
          .json({ error: `Artigo com o ID ${id} não encontrado para atualização.` });
      }

      res.status(200).json({
        message: "Artigo atualizado com sucesso.",
        data: artigoAtualizado,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async deleteArtigo(req, res) {
    const { id } = req.params;
    try {
      if (!isValidObjectId(id)) {
        return res.status(400).json({ error: "ID de artigo inválido." });
      }
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
  }
}

export default new BlogController();