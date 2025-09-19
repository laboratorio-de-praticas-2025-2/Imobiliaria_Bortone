import "dotenv/config";
const url = process.env.NEXT_PUBLIC_API_URL
// Servico para buscar os dados do dashboard da API
export async function getDashboardData() {
    // Mudar a URL para a de produção quando necessário 
    const res = await fetch(`${url}/dashboard`, {
      method: "GET",
      cache: "no-store", // evita cache para sempre buscar dados atualizados
    });
  
    if (!res.ok) throw new Error("Erro ao buscar dados");
    return res.json();
  }
  