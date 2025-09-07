const telefone = require("../utils/telefone.json");

describe("telefone.json", () => {
  it("deve conter a propriedade 'telefone' em formato (xx) xxxxx-xxxx", () => {
    expect(telefone).toHaveProperty("telefone");
    expect(telefone.telefone).toMatch(/^\(\d{2}\)\s?\d{5}-\d{4}$/);
  });
});