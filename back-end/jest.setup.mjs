import { jest } from "@jest/globals";

jest.unstable_mockModule("./src/services/publicidadeService.js", () => ({
    default: {
    getAllPublicidades: jest.fn(),
    getPublicidadeById: jest.fn(),
    createPublicidade: jest.fn(),
    updatePublicidade: jest.fn(),
    deletePublicidade: jest.fn(),
},
}));
