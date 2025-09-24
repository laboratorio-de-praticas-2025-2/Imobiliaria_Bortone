import userService from "../services/userServices.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWTSecret = process.env.JWT_SECRET;

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

const getUsers = async (req, res) => {
  try {
    const users = await userService.getAll();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getById(id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, nivel, celular } = req.body;

    if (nivel && nivel !== 0 && nivel !== 1) {
      return res.status(400).json({ error: "O nível deve ser 0 ou 1." });
    }

    if (email) {
      const existingUser = await userService.getOne(email);

      if (existingUser && existingUser.id !== Number(id)) {
        return res.status(400).json({ error: "Email já está em uso." });
      }
    }

    let hashedPassword = senha ? await bcrypt.hash(senha, 10) : undefined;

    const updatedRows = await userService.update(id, {
      nome,
      email,
      senha: hashedPassword,
      nivel,
      celular,
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRows = await userService.delete(id);

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.sendStatus(204);
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

export default { createUser, getUsers, getUserById, updateUser, deleteUser, loginUser };
