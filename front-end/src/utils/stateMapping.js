export const statesMap = {
    "Acre" : "AC",
    "Alagoas": "AL",
    "Amapá" : "AP",
    "Amazonas" : "AM",
    "Bahia": "BA",
    "Ceará": "CE",
    "Distrito Federal": "DF",
    "Espírito Santo": "ES",
    "Goiás": "GO",
    "Maranhão": "MA",
    "Mato Grosso": "MT",
    "Mato Grosso do Sul": "MS",
    "Minas Gerais": "MG",
    "Pará": "PA",
    "Paraíba": "PB",
    "Paraná": "PR",
    "Pernambuco": "PE",
    "Piauí": "PI",
    "Rio de Janeiro": "RJ",
    "Rio Grande do Norte": "RN",
    "Rio Grande do Sul": "RS",
    "Rondônia": "RO",
    "Roraima": "RR",
    "Santa Catarina": "SC",
    "São Paulo": "SP",
    "Sergipe": "SE",
    "Tocantins": "TO",
  };

// Mapa reverso: Sigla -> Nome completo
export const statesMapReverse = Object.fromEntries(
  Object.entries(statesMap).map(([nome, sigla]) => [sigla, nome])
);

// Função para obter nome completo do estado a partir da sigla
export const getStateName = (sigla) => {
  return statesMapReverse[sigla] || sigla;
};

// Função para obter sigla do estado a partir do nome completo
export const getStateAbbr = (nome) => {
  return statesMap[nome] || nome;
};