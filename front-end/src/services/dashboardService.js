// Servico para buscar os dados do dashboard da API
export async function getDashboardData(dataInicio = null, dataFim = null) {
    // URL padrão para desenvolvimento
    // No Next.js, process.env.NEXT_PUBLIC_* é substituído em build time
    const url = process.env.NEXT_PUBLIC_API_URL || "https://imobiliaria-bortone.onrender.com";
    
    try {
      // Constrói a URL com os parâmetros de data, se fornecidos
      let endpoint = `${url}/dashboard`;
      const params = new URLSearchParams();
      
      // Adiciona parâmetros apenas se forem válidos (não nulos, não vazios)
      if (dataInicio && dataInicio.trim() !== '') {
        params.append('data_inicio', dataInicio);
      }
      if (dataFim && dataFim.trim() !== '') {
        params.append('data_fim', dataFim);
      }
      
      // Adiciona query string apenas se houver parâmetros
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
      
      const res = await fetch(endpoint, {
        method: "GET",
        cache: "no-store", // evita cache para sempre buscar dados atualizados
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Erro ao buscar dados do dashboard: ${res.status}`, errorText);
        throw new Error(`Erro ao buscar dados: ${res.status}`);
      }
      
      return res.json();
    } catch (error) {
      console.error("Erro na requisição do dashboard:", error);
      throw error;
    }
  }
  