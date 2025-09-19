import User from "../models/Usuario.js";

class UserService {
 async create({ nome, email, senha, nivel = 1, celular = null }) {
    try {
      const newUser = await User.create({ nome, email, senha, nivel, celular });
      return newUser;
    } catch (error) {
      console.log("Erro ao criar usuário:", error);
      throw error;
    }
  }

  async getOne(email) {
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (error) {
      console.log("Erro ao buscar usuário:", error);
      throw error;
    }
  }
}

export default new UserService();
