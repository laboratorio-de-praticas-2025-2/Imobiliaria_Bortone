import "dotenv/config";

// Servico para buscar os dados do dashboard da API
export async function getDashboardData() {
    // URL padrão para desenvolvimento
    const url = process.env.NEXT_PUBLIC_API_URL || "https://imobiliaria-bortone.onrender.com";
    
    const res = await fetch(`${url}/dashboard`, {
      method: "GET",
      cache: "no-store", // evita cache para sempre buscar dados atualizados
    });
  
    if (!res.ok) throw new Error("Erro ao buscar dados");
    return res.json();
  }
  