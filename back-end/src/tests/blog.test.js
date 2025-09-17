import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";

describe("Testando as rotas do blog", () => {
  let app;
  let blogServiceMock;

  beforeAll(async () => {
    jest.resetModules();

    jest.unstable_mockModule("../services/blogService.js", () => ({
      default: {
        createArtigo: jest.fn(),
        getAllArtigos: jest.fn(),
        getArtigoById: jest.fn(),
        updateArtigo: jest.fn(),
        deleteArtigo: jest.fn(),
      },
    }));

    const svc = await import("../services/blogService.js");
    blogServiceMock = svc.default;

    const { default: blogRoutes } = await import("../routes/blogRoutes.js");

    app = express();
    app.use(express.json());
    app.use(blogRoutes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("GET /blogs deve retornar lista de artigos", async () => {
    const mockArtigo = { id: 1, titulo: "Teste Artigo" };
    blogServiceMock.getAllArtigos.mockResolvedValue([mockArtigo]);

    const res = await request(app).get("/blogs");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("artigos");
    expect(res.body.artigos).toEqual([mockArtigo]);
    expect(blogServiceMock.getAllArtigos).toHaveBeenCalledWith({});
  });

  it("GET /blogs/:id deve retornar um artigo pelo ID", async () => {
    const mockArtigo = { id: 1, titulo: "Teste Artigo" };
    blogServiceMock.getArtigoById.mockResolvedValue(mockArtigo);

    const res = await request(app).get(`/blogs/${mockArtigo.id}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(mockArtigo);
    expect(blogServiceMock.getArtigoById).toHaveBeenCalledWith(1);
  });

  it("POST /blogs deve criar um novo artigo", async () => {
    const mockArtigo = { id: 1, titulo: "Novo Artigo" };
    blogServiceMock.createArtigo.mockResolvedValue(mockArtigo);

    const res = await request(app).post("/blogs").send({
      titulo: "Novo Artigo",
      conteudo: "conteúdo teste",
      usuario_id: "123",
    });

    expect(res.status).toBe(201);
    expect(res.body.data).toEqual(mockArtigo);
    expect(blogServiceMock.createArtigo).toHaveBeenCalled();
  });

  it("PUT /blogs/:id deve atualizar um artigo", async () => {
    const mockArtigo = { id: 1, titulo: "Atualizado" };
    blogServiceMock.updateArtigo.mockResolvedValue(mockArtigo);

    const res = await request(app).put("/blogs/1").send({ titulo: "Atualizado" });

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(mockArtigo);
    expect(blogServiceMock.updateArtigo).toHaveBeenCalledWith(1, { titulo: "Atualizado" });
  });

  it("DELETE /blogs/:id deve deletar um artigo", async () => {
    blogServiceMock.deleteArtigo.mockResolvedValue(true);

    const res = await request(app).delete("/blogs/1");

    expect(res.status).toBe(200);
    expect(res.body.data).toBe(true);
    expect(blogServiceMock.deleteArtigo).toHaveBeenCalledWith(1);
  });

  it("GET /blogs deve ordenar os artigos por id ASC quando ordenarPor = 'data'", async () => {
    const artigosMock = [{ id: 1 }, { id: 2 }];
    blogServiceMock.getAllArtigos.mockResolvedValue(artigosMock);

    const res = await request(app).get("/blogs?ordenarPor=data");

    expect(res.status).toBe(200);
    expect(res.body.artigos).toEqual(artigosMock);
    expect(blogServiceMock.getAllArtigos).toHaveBeenCalledWith({ ordenarPor: "data" });
  });

  it("GET /blogs deve ordenar os artigos por id DESC quando ordenarPor = 'data' e direcao = 'DESC'", async () => {
    const artigosMock = [{ id: 2 }, { id: 1 }];
    blogServiceMock.getAllArtigos.mockResolvedValue(artigosMock);

    const res = await request(app).get("/blogs?ordenarPor=data&direcao=DESC");

    expect(res.status).toBe(200);
    expect(res.body.artigos).toEqual(artigosMock);
    expect(blogServiceMock.getAllArtigos).toHaveBeenCalledWith({
      ordenarPor: "data",
      direcao: "DESC",
    });
  });

  it("GET /blogs deve ordenar os artigos por titulo ASC quando ordenarPor = 'alfabetica'", async () => {
    const artigosMock = [{ titulo: "A" }, { titulo: "B" }];
    blogServiceMock.getAllArtigos.mockResolvedValue(artigosMock);

    const res = await request(app).get("/blogs?ordenarPor=alfabetica");

    expect(res.status).toBe(200);
    expect(res.body.artigos).toEqual(artigosMock);
    expect(blogServiceMock.getAllArtigos).toHaveBeenCalledWith({ ordenarPor: "alfabetica" });
  });

  it("GET /blogs deve ordenar os artigos por titulo DESC quando ordenarPor = 'alfabetica' e direcao = 'DESC'", async () => {
    const artigosMock = [{ titulo: "B" }, { titulo: "A" }];
    blogServiceMock.getAllArtigos.mockResolvedValue(artigosMock);

    const res = await request(app).get("/blogs?ordenarPor=alfabetica&direcao=DESC");

    expect(res.status).toBe(200);
    expect(res.body.artigos).toEqual(artigosMock);
    expect(blogServiceMock.getAllArtigos).toHaveBeenCalledWith({
      ordenarPor: "alfabetica",
      direcao: "DESC",
    });
  });
});