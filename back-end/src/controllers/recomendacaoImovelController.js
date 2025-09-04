import connection from '../config/sequelize-config.js';

export const createRecomendacaoImovel = async (req, res) => {
  const { usuario_id, imovel_id, data_visita } = req.body;

  try {
    const result = await connection.query(
      'INSERT INTO recomendacao_imovel (usuario_id, imovel_id, data_visita) VALUES (?, ?, ?)',
      { bind: [usuario_id, imovel_id, data_visita] }
    );
    res.status(201).json('Novo registro na tabela recomendacao_imovel.'); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

