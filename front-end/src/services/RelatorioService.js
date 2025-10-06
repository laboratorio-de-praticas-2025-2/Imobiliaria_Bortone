import "dotenv/config";
const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Pega os dados de um relatório específico
export async function getRelatorioData(tipo) {
  console.log("Buscando dados do relatório:", tipo, "URL:", url);
  
  const res = await fetch(`${url}/relatorios?tipo=${tipo}`, {
    method: "GET",
    cache: "no-store",
  });

  console.log("Resposta da API:", res.status, res.statusText);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Erro na resposta:", errorText);
    throw new Error(`Erro ao buscar dados do relatório: ${res.status} ${res.statusText}`);
  }
  
  const jsonData = await res.json();
  console.log("Dados recebidos:", jsonData);
  return jsonData;
}

// Pega a lista de todos os relatórios
export async function getAllRelatorios() {
  console.log("Buscando lista de relatórios, URL:", url);
  
  const res = await fetch(`${url}/relatorios/s`, {
    method: "GET",
    cache: "no-store",
  });

  console.log("Resposta da API (lista):", res.status, res.statusText);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Erro na resposta (lista):", errorText);
    throw new Error(`Erro ao buscar lista de relatórios: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}
