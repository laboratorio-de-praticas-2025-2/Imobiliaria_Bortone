import "dotenv/config";
const url =
  process.env.NEXT_PUBLIC_API_URL || "https://imobiliaria-bortone.onrender.com";

// Pega os dados de um relatório específico
export async function getRelatorioData(secoes = [], data_inicio = null, data_fim = null) {

  const params = new URLSearchParams();
  if (data_inicio && data_fim) {
    params.append("data_inicio", data_inicio);
    params.append("data_fim", data_fim);
  }

   if (secoes && Array.isArray(secoes) && secoes.length > 0) {
    params.append('secoes', secoes.join(','));
  } else if (typeof secoes === 'string' && secoes) {    
    params.append('secoes', secoes);
  }  

  const fullUrl = `${url}/relatorios?${params.toString()}`;

  const res = await fetch(fullUrl, {
    method: "GET",
    cache: "no-store",
  });


  if (!res.ok) {
    const errorText = await res.text();
    console.error("Erro na resposta:", errorText);
    throw new Error(
      `Erro ao buscar dados do relatório: ${res.status} ${res.statusText}`
    );
  }

  const jsonData = await res.json();
  return jsonData;
}

// Pega a lista de todos os relatórios
export async function getAllRelatorios() {

  const res = await fetch(`${url}/relatorios/listar`, {
    method: "GET",
    cache: "no-store",
  });


  if (!res.ok) {
    const errorText = await res.text();
    console.error("Erro na resposta (lista):", errorText);
    throw new Error(
      `Erro ao buscar lista de relatórios: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}
