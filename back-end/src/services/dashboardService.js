import {
  obterDadosAnaliseEstoque,
  obterSumarioExecutivo,
  obterDadosJornadaCliente,
  obterDadosDesempenhoVendas,
  obterDadosDesempenhoLocacoes,
} from "../repositories/dadosRepository.js";

class DashboardService {
  async dashboardData(data_inicio, data_fim) {
    try {
      const [sumario, estoque, clientes, vendas, locacoes] = await Promise.all([
        obterSumarioExecutivo(data_inicio, data_fim),
        obterDadosAnaliseEstoque(),
        obterDadosJornadaCliente(data_inicio, data_fim),
        obterDadosDesempenhoVendas(data_inicio, data_fim),
        obterDadosDesempenhoLocacoes(data_inicio, data_fim),
      ]);

      const processedData = {
        sumarioExecutivo: {
          totalVendas: Number(sumario.totalVendas || 0),
          valorGeralVendas: Number(sumario.valorGeralVendas || 0),
          totalAgendamentosCriados: Number(
            sumario.totalAgendamentosCriados || 0
          ),
          totalAgendamentosCriadosPorNovosUsuarios: Number(
            sumario.totalAgendamentosCriadosPorNovosUsuarios || 0
          ),
        },
        estoqueImobiliario: {
          estatisticas: {
            totalImoveis: estoque.estatisticas?.[0]?.total_imoveis || 0,
            disponiveis:
              estoque.estatisticas?.[0]?.total_imoveis_disponiveis || 0,
            locados: estoque.estatisticas?.[0]?.total_imoveis_locados || 0,
            vendidos: estoque.estatisticas?.[0]?.total_imoveis_vendidos || 0,
            precoVisivel: estoque.estatisticas?.[0]?.total_preco_visivel || 0,
            precoOculto: estoque.estatisticas?.[0]?.total_preco_oculto || 0,
          },

          distribuicaoPorTipo: estoque.distribuicaoPorTipo || [],

          distribuicaoPorPreco: estoque.distribuicaoPorPreco || [],
        },

        estatisticasUsuarios: {
          novosUsuarios: Number(clientes.novosUsuarios || 0),
          agendamentosNovosUsuarios: Number(
            clientes.agendamentosNovosUsuarios || 0
          ),
          agendamentosAntigoUsuarios: Number(
            clientes.agendamentosAntigoUsuarios || 0
          ),
          taxaConversao: Number(clientes.taxaConversao || 0),
          evolucaoMensal: clientes.evolucaoMensalAgendamentoEUsuario || [],
        },

        desempenhoVendas: {
          total: Number(vendas.totalVendas || 0),
          distribuicaoPorTipo: vendas.distribuicaoTipo || [],
          evolucaoMensal: vendas.evolucaoMensal || [],
        },
        desempenhoAlugueis: {
          total: Number(locacoes.totalLocacoes || 0),
          distribuicaoPorTipo: locacoes.distribuicaoTipo || 0,
          evolucaoMensal: locacoes.evolucaoMensal || 0,
        },
      };

      return processedData;
    } catch (error) {
      console.error("Erro crítico no dashboardData:", {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Erro na composição dos dados do dashboard");
    }
  }
}

export default new DashboardService();
