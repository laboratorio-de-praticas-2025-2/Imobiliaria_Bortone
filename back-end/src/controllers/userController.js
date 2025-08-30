import userService from "../services/userServices.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWTSecret = "bortonesecret";

const createUser = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    await userService.create({
      nome,
      email,
      senha: hashedPassword,
    });

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    const user = await userService.getOne(email);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, nivel: user.nivel },
      JWTSecret,
      { expiresIn: "48h" }
    );

    return res.status(200).json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        nivel: user.nivel,
        celular: user.celular,
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export default { createUser, loginUser, JWTSecret };
