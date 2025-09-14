import Faq from "../models/Faq.js";

class FaqService {
  async getAll() {
    try {
      const faqs = await Faq.findAll();
      return faqs;
    } catch (error) {
      console.error("Erro ao buscar FAQs:", error);
      throw error;
    }
  }

  async create(pergunta, resposta, usuario_id) {
    try {
      const newFaq = await Faq.create({ pergunta, resposta, usuario_id });
      return newFaq;
    } catch (error) {
      console.log("Erro ao criar FAQ:", error);
      throw error;
    }
  }

  async update(id, pergunta, resposta) {
    try {
      const faq = await Faq.findByPk(id);

      if (!faq) throw new Error("FAQ não encontrada");
      await faq.update({ pergunta, resposta });
      return faq;
    } catch (error) {
      console.error("Erro ao atualizar FAQ:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const faq = await Faq.findByPk(id);
      if (!faq) throw new Error("FAQ não encontrada");
      await faq.destroy();
    } catch (error) {
      console.error("Erro ao excluir FAQ:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const faq = await Faq.findByPk(id);
      if (!faq) throw new Error("FAQ não encontrada");
      return faq;
    } catch (error) {
      console.error("Erro ao buscar FAQ:", error);
      throw error;
    }
  }
}

export default new FaqService();
