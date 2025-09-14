import FaqService from "../services/faqService.js";

const getAllFaqs = async (req, res) => {
  try {
    const faqs = await FaqService.getAll();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const createFaq = async (req, res) => {
  const { pergunta, resposta, usuario_id } = req.body;
  try {
    await FaqService.create(pergunta, resposta, usuario_id);
    res.status(201).json({ message: "FAQ criada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const updateFaq = async (req, res) => {
  const { id } = req.params;
  const { pergunta, resposta } = req.body;
  try {
    await FaqService.update(id, pergunta, resposta);
    res.status(200).json({ message: "FAQ atualizada com sucesso." });
  } catch (error) {
    if (error.message === "FAQ não encontrada") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
};

const deleteFaq = async (req, res) => {
  const { id } = req.params;
  try {
    await FaqService.delete(id);
    res.status(204).json();
  } catch (error) {
    if (error.message === "FAQ não encontrada") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
};

const getFaqById = async (req, res) => {
  const { id } = req.params;
  try {
    const faq = await FaqService.getById(id);
    res.status(200).json(faq);
  } catch (error) {
    if (error.message === "FAQ não encontrada") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
};

export default { getAllFaqs, createFaq, updateFaq, deleteFaq, getFaqById };
