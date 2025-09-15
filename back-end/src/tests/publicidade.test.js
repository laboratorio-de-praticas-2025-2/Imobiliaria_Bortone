import request from "supertest";
import app from "../app.js";
import Publicidade from "../models/publicidade.js";

// Mock do Sequelize
jest.mock("../models/publicidade.js");

describe("Testes das rotas de Publicidade", () => {
const mockPublicidade = {
    id: 1,
    titulo: "Promoção imperdível",
    conteudo: "Descontos em imóveis até 30%",
    url_imagem: "https://exemplo.com/imagem.jpg",
    usuario_id: 2,
};

    beforeEach(() => {
    jest.clearAllMocks();
});

    test("GET /publicidade - deve retornar todas as publicidades", async () => {
    Publicidade.findAll.mockResolvedValue([mockPublicidade]);

    const res = await request(app).get("/api/publicidade");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([mockPublicidade]);
});

    test("GET /publicidade/:id - deve retornar uma publicidade por ID", async () => {
    Publicidade.findByPk.mockResolvedValue(mockPublicidade);

    const res = await request(app).get("/api/publicidade/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockPublicidade);
});

    test("POST /publicidade - deve criar uma nova publicidade", async () => {
    Publicidade.create.mockResolvedValue(mockPublicidade);

    const res = await request(app).post("/api/publicidade").send(mockPublicidade);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(mockPublicidade);
});

    test("PUT /publicidade/:id - deve atualizar uma publicidade existente", async () => {
    Publicidade.findByPk.mockResolvedValue({
    ...mockPublicidade,
    update: jest.fn().mockResolvedValue(mockPublicidade),
    });

    const res = await request(app).put("/api/publicidade/1").send(mockPublicidade);

    expect(res.statusCode).toBe(200);
    expect(res.body.publicidade).toEqual(mockPublicidade);
});

    test("DELETE /publicidade/:id - deve excluir uma publicidade", async () => {
    Publicidade.findByPk.mockResolvedValue({
    ...mockPublicidade,
    destroy: jest.fn().mockResolvedValue(),
    });

    const res = await request(app).delete("/api/publicidade/1");

    expect(res.statusCode).toBe(204);
});
});
