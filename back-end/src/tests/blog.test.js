import { jest } from "@jest/globals";

jest.unstable_mockModule("../models/Blog.js", () => ({
  default: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
    getAll: jest.fn()
  },
}));

const blogServiceModule = await import("../services/blogService.js");
const blogService = blogServiceModule.default;

const BlogModule = await import("../models/Blog.js");
const Blog = BlogModule.default;

describe("Testes de CRUD para Artigos", () => {
  const mockArtigo = {
    id: 1,
    titulo: "Primeiro Artigo",
    conteudo: "Conteúdo de teste",
    data_publicacao: new Date(),
    url_imagem: "https://exemplo.com/imagem.png",
    usuario_id: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Deve criar um novo artigo com sucesso", async () => {
    const artigoParaCriar = { ...mockArtigo };
    delete artigoParaCriar.id;

    Blog.create.mockResolvedValue(mockArtigo);

    const result = await blogService.createArtigo(artigoParaCriar);

    expect(Blog.create).toHaveBeenCalledWith(artigoParaCriar);
    expect(result).toEqual(mockArtigo);
  });

  it("Deve buscar todos os artigos com sucesso", async () => {
    Blog.findAll.mockResolvedValue([mockArtigo]);

    const result = await blogService.getAllArtigos({});

    expect(Blog.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockArtigo]);
  });

  it("Deve buscar um artigo por ID existente", async () => {
    Blog.findByPk.mockResolvedValue(mockArtigo);

    const result = await blogService.getArtigoById(1);

    expect(Blog.findByPk).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockArtigo);
  });

  it("Deve lançar erro ao buscar artigo inexistente", async () => {
    Blog.findByPk.mockResolvedValue(null);

    await expect(blogService.getArtigoById(99)).rejects.toThrow(
      "Artigo com o ID: 99 não encontrado."
    );
  });

  it("Deve deletar um artigo com base em um ID", async () => {
    const mockDestroy = jest.fn();
    const artigoFalso = { destroy: mockDestroy };
    Blog.findByPk.mockResolvedValue(artigoFalso);
    const result = await blogService.deleteArtigo(99);
    expect(Blog.findByPk).toHaveBeenCalledWith(99);
    expect(mockDestroy).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it("Deve lançar erro ao tentar deletar um artigo inexistente", async () => {
    Blog.findByPk.mockResolvedValue(null);
    await expect(blogService.deleteArtigo(99)).rejects.toThrow(
      "Artigo com o ID: 99 não encontrado."
    );
    expect(Blog.findByPk).toHaveBeenCalledWith(99);
  });

  it("Deve atualizar um artigo existente com sucesso", async () => {
    const mockUpdate = jest.fn();
    const artigoFalso = {
      id: 99,
      titulo: "Original",
      update: mockUpdate.mockResolvedValue(),
    };
    Blog.findByPk.mockResolvedValue(artigoFalso);
    const dadosAtualizar = { titulo: "Atualizado" };
    const result = await blogService.updateArtigo(99, dadosAtualizar);
    expect(Blog.findByPk).toHaveBeenCalledWith(99);
    expect(mockUpdate).toHaveBeenCalledWith(dadosAtualizar);
    expect(result).toBe(artigoFalso);
  });

  it("Deve lançar erro ao tentar atualizar um artigo inexistente", async () => {
    Blog.findByPk.mockResolvedValue(null);
    const dadosAtualizar = { titulo: "Atualizado" };
    await expect(blogService.updateArtigo(99, dadosAtualizar)).rejects.toThrow(
      "Artigo com o ID: 99 não encontrado."
    );
    expect(Blog.findByPk).toHaveBeenCalledWith(99);
  });

  describe("Testes de ordenação para a busca", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve buscar todos os artigos com parâmetros", async () => {
    const artigosMock = [{ id: 1, titulo: "Artigo 1" }, { id: 2, titulo: "Artigo 2" }];
    Blog.findAll = jest.fn().mockResolvedValue(artigosMock);

    const result = await blogService.getAllArtigos();

    expect(Blog.findAll).toHaveBeenCalledWith({});
    expect(result).toEqual(artigosMock);
  });

  it("deve ordenar os artigos por id em ordem ASC (padrão) quando ordenarPor = 'data'", async () => {
    const artigosMock = [{ id: 1 }, { id: 2 }];
    Blog.findAll = jest.fn().mockResolvedValue(artigosMock);

    const params = { ordenarPor: "data" };
    const result = await blogService.getAllArtigos(params);

    expect(Blog.findAll).toHaveBeenCalledWith({ order: [["id", "ASC"]] });
    expect(result).toEqual(artigosMock);
  });

  it("deve ordenar os artigos por id em ordem DESC quando ordenarPor = 'data' e direcao = 'DESC'", async () => {
    const artigosMock = [{ id: 2 }, { id: 1 }];
    Blog.findAll = jest.fn().mockResolvedValue(artigosMock);

    const params = { ordenarPor: "data", direcao: "DESC" };
    const result = await blogService.getAllArtigos(params);

    expect(Blog.findAll).toHaveBeenCalledWith({ order: [["id", "DESC"]] });
    expect(result).toEqual(artigosMock);
  });

  it("deve ordenar os artigos por titulo em ordem ASC (padrão) quando ordenarPor = 'alfabetica'", async () => {
    const artigosMock = [{ titulo: "A" }, { titulo: "B" }];
    Blog.findAll = jest.fn().mockResolvedValue(artigosMock);

    const params = { ordenarPor: "alfabetica" };
    const result = await blogService.getAllArtigos(params);

    expect(Blog.findAll).toHaveBeenCalledWith({ order: [["titulo", "ASC"]] });
    expect(result).toEqual(artigosMock);
  });

  it("deve ordenar os artigos por titulo em ordem DESC quando ordenarPor = 'alfabetica' e direcao = 'DESC'", async () => {
    const artigosMock = [{ titulo: "B" }, { titulo: "A" }];
    Blog.findAll = jest.fn().mockResolvedValue(artigosMock);

    const params = { ordenarPor: "alfabetica", direcao: "DESC" };
    const result = await blogService.getAllArtigos(params);

    expect(Blog.findAll).toHaveBeenCalledWith({ order: [["titulo", "DESC"]] });
    expect(result).toEqual(artigosMock);
  });
});

});