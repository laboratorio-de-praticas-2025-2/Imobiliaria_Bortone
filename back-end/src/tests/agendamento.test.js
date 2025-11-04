import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";

describe("Testando as rotas de Agendamento", () => {
  let app;
  let agendamentoCrudMock;
  let agendamentoControllerMock;
  let authMiddlewareMock;

  beforeAll(async () => {
    jest.resetModules();

    // Mock do middleware de autenticação
    authMiddlewareMock = {
      Authorization: jest.fn((req, res, next) => {
        // Simula um usuário autenticado com nivel 0 (admin)
        req.loggedUser = {
          id: 1,
          nome: "Admin Test",
          email: "admin@test.com",
          nivel: 0,
        };
        next();
      }),
    };

    // Mock do CRUD de agendamentos
    jest.unstable_mockModule("../controllers/agendamentoCrudController.js", () => ({
      create: jest.fn(),
      listForUser: jest.fn(),
      listAll: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    }));

    // Mock do controller de agendamento (emails)
    jest.unstable_mockModule("../controllers/agendamentoController.js", () => ({
      sendEmail: jest.fn(),
      sendScheduleConfirmation: jest.fn(),
      sendPropertyNotification: jest.fn(),
    }));

    // Mock do Auth middleware
    jest.unstable_mockModule("../middlewares/Auth.js", () => ({
      default: authMiddlewareMock,
    }));

    const agendamentoCrudModule = await import("../controllers/agendamentoCrudController.js");
    agendamentoCrudMock = agendamentoCrudModule;

    const agendamentoControllerModule = await import("../controllers/agendamentoController.js");
    agendamentoControllerMock = agendamentoControllerModule;

    const { default: agendamentoRoutes } = await import("../routes/agendamentoRoute.js");

    app = express();
    app.use(express.json());
    app.use("/agendamentos", agendamentoRoutes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("CRUD de Agendamentos", () => {
    it("POST /agendamentos/ deve criar um novo agendamento", async () => {
      const mockAgendamento = {
        id: 1,
        id_usuario: 1,
        data_marcada: "2025-10-25T10:00:00.000Z",
        id_imovel: 5,
        mensagem: "Gostaria de visitar o imóvel",
        concluido: 0,
      };

      agendamentoCrudMock.create.mockImplementation((req, res) => {
        res.status(201).json(mockAgendamento);
      });

      const res = await request(app)
        .post("/agendamentos/")
        .send({
          data_marcada: "2025-10-25T10:00:00.000Z",
          id_imovel: 5,
          mensagem: "Gostaria de visitar o imóvel",
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockAgendamento);
      expect(agendamentoCrudMock.create).toHaveBeenCalled();
    });

    it("GET /agendamentos/me deve listar agendamentos do usuário autenticado", async () => {
      const mockAgendamentos = {
        data: [
          {
            id: 1,
            id_usuario: 1,
            data_marcada: "2025-10-25T10:00:00.000Z",
            concluido: 0,
          },
          {
            id: 2,
            id_usuario: 1,
            data_marcada: "2025-10-26T14:00:00.000Z",
            concluido: 0,
          },
        ],
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
      };

      agendamentoCrudMock.listForUser.mockImplementation((req, res) => {
        res.status(200).json(mockAgendamentos);
      });

      const res = await request(app).get("/agendamentos/me");

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.total).toBe(2);
      expect(agendamentoCrudMock.listForUser).toHaveBeenCalled();
    });

    it("GET /agendamentos/ deve listar todos os agendamentos (admin)", async () => {
      const mockAllAgendamentos = {
        data: [
          { id: 1, id_usuario: 1, data_marcada: "2025-10-25T10:00:00.000Z" },
          { id: 2, id_usuario: 2, data_marcada: "2025-10-26T14:00:00.000Z" },
          { id: 3, id_usuario: 3, data_marcada: "2025-10-27T09:00:00.000Z" },
        ],
        total: 3,
        page: 1,
        limit: 50,
        totalPages: 1,
      };

      agendamentoCrudMock.listAll.mockImplementation((req, res) => {
        res.status(200).json(mockAllAgendamentos);
      });

      const res = await request(app).get("/agendamentos/");

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(3);
      expect(res.body.total).toBe(3);
      expect(agendamentoCrudMock.listAll).toHaveBeenCalled();
    });

    it("GET /agendamentos/:id deve retornar um agendamento específico", async () => {
      const mockAgendamento = {
        id: 1,
        id_usuario: 1,
        data_marcada: "2025-10-25T10:00:00.000Z",
        id_imovel: 5,
        mensagem: "Visita ao imóvel",
        concluido: 0,
      };

      agendamentoCrudMock.getById.mockImplementation((req, res) => {
        res.status(200).json(mockAgendamento);
      });

      const res = await request(app).get("/agendamentos/1");

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
      expect(agendamentoCrudMock.getById).toHaveBeenCalled();
    });

    it("PATCH /agendamentos/:id deve atualizar um agendamento", async () => {
      const mockUpdated = {
        id: 1,
        id_usuario: 1,
        data_marcada: "2025-10-25T10:00:00.000Z",
        concluido: 1,
      };

      agendamentoCrudMock.update.mockImplementation((req, res) => {
        res.status(200).json(mockUpdated);
      });

      const res = await request(app)
        .patch("/agendamentos/1")
        .send({ concluido: 1 });

      expect(res.status).toBe(200);
      expect(res.body.concluido).toBe(1);
      expect(agendamentoCrudMock.update).toHaveBeenCalled();
    });

    it("DELETE /agendamentos/:id deve remover um agendamento", async () => {
      agendamentoCrudMock.remove.mockImplementation((req, res) => {
        res.status(200).json({ message: "Agendamento removido com sucesso" });
      });

      const res = await request(app).delete("/agendamentos/1");

      expect(res.status).toBe(200);
      expect(res.body.message).toContain("removido");
      expect(agendamentoCrudMock.remove).toHaveBeenCalled();
    });
  });

  describe("Rotas de Confirmação e Notificação", () => {
    it("POST /agendamentos/schedule deve enviar confirmação de agendamento", async () => {
      agendamentoControllerMock.sendScheduleConfirmation.mockImplementation(
        (req, res) => {
          res.status(200).json({
            success: true,
            message: "Confirmação de agendamento enviada",
          });
        }
      );

      const res = await request(app)
        .post("/agendamentos/schedule")
        .send({
          appointment: {
            name: "João Silva",
            email: "joao@test.com",
            phone: "(11) 98765-4321",
            visitPeriod: "Manhã - 09:00-12:00",
            propertyId: 5,
            propertyAddress: "Rua Teste, 123",
            notes: "Prefiro visitar pela manhã",
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(agendamentoControllerMock.sendScheduleConfirmation).toHaveBeenCalled();
    });

    it("POST /agendamentos/agendar deve enviar confirmação de agendamento (rota alternativa)", async () => {
      agendamentoControllerMock.sendScheduleConfirmation.mockImplementation(
        (req, res) => {
          res.status(200).json({
            success: true,
            message: "Agendamento realizado",
          });
        }
      );

      const res = await request(app)
        .post("/agendamentos/agendar")
        .send({
          appointment: {
            name: "Maria Santos",
            email: "maria@test.com",
            visitPeriod: "Tarde - 14:00-17:00",
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(agendamentoControllerMock.sendScheduleConfirmation).toHaveBeenCalled();
    });

    it("POST /agendamentos/property-notification deve enviar notificação de imóvel", async () => {
      agendamentoControllerMock.sendPropertyNotification.mockImplementation(
        (req, res) => {
          res.status(200).json({
            success: true,
            message: "Notificação enviada",
          });
        }
      );

      const res = await request(app)
        .post("/agendamentos/property-notification")
        .send({
          property: {
            id: 10,
            address: "Av. Principal, 456",
            price: "R$ 500.000",
          },
          userEmail: "interessado@test.com",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(agendamentoControllerMock.sendPropertyNotification).toHaveBeenCalled();
    });
  });

  describe("Validações e Erros", () => {
    it("POST /agendamentos/ deve retornar erro 400 sem data_marcada", async () => {
      agendamentoCrudMock.create.mockImplementation((req, res) => {
        res.status(400).json({ error: "data_marcada é obrigatória." });
      });

      const res = await request(app)
        .post("/agendamentos/")
        .send({
          id_imovel: 5,
          mensagem: "Teste sem data",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("data_marcada");
    });

    it("GET /agendamentos/me deve funcionar com paginação", async () => {
      const mockPaginatedResult = {
        data: [{ id: 1 }],
        total: 15,
        page: 2,
        limit: 10,
        totalPages: 2,
      };

      agendamentoCrudMock.listForUser.mockImplementation((req, res) => {
        res.status(200).json(mockPaginatedResult);
      });

      const res = await request(app).get("/agendamentos/me?page=2&limit=10");

      expect(res.status).toBe(200);
      expect(res.body.page).toBe(2);
      expect(res.body.limit).toBe(10);
      expect(res.body.totalPages).toBe(2);
    });
  });
});
