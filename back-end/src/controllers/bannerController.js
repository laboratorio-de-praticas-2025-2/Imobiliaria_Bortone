import BannerService from "../services/bannerService.js";

// Listar todos os banners
const getAllBanners = async (req, res) => {
  try {
    const banners = await BannerService.getAll();
    res.status(200).json(banners);
  } catch (error) {
    console.error("Erro ao listar banners:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Listar banner por ID
const getBannerById = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await BannerService.getById(Number(id));
    res.status(200).json(banner);
  } catch (error) {
    if (error.message === "Banner não encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      console.error("Erro ao buscar banner:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
};

// Criar banner
const createBanner = async (req, res) => {
  const { descricao, usuario_id, url_imagem } = req.body;
  const ativo = 1; // status ativo por padrão

  try {
    await BannerService.create(
      url_imagem,
      descricao,
      Number(usuario_id),
      Number(ativo)
    );
    res.status(201).json({ message: "Banner criado com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar banner:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Atualizar banner
const updateBanner = async (req, res) => {
  const { id } = req.params;
  const { descricao, usuario_id, url_imagem } = req.body;

  try {
    await BannerService.update(
      Number(id),
      url_imagem,
      descricao,
      usuario_id ? Number(usuario_id) : undefined
      // não sobrescreve o ativo aqui
    );
    res.status(200).json({ message: "Banner atualizado com sucesso." });
  } catch (error) {
    if (error.message === "Banner não encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      console.error("Erro ao atualizar banner:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
};

// Excluir banner
const deleteBanner = async (req, res) => {
  const { id } = req.params;
  try {
    await BannerService.delete(Number(id));
    res.status(200).json({ message: "Banner excluído com sucesso." });
  } catch (error) {
    if (error.message === "Banner não encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      console.error("Erro ao excluir banner:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
};

//Toggle (ativar/desativar) banner
const toggleBannerStatus = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`[toggleBannerStatus] id=${id}`);

    // Busca banner
    const banner = await BannerService.getById(Number(id));
    console.log(`[toggleBannerStatus] before ativo=`, banner.ativo);

    // Alterna status
    const current = banner.ativo === 1 || banner.ativo === "1" || banner.ativo === true || banner.ativo === "true";
    const novoStatus = current ? 0 : 1;

    const updated = await BannerService.update(
      Number(id),
      undefined, // url_imagem
      undefined, // descricao
      undefined, // usuario_id
      novoStatus
    );

    console.log(`[toggleBannerStatus] after ativo=`, updated.ativo);

    return res.status(200).json({
      message: "Status atualizado com sucesso",
      ativo: updated.ativo,
      banner: updated
    });
  } catch (error) {
    console.error("[toggleBannerStatus] erro:", error);
    if (error.message === "Banner não encontrado") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export default {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus
};
