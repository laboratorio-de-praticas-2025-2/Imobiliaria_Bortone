import Agendamento from "../models/Agendamento.js";
import Usuario from "../models/Usuario.js";
import Imovel from "../models/Imovel.js";
import Auth from "../middlewares/Auth.js";

// Contrato (inputs/outputs)
// - create(req): body { data_marcada, id_imovel, mensagem } (user from req.loggedUser)
// - list(req): query { page, limit } ou lista por usuário se /me
// - getById(req): params.id
// - update(req): params.id, body { concluido } (admin only for concluir)
// - delete(req): params.id (admin or owner)

export const create = async (req, res) => {
  try {
    const user = req.loggedUser;
    if (!user || !user.id) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const { data_marcada, id_imovel, mensagem } = req.body;

    if (!data_marcada) {
      return res.status(400).json({ error: "data_marcada é obrigatória." });
    }

    // opcional: checar se imovel existe
    if (id_imovel) {
      const imovel = await Imovel.findByPk(id_imovel);
      if (!imovel) return res.status(404).json({ error: "Imóvel não encontrado." });
    }

    const novo = await Agendamento.create({
      id_usuario: user.id,
      data_marcada: new Date(data_marcada),
      data_create: new Date(),
      id_imovel: id_imovel || null,
      mensagem: mensagem || null,
      concluido: 0,
    });

    return res.status(201).json(novo);
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const listForUser = async (req, res) => {
  try {
    const user = req.loggedUser;
    if (!user || !user.id) return res.status(401).json({ error: "Usuário não autenticado." });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await Agendamento.findAndCountAll({
      where: { id_usuario: user.id },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nome', 'email', 'celular'],
        },
      {
        model: Imovel,
        as: 'imovel',
        attributes: ['id', 'endereco', 'tipo', 'cidade', 'preco'],
        required: false,
      }
    ],
    order: [['data_marcada', 'ASC']],
      limit,
      offset,
    });


    return res.status(200).json({ data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
  } catch (error) {
    console.error("Erro ao listar agendamentos do usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const listAll = async (req, res) => {
  try {
    // Apenas admins (nivel 0)
    const user = req.loggedUser;
    if (!user || user.nivel !== 0) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const { count, rows } = await Agendamento.findAndCountAll({
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nome', 'email', 'celular'],
        },
        {
          model: Imovel,
          as: 'imovel',
          attributes: ['id', 'endereco', 'tipo', 'cidade', 'preco'],
          required: false, // LEFT JOIN para incluir agendamentos sem imóvel
        }
      ],
      order: [["data_create", "DESC"]],
      limit,
      offset,
    });


    return res.status(200).json({ data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const ag = await Agendamento.findByPk(id);
    if (!ag) return res.status(404).json({ error: "Agendamento não encontrado." });

    // se não admin, garantir que seja dono
    const user = req.loggedUser;
    if (user.nivel !== 0 && Number(ag.id_usuario) !== Number(user.id)) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    return res.status(200).json(ag);
  } catch (error) {
    console.error("Erro ao buscar agendamento:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { concluido, data_marcada, mensagem } = req.body;
    const ag = await Agendamento.findByPk(id);
    if (!ag) return res.status(404).json({ error: "Agendamento não encontrado." });

    const user = req.loggedUser;
    // Somente admin pode alterar o campo concluido
    if (concluido !== undefined) {
      if (user.nivel !== 0) return res.status(403).json({ error: "Somente administradores podem marcar como concluído." });
      ag.concluido = concluido ? 1 : 0;
    }

    // Dono pode atualizar mensagem e data_marcada antes da conclusão
    if (Number(ag.id_usuario) !== Number(user.id) && user.nivel !== 0) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    if (mensagem !== undefined) ag.mensagem = mensagem;
    if (data_marcada !== undefined) ag.data_marcada = new Date(data_marcada);

    await ag.save();
    return res.status(200).json(ag);
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const ag = await Agendamento.findByPk(id);
    if (!ag) return res.status(404).json({ error: "Agendamento não encontrado." });

    const user = req.loggedUser;
    if (Number(ag.id_usuario) !== Number(user.id) && user.nivel !== 0) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    await Agendamento.destroy({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};
