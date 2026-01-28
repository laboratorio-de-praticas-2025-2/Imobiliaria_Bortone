import * as recomendacaoImovelService from '../services/recomendacaoImovelService.js';
import Imovel from '../models/Imovel.js';
import Casa from '../models/Casa.js';
import ImagemImovel from '../models/ImagemImovel.js';

export const createRecomendacaoImovel = async (req, res) => {
  const { usuario_id, imovel_id, data_visita } = req.body;

  try {
    const novaRecomendacao = await recomendacaoImovelService.createRecomendacao({
      usuario_id,
      imovel_id,
      data_visita
    });


    res.status(201).json({
      message: 'Novo registro na tabela recomendacao_imovel.',
      data: novaRecomendacao,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const getRecomendacoes = async (req, res) => {
  const { usuario_id, limit } = req.query; 

  try {
    let recomendacoes;

    if (usuario_id) {
      recomendacoes = await recomendacaoImovelService.getRecomendacoesByUserId(usuario_id);
    } else {
      // Últimos inseridos no banco
      recomendacoes = await Imovel.findAll({
        where: { status: 'disponivel' },
        order: [['id', 'DESC']],
        limit: limit ? parseInt(limit) : 20,
        include: [
          {
            model: Casa,
            as: 'casa',
            attributes: ['quartos', 'banheiros', 'vagas', 'possui_piscina', 'possui_jardim'],
            required: false,
          },
          {
            model: ImagemImovel,
            as: 'imagem_imovel',
            attributes: ['id', 'url_imagem'],
            required: false,
          },
        ],
      });
    }

    res.status(200).json({
      message: 'Recomendações geradas com sucesso.',
      data: recomendacoes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar recomendações: ' + err.message });
  }
};
