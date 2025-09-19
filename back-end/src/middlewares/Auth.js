import jwt from "jsonwebtoken";

const Authorization = (req, res, next) => {
  const authToken = req.headers["authorization"];
  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    const token = bearer[1];
    jwt.verify(token, process.env.JWT_SECRET, (error, data) => {
      if (error) {
        res.status(401).json({ error: "Token inválido. Não autorizado." });
      } else {
        req.token = token;
        req.loggedUser = {
          id: data.id,
          email: data.email,
          nivel: data.nivel
        };
        next();
      }
    });
  } else {
    res.status(401).json({ error: "Token inválido." });
  }
};
export default { Authorization };