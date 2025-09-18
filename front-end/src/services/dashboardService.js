// Servico para buscar os dados do dashboard da API
export async function getDashboardData() {
    // Mudar a URL para a de produção quando necessário 
    const res = await fetch("http://localhost:4000/dashboard", {
      method: "GET",
      cache: "no-store", // evita cache para sempre buscar dados atualizados
    });
  
    if (!res.ok) throw new Error("Erro ao buscar dados");
    return res.json();
  }
  