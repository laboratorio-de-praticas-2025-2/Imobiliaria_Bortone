import "dotenv/config";
const url =
  process.env.NEXT_PUBLIC_API_URL || "https://imobiliaria-bortone.onrender.com";

// Pega os dados de um relatório específico
export async function getRelatorioData(secoes = [], data_inicio = null, data_fim = null) {
  console.log("Buscando dados do relatório: ", secoes, "URL:", url);

  const params = new URLSearchParams();
  if (data_inicio && data_fim) {
    params.append("data_inicio", data_inicio);
    params.append("data_fim", data_fim);
  }
  if (secoes && secoes.length > 0) params.append("secoes", secoes.join(","));

  const fullUrl = `${url}/relatorios?${params.toString()}`;

  const res = await fetch(fullUrl, {
    method: "GET",
    cache: "no-store",
  });

  console.log("Resposta da API:", res.status, res.statusText);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Erro na resposta:", errorText);
    throw new Error(
      `Erro ao buscar dados do relatório: ${res.status} ${res.statusText}`
    );
  }

  const jsonData = await res.json();
  console.log("Dados recebidos:", jsonData);
  return jsonData;
}

// Pega a lista de todos os relatórios
export async function getAllRelatorios() {
  console.log("Buscando lista de relatórios, URL:", url);

  const res = await fetch(`${url}/relatorios/listar`, {
    method: "GET",
    cache: "no-store",
  });

  console.log("Resposta da API (lista):", res.status, res.statusText);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Erro na resposta (lista):", errorText);
    throw new Error(
      `Erro ao buscar lista de relatórios: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}
