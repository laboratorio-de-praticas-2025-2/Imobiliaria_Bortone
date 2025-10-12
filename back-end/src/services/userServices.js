import User from "../models/Usuario.js";

class UserService {
  async create({ nome, email, senha, nivel = 1, celular = null }) {
    try {
      const newUser = await User.create({ nome, email, senha, nivel, celular });
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  // Cadastro específico para CMS, sem valores predefinidos
  async createCmsUser({ nome, email, senha, nivel, celular }) {
    try {
      const newUser = await User.create({ nome, email, senha, nivel, celular });
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      const users = await User.findAll({ where: { ativo: 1 } });
      return users;
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
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
      throw error;
    }
  }

  async getOne(email) {
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
