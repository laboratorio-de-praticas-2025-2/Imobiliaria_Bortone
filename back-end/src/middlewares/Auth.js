import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "bortonesecret";

const Authorization = (req, res, next) => {
  const authToken = req.headers["authorization"];
  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    const token = bearer[1];
    jwt.verify(token, JWT_SECRET, (error, data) => {
      if (error) {
        res.status(401).json({ error: "Token inválido. Não autorizado." });
      } else {
        const data = jwt.verify(token, JWT_SECRET);
console.log('🔍 [AUTH] Dados do usuário logado:', data);
console.log('🔍 [AUTH] ID do usuário:', data.id);
console.log('🔍 [AUTH] Tipo do ID:', typeof data.id);
        req.token = token;
        req.loggedUser = {
          id: data.id,
          email: data.email,
        };
        next();
      }
    });
  } else {
    res.status(401).json({ error: "Token inválido." });
  }
};
export default { Authorization };