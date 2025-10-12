import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";

describe("Testando rotas de Publicidade com service mockado", () => {
  let app;
  let publicidadeServiceMock;

  beforeAll(async () => {
    // Garante que o cache de módulos seja limpo antes de aplicar o mock
    jest.resetModules();

    // Cria o mock do service diretamente no teste
    jest.unstable_mockModule("../services/publicidadeService.js", () => ({
      default: {
        getAllPublicidades: jest.fn(),
        getPublicidadeById: jest.fn(),
        createPublicidade: jest.fn(),
        updatePublicidade: jest.fn(),
        deletePublicidade: jest.fn(),
      },
    }));

    // Importa o service já mockado
    const svc = await import("../services/publicidadeService.js");
    publicidadeServiceMock = svc.default;

    // Importa as rotas reais
    const { default: publicidadeRoutes } = await import("../routes/publicidadeRoutes.js");

    // Configura o app Express para os testes
    app = express();
    app.use(express.json());
    app.use("/api", publicidadeRoutes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/publicidade deve retornar lista de publicidades", async () => {
    const mockData = [{ id: 1, titulo: "Promoção imperdível" }];
    publicidadeServiceMock.getAllPublicidades.mockResolvedValue(mockData);

    const res = await request(app).get("/api/publicidade");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
    expect(publicidadeServiceMock.getAllPublicidades).toHaveBeenCalled();
  });

  it("GET /api/publicidade/:id deve retornar uma publicidade", async () => {
    const mockPub = { id: 1, titulo: "Promoção imperdível" };
    publicidadeServiceMock.getPublicidadeById.mockResolvedValue(mockPub);

    const res = await request(app).get("/api/publicidade/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockPub);
    expect(publicidadeServiceMock.getPublicidadeById).toHaveBeenCalledWith(1);
  });

  it("POST /api/publicidade deve criar uma publicidade", async () => {
    const payload = {
      titulo: "Nova publicidade",
      conteudo: "Descontos incríveis",
      url_imagem: "https://exemplo.com/img.jpg",
      usuario_id: 2,
      ativo: true,
    };
    const created = { id: 1, ...payload };

    publicidadeServiceMock.createPublicidade.mockResolvedValue(created);

    const res = await request(app).post("/api/publicidade").send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(created);
    expect(publicidadeServiceMock.createPublicidade).toHaveBeenCalledWith(payload);
  });

  it("PUT /api/publicidade/:id deve atualizar uma publicidade", async () => {
    const id = 1;
    const updateData = { titulo: "Atualizada", ativo: false };
    const updated = { id, ...updateData };

    publicidadeServiceMock.getPublicidadeById.mockResolvedValue(updated);
    publicidadeServiceMock.updatePublicidade.mockResolvedValue(updated);

    const res = await request(app).put(`/api/publicidade/${id}`).send(updateData);

    expect(res.status).toBe(200);
    expect(res.body.publicidade).toEqual(updated);
    expect(publicidadeServiceMock.updatePublicidade).toHaveBeenCalledWith(id, updateData);
  });

  it("DELETE /api/publicidade/:id deve excluir uma publicidade", async () => {
    const id = 1;

    publicidadeServiceMock.getPublicidadeById.mockResolvedValue({ id });
    publicidadeServiceMock.deletePublicidade.mockResolvedValue(true);

    const res = await request(app).delete(`/api/publicidade/${id}`);

    expect(res.status).toBe(204);
    expect(publicidadeServiceMock.deletePublicidade).toHaveBeenCalledWith(id);
  });
});
