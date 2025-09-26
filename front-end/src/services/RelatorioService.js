import "dotenv/config";
const url = process.env.NEXT_PUBLIC_API_URL;

export async function getRelatorioData(tipo) {
  const res = await fetch(`${url}/relatorio?tipo=${tipo}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Erro ao buscar dados do relatório");
  return res.json();
}
