import BannerIndex from "../models/BannerIndex.js";

const BannerService = {
  // listar todos
  async getAll() {
    return await BannerIndex.findAll();
  },

  // buscar por id
  async getById(id) {
    const banner = await BannerIndex.findByPk(id);
    if (!banner) {
      throw new Error("Banner não encontrado");
    }
    return banner;
  },

  // criar
  async create(url_imagem, descricao, usuario_id, ativo) {
    const ativoNormalized =
      ativo === undefined
        ? 1 // se não enviado, já cria ativo
        : this.normalizeAtivo(ativo);

    const dadosParaCriar = {
      url_imagem,
      descricao,
      usuario_id,
      ativo: ativoNormalized,
    };

    return await BannerIndex.create(dadosParaCriar);
  },

  // atualizar
  async update(id, url_imagem, descricao, usuario_id, ativo) {
    const banner = await BannerIndex.findByPk(id);
    if (!banner) {
      throw new Error("Banner não encontrado");
    }

    const ativoNormalized =
      ativo !== undefined ? this.normalizeAtivo(ativo) : banner.ativo;

    await banner.update({
      url_imagem: url_imagem !== undefined ? url_imagem : banner.url_imagem,
      descricao: descricao !== undefined ? descricao : banner.descricao,
      usuario_id: usuario_id !== undefined ? usuario_id : banner.usuario_id,
      ativo: ativoNormalized,
    });

    // recarrega para devolver o estado atualizado
    await banner.reload();

    return banner;
  },

  // deletar
  async delete(id) {
    const banner = await BannerIndex.findByPk(id);
    if (!banner) {
      throw new Error("Banner não encontrado");
    }
    await banner.destroy();
  },

  // helper: normalizar ativo (0/1)
  normalizeAtivo(value) {
    if (typeof value === "boolean") return value ? 1 : 0;
    if (typeof value === "number") return value === 1 ? 1 : 0;
    if (typeof value === "string") {
      return value === "1" || value.toLowerCase() === "true" ? 1 : 0;
    }
    return 0;
  },
};

export default BannerService;
