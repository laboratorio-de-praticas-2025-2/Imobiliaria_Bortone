import { jest } from "@jest/globals";

jest.unstable_mockModule("../models/Blog.js", () => ({
  default: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
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
});
