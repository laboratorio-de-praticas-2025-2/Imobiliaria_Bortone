// Autenticação, autorização, tratamento de erros, logs

export function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: "Algo deu errado no servidor." });
}