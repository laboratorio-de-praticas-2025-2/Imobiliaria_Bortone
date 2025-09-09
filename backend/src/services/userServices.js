// Serviço de usuários em memória (sem banco de dados)
class UserService {
  constructor() {
    this.usersByEmail = new Map();
    this.autoIncrementId = 1;
  }

  async create({ nome, email, senha, nivel = 1, celular = null }) {
    if (this.usersByEmail.has(email)) {
      const err = new Error("E-mail já cadastrado");
      err.code = "EMAIL_EXISTS";
      throw err;
    }

    const user = {
      id: this.autoIncrementId++,
      nome,
      email,
      senha, // já deve vir hash se o controller fizer o hash
      nivel,
      celular,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.usersByEmail.set(email, user);
    return user;
  }

  async getOne(email) {
    return this.usersByEmail.get(email) || null;
  }
}

export default new UserService();
