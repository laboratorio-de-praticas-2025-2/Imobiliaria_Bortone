import "dotenv/config";
const url = process.env.NEXT_PUBLIC_API_URL;

// Pega os dados de um relatório específico
export async function getRelatorioData(tipo) {
  const res = await fetch(`${url}/relatorio?tipo=${tipo}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Erro ao buscar dados do relatório");
  return res.json();
}

// Pega a lista de todos os relatórios
export async function getAllRelatorios() {
  const res = await fetch(`${url}/relatorios`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Erro ao buscar lista de relatórios");
  return res.json();
}
