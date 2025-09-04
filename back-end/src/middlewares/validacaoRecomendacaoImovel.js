export const validateRecomendacaoImovel = (req, res, next) => {
  const { usuario_id, imovel_id, data_visita } = req.body;

    if (!usuario_id || !imovel_id || !data_visita) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    if (typeof usuario_id !== 'number' || typeof imovel_id !== 'number') {
        return res.status(400).json({ error: 'IDs devem ser números.' });
    }
  
  next();
};