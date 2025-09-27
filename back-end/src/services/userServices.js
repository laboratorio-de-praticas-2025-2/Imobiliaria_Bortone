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

  async getAll() {
    try {
      const users = await User.findAll({ where: { ativo: 1 } });
      return users;
    } catch (error) {
      console.log("Erro ao buscar usuários:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      console.log(`Erro ao buscar usuário com ID ${id}:`, error);
      throw error;
    }
  }

  async update(id, { nome, email, senha, nivel, celular }) {
    try {
      const [updatedRows] = await User.update(
        { nome, email, senha, nivel, celular },
        { where: { id } }
      );
      return updatedRows;
    } catch (error) {
      console.log(`Erro ao atualizar usuário com ID ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const [deletedRows] = await User.update(
        { ativo: 0 },
        { where: { id } }
      );

      return deletedRows;
    } catch (error) {
      console.log(`Erro ao desativar usuário com ID ${id}:`, error);
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
