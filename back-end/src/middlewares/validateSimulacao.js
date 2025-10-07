module.exports = function validateSimulacao(req, res, next) {
  const { tipo, valorImovel, entrada, parcelas, modalidade } = req.body;

  function isValidNumber(value) {
    return (
      typeof value === 'number' &&
      value !== null &&
      !isNaN(value) &&
      isFinite(value)
    );
  }

  if (!tipo || typeof tipo !== 'string') {
    return res.status(400).json({ erro: 'O campo "Tipo" é obrigatório e deve ser string.' });
  }
  if (!modalidade || typeof modalidade !== 'string') {
    return res.status(400).json({ erro: 'O campo "Modalidade" é obrigatório e deve ser string.' });
  }
  if (!isValidNumber(valorImovel)) {
    return res.status(400).json({ erro: 'O campo "Valor do imóvel" é obrigatório e deve ser um número válido.' });
  }
  if (!isValidNumber(entrada)) {
    return res.status(400).json({ erro: 'O campo "Entrada" é obrigatório e deve ser um número válido.' });
  }
  if (!isValidNumber(parcelas)) {
    return res.status(400).json({ erro: 'O campo "Parcelas" é obrigatório e deve ser um número válido.' });
  }

  next();
};
