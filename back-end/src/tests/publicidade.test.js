import request from "supertest";
import app from "../app.js";
import * as publicidadeController from "../controllers/publicidadeController.js";

// Mocka todas as funções exportadas do controller
jest.mock("../controllers/publicidadeController.js");

describe("Testes das rotas de Publicidade", () => {
  const mockPublicidade = {
    id: 1,
    titulo: "Promoção imperdível",
    conteudo: "Descontos em imóveis até 30%",
    url_imagem: "https://exemplo.com/imagem.jpg",
    usuario_id: 2,
    ativo: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /publicidade - deve retornar todas as publicidades", async () => {
    publicidadeController.getAllPublicidades.mockImplementation((req, res) => {
      res.status(200).json([mockPublicidade]);
    });

    const res = await request(app).get("/api/publicidade");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([mockPublicidade]);
  });

  test("GET /publicidade/:id - deve retornar uma publicidade por ID", async () => {
    publicidadeController.getPublicidadeById.mockImplementation((req, res) => {
      res.status(200).json(mockPublicidade);
    });

    const res = await request(app).get("/api/publicidade/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockPublicidade);
  });

  test("POST /publicidade - deve criar uma nova publicidade", async () => {
    publicidadeController.createPublicidade.mockImplementation((req, res) => {
      res.status(201).json(mockPublicidade);
    });

    const res = await request(app)
      .post("/api/publicidade")
      .send(mockPublicidade);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(mockPublicidade);
  });

  test("PUT /publicidade/:id - deve atualizar uma publicidade existente", async () => {
    publicidadeController.updatePublicidade.mockImplementation((req, res) => {
      res
        .status(200)
        .json({
          message: "Publicidade atualizada com sucesso",
          publicidade: mockPublicidade,
        });
    });

    const res = await request(app)
      .put("/api/publicidade/1")
      .send(mockPublicidade);

    expect(res.statusCode).toBe(200);
    expect(res.body.publicidade).toEqual(mockPublicidade);
  });

  test("DELETE /publicidade/:id - deve excluir uma publicidade", async () => {
    publicidadeController.deletePublicidade.mockImplementation((req, res) => {
      res.status(204).send();
    });

    const res = await request(app).delete("/api/publicidade/1");

    expect(res.statusCode).toBe(204);
  });
});
