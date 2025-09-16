/**
 * Middleware de tratamento de erros para funcionalidades de mapa
 */
const validacaoMapa = (err, req, res, next) => {
  console.error('Erro na aplicação:', err);

  // Erro de validação do Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Erro de conexão com banco
  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      success: false,
      message: 'Erro de conexão com o banco de dados'
    });
  }

  // Erro de timeout
  if (err.name === 'SequelizeTimeoutError') {
    return res.status(408).json({
      success: false,
      message: 'Timeout na operação'
    });
  }

  // Erro genérico
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default validacaoMapa;
