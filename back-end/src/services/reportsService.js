import { error } from "console";
import sequelize from "../config/sequelize-config.js";
import fs from "fs";
import { IMOVEIS_TIPOS, REPORTS_SECOES } from "../utils/constantes.js";
const tiposImoveis = Object.values(IMOVEIS_TIPOS);

class ReportService {
  async #executeQuery(query, errorMessage, replacements = {}) {
    try {
      return await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        logging: false,
        replacements: replacements,
      });
    } catch (dbError) {
      console.error(`${errorMessage}:`, {
        message: dbError.message,
        query: query.substring(0, 200) + "...",
        stack: dbError.stack,
      });
      throw new Error(errorMessage);
    }
  }
  async buscarDadosParaRelatorio(secoes, data_inicio, data_fim) {
    try {
      let dadosRelatorio = {};

      if (secoes.includes(REPORTS_SECOES.SUMARIO_EXECUTIVO)) {
        dadosRelatorio.sumarioExecutivo = await this.obterSumarioExecutivo(
          data_inicio,
          data_fim
        );
      }
      if (secoes.includes(REPORTS_SECOES.JORNADA_CLIENTE)) {
        dadosRelatorio.jornadaCliente = await this.obterDadosJornadaCliente(
          data_inicio,
          data_fim
        );
      }
      if (secoes.includes(REPORTS_SECOES.ANALISE_ESTOQUE)) {
        dadosRelatorio.analiseEstoque = await this.obterDadosAnaliseEstoque();
      }
      if (secoes.includes(REPORTS_SECOES.DESEMPENHO_VENDAS)) {
        dadosRelatorio.desempenhoVendas = await this.obterDadosDesempenhoVendas(
          data_inicio,
          data_fim
        );
      }
      if (secoes.includes(REPORTS_SECOES.DESEMPENHO_LOCACOES)) {
        dadosRelatorio.desempenhoLocacoes =
          await this.obterDadosDesempenhoLocacoes(data_inicio, data_fim);
      }

      return dadosRelatorio;
    } catch (error) {
      console.error("Erro ao buscar dados do relatório:", error);
      throw error;
    }
  }

  async obterSumarioExecutivo(data_inicio, data_fim) {
    const ERROR_MESSAGE = "Falha ao recuperar dados do sumário executivo";

    const QUERY_QUANTIDADE_TOTAL_VENDAS = `SELECT count(*) as total FROM imoveis where status = 'vendido' and data_update_status BETWEEN :data_inicio AND :data_fim;`;
    const QUERY_VALOR_TOTAL_VENDAS = `SELECT COALESCE(SUM(preco), 0) AS valor_total
      FROM imoveis
    WHERE status = 'vendido'
      AND data_update_status >= :data_inicio
      AND data_update_status <= :data_fim;`;
    const QUERY_AGENDAMENTOS_NOVOS = `SELECT COUNT(*) AS total FROM agendamentos WHERE data_create BETWEEN :data_inicio AND :data_fim;`;
    const QUERY_NOVOS_USUARIOS_COM_AGENDAMENTO = `SELECT COUNT(DISTINCT u.id) AS total_usuarios_com_agendamento
        FROM usuario u
          JOIN agendamentos a ON a.id_usuario = u.id
        WHERE u.data_cadastro >= :data_inicio
          AND u.data_cadastro <= :data_fim
          AND a.data_create >= :data_inicio
          AND a.data_create <= :data_fim;`;

    const [
      valorGeralVendas,
      totalVendas,
      totalAgendamentosCriados,
      totalAgendamentosCriadosPorNovosUsuarios,
    ] = await Promise.all([
      this.#executeQuery(QUERY_QUANTIDADE_TOTAL_VENDAS, ERROR_MESSAGE, {
        data_inicio,
        data_fim,
      }).then((res) => res[0]?.total || 0),
      this.#executeQuery(QUERY_VALOR_TOTAL_VENDAS, ERROR_MESSAGE, {
        data_inicio,
        data_fim,
      }).then((res) => res[0]?.valor_total || 0),
      this.#executeQuery(QUERY_AGENDAMENTOS_NOVOS, ERROR_MESSAGE, {
        data_inicio,
        data_fim,
      }).then((res) => res[0]?.total || 0),
      this.#executeQuery(QUERY_NOVOS_USUARIOS_COM_AGENDAMENTO, ERROR_MESSAGE, {
        data_inicio,
        data_fim,
      }).then((res) => res[0]?.total_usuarios_com_agendamento || 0),
    ]);

    return {
      totalVendas: totalVendas,
      valorGeralVendas: valorGeralVendas,
      totalAgendamentosCriados: totalAgendamentosCriados,
      totalAgendamentosCriadosPorNovosUsuarios:
        totalAgendamentosCriadosPorNovosUsuarios,
    };
  }

  async obterDadosAnaliseEstoque() {
    const QUERY_ESTATISTICAS_IMOVEIS = `SELECT COUNT(*) AS total_imoveis,
      SUM(IF(status = 'disponivel', 1, 0)) AS total_imoveis_disponiveis,
      SUM(IF(status = 'locado', 1, 0)) AS total_imoveis_locados,
      SUM(IF(status = 'vendido', 1, 0)) AS total_imoveis_vendidos,
      SUM(IF(visibilidade_preco = 1, 1, 0)) AS total_preco_visivel,
      SUM(IF(visibilidade_preco = 0, 1, 0)) AS total_preco_oculto
    FROM imoveis;`;

    const QUERY_DISTRIBUICAO_IMOVEIS_PRECO = `SELECT * FROM estatisticasImoveisDistribuicaoPorPreco;`;

    const QUERY_DISTRIBUICAO_IMOVEIS_TIPO = `SELECT * FROM estatisticasImoveisDistribuicaoPorTipo;`;

    const QUERY_TABELA_IMOVEIS_ACESSOS = `SELECT I.id, COUNT(RI.id) AS quantidade_acessos, I.tipo, I.preco, CASE WHEN I.visibilidade_preco = 1 THEN 'Visível' ELSE 'Oculto' END AS visibilidade_preco, I.area,
      I.endereco
      FROM imoveis I
        LEFT JOIN
            recomendacao_imovel RI ON RI.imovel_id = I.id
        GROUP BY
            I.id, I.tipo, I.endereco
        ORDER BY quantidade_acessos DESC;`;

    const ERROR_MESSAGE = "Falha ao recuperar dados de imóveis para relatório";

    const [
      estatisticasImoveisResponse,
      distribuicaoPrecoResponse,
      distribuicaoTipoResponse,
      tabelaImoveisAcessosResponse,
    ] = await Promise.all([
      this.#executeQuery(QUERY_ESTATISTICAS_IMOVEIS, ERROR_MESSAGE),
      this.#executeQuery(QUERY_DISTRIBUICAO_IMOVEIS_PRECO, ERROR_MESSAGE),
      this.#executeQuery(QUERY_DISTRIBUICAO_IMOVEIS_TIPO, ERROR_MESSAGE),
      this.#executeQuery(QUERY_TABELA_IMOVEIS_ACESSOS, ERROR_MESSAGE),
    ]);

    const distribuicaoImoveisTipo = tiposImoveis.map((tipo) => {
      const registro = distribuicaoTipoResponse.find(
        (v) => v.tipoImovel === tipo
      );
      return {
        tipo: tipo,
        quantidade: registro ? Number(registro.quantidade) : 0,
        porcentagem: registro ? Number(registro.porcentagem) : 0,
      };
    });

    const faixaPrecosImoveis = ["-300", "300-600", "+600"];
    const distribuicaoImoveisPreco = faixaPrecosImoveis.map((faixa) => {
      const registro = distribuicaoPrecoResponse.find(
        (v) => v.faixa_preco === faixa
      );
      return {
        faixaPreco: faixa,
        quantidade: registro ? Number(registro.quantidade) : 0,
        porcentagem: registro ? Number(registro.porcentagem) : 0,
      };
    });

    const estoqueImobiliario = {
      estatisticas: estatisticasImoveisResponse,
      distribuicaoPorPreco: distribuicaoImoveisPreco,
      distribuicaoPorTipo: distribuicaoImoveisTipo,
      tabelaAcessos: tabelaImoveisAcessosResponse,
    };

    return estoqueImobiliario;
  }

  async obterDadosJornadaCliente(data_inicio, data_fim) {
    const ERROR_MESSAGE = "Falha ao recuperar dados da jornada do cliente";
    const QUERY_TOTAL_USUARIOS_CADASTRADOS = `SELECT COUNT(*) AS total FROM usuario WHERE data_cadastro BETWEEN :data_inicio AND :data_fim;`;

    const QUERY_ESTATISTICAS_AGENDAMENTO = `
      SELECT 
          COUNT(*) AS total_agendamentos, 
          COALESCE(SUM(IF(U.data_cadastro >= :data_inicio 
                AND U.data_cadastro < :data_fim, 1, 0)), 0) AS agendamento_novos_usuarios, 
          COALESCE(SUM(IF(U.data_cadastro < :data_inicio 
                OR U.data_cadastro >= :data_fim, 1, 0)), 0) AS agendamento_antigos_usuarios
      FROM agendamentos A
      INNER JOIN usuario U 
          ON U.id = A.id_usuario
      WHERE A.data_create >= :data_inicio AND A.data_create <= :data_fim;
    `;

    const QUERY_TABELA_AGENDAMENTOS = `SELECT A.id AS id_agendamento, TO_CHAR(A.data_create, 'DD/MM/YYYY HH24:MI') AS data_create, TO_CHAR(A.data_marcada, 'DD/MM/YYYY HH24:MI') AS data_marcada, U.email, 
    TO_CHAR(U.data_cadastro, 'DD/MM/YYYY') AS data_cadastro_usuario, I.tipo, I.endereco  
      FROM agendamentos A 
        INNER JOIN usuario U 
	        ON U.id = A.id_usuario 
        INNER JOIN imoveis I
	        ON I.id = A.id_imovel	
      WHERE A.data_create BETWEEN :data_inicio AND :data_fim;`;

    const QUERY_EVOLUCAO_MENSAL_AGENDAMENTOS_E_USUARIOS = `CALL estatisticasAgendamentosEUsuariosMes(:data_inicio, :data_fim);`;

    const [
      novosUsuarios,
      estatisticasAgendamento,
      evolucaoMensalAgendamentoEUsuario,
      tabelaAgendamentos,
    ] = await Promise.all([
      this.#executeQuery(QUERY_TOTAL_USUARIOS_CADASTRADOS, ERROR_MESSAGE, {
        data_inicio,
        data_fim,
      }).then((res) => res[0].total || 0),
      this.#executeQuery(QUERY_ESTATISTICAS_AGENDAMENTO, ERROR_MESSAGE, {
        data_inicio,
        data_fim,
      }).then((res) => res[0] || {}),
      this.#executeQuery(
        QUERY_EVOLUCAO_MENSAL_AGENDAMENTOS_E_USUARIOS,
        ERROR_MESSAGE,
        {
          data_inicio,
          data_fim,
        }
      ).then((res) => Object.values(res[0])),
      this.#executeQuery(QUERY_TABELA_AGENDAMENTOS, ERROR_MESSAGE, {
        data_inicio,
        data_fim,
      }).then((res) => Object.values(res) || []),
    ]);

    const taxaConversao =
      novosUsuarios <= 0
        ? 0
        : (Number(estatisticasAgendamento.agendamento_novos_usuarios || 0) /
            Number(novosUsuarios || 0)) *
          100;

    return {
      novosUsuarios: novosUsuarios,
      agendamentosNovosUsuarios:
        Number(estatisticasAgendamento.agendamento_novos_usuarios) || 0,
      agendamentosAntigoUsuarios:
        Number(estatisticasAgendamento.agendamento_antigos_usuarios) || 0,
      taxaConversao: taxaConversao,
      evolucaoMensalAgendamentoEUsuario: evolucaoMensalAgendamentoEUsuario,
      tabelaAgendamentos: tabelaAgendamentos || [],
    };
  }

  async obterDadosDesempenhoVendas(data_inicio, data_fim) {
    const ERROR_MESSAGE = "Falha ao recuperar dados de vendas para relatório";

    const QUERY_TOTAL = `SELECT count(*) AS total FROM imoveis WHERE status = 'vendido' AND data_update_status >= :data_inicio AND data_update_status <= :data_fim;`;
    const QUERY_DISTRIBUICAO_TIPO = `CALL estatisticasVendasIntervalo(:data_inicio, :data_fim);`;
    const QUERY_EVOLUCAO_MENSAL = `CALL estatisticasVendasMes(:data_inicio, :data_fim);`;
    const QUERY_REGISTRO_DADOS = `SELECT id, TO_CHAR(data_update_status, 'DD/MM/YYYY') AS data_update_status, endereco, tipo, preco, CASE WHEN visibilidade_preco = 1 THEN 'Visível' ELSE 'Oculto' END AS visibilidade_preco, area FROM imoveis WHERE STATUS = 'vendido' AND data_update_status BETWEEN :data_inicio AND :data_fim ORDER BY data_update_status DESC;`;

    const [
      total,
      distribuicaoTipoResponse,
      evolucaoMensalResponse,
      tabelaVendas,
    ] = await Promise.all([
      this.#executeQuery(QUERY_TOTAL, ERROR_MESSAGE, {
        data_inicio,
        data_fim,
      }),
      this.#executeQuery(QUERY_DISTRIBUICAO_TIPO, ERROR_MESSAGE, {
        data_inicio,
        data_fim,
      }).then((res) => Object.values(res[0])),
      this.#executeQuery(QUERY_EVOLUCAO_MENSAL, ERROR_MESSAGE, {
        data_inicio,
        data_fim,
      }).then((res) => Object.values(res[0])),
      this.#executeQuery(QUERY_REGISTRO_DADOS, ERROR_MESSAGE, {
        data_inicio,
        data_fim,
      }),
    ]);

    const distribuicaoTipo = tiposImoveis.map((tipo) => {
      const registro = distribuicaoTipoResponse.find(
        (v) => v.tipoImovel === tipo
      );
      return {
        tipo: tipo,
        quantidade: registro ? Number(registro.quantidade) : 0,
        porcentagem: registro ? Number(registro.porcentagem) : 0,
      };
    });

    const evolucaoMensal = Object.values(
      evolucaoMensalResponse.reduce((acc, row) => {
        acc[row.mes] = acc[row.mes] || {
          mes: row.mes,
          Apartamento: 0,
          Casa: 0,
          Terreno: 0,
        };
        acc[row.mes][row.tipoImovel] = Number(row.total);
        return acc;
      }, {})
    );

    return {
      totalVendas: total[0]?.total || 0,
      distribuicaoTipo: distribuicaoTipo,
      evolucaoMensal: evolucaoMensal,
      tabelaVendas: tabelaVendas,
    };
  }

  async obterDadosDesempenhoLocacoes(data_inicio, data_fim) {
    const ERROR_MESSAGE = "Falha ao recuperar dados de locações para relatório";

    const QUERY_TOTAL = `SELECT count(*) AS total FROM imoveis WHERE status = 'locado' AND data_update_status >= :data_inicio AND data_update_status <= :data_fim;`;
    const QUERY_DISTRIBUICAO_TIPO = `CALL estatisticasLocacoesIntervalo(:data_inicio, :data_fim);`;
    const QUERY_EVOLUCAO_MENSAL = `CALL estatisticasLocacoesMes(:data_inicio, :data_fim);`;
    const QUERY_REGISTRO_DADOS = `SELECT id, TO_CHAR(data_update_status, 'DD/MM/YYYY') AS data_update_status, endereco, tipo, preco , CASE WHEN visibilidade_preco = 1 THEN 'Visível' ELSE 'Oculto' END AS visibilidade_preco, area FROM imoveis WHERE STATUS = 'locado' AND data_update_status BETWEEN :data_inicio AND :data_fim ORDER BY data_update_status DESC;`;

    const [
      total,
      distribuicaoTipoResponse,
      evolucaoMensalResponse,
      tabelaLocacoes,
    ] = await Promise.all([
      this.#executeQuery(QUERY_TOTAL, ERROR_MESSAGE, {
        data_inicio,
        data_fim,
      }),
      this.#executeQuery(QUERY_DISTRIBUICAO_TIPO, ERROR_MESSAGE, {
        data_inicio,
        data_fim,
      }).then((res) => Object.values(res[0])),
      this.#executeQuery(QUERY_EVOLUCAO_MENSAL, ERROR_MESSAGE, {
        data_inicio,
        data_fim,
      }).then((res) => Object.values(res[0])),
      this.#executeQuery(QUERY_REGISTRO_DADOS, ERROR_MESSAGE, {
        data_inicio,
        data_fim,
      }),
    ]);

    const distribuicaoTipo = tiposImoveis.map((tipo) => {
      const registro = distribuicaoTipoResponse.find(
        (v) => v.tipoImovel === tipo
      );
      return {
        tipo: tipo,
        quantidade: registro ? Number(registro.quantidade) : 0,
        porcentagem: registro ? Number(registro.porcentagem) : 0,
      };
    });

    const evolucaoMensal = Object.values(
      evolucaoMensalResponse.reduce((acc, row) => {
        acc[row.mes] = acc[row.mes] || {
          mes: row.mes,
          Apartamento: 0,
          Casa: 0,
          Terreno: 0,
        };
        acc[row.mes][row.tipoImovel] = Number(row.total);
        return acc;
      }, {})
    );

    return {
      totalLocacoes: total[0]?.total || 0,
      distribuicaoTipo: distribuicaoTipo,
      evolucaoMensal: evolucaoMensal,
      tabelaLocacoes: tabelaLocacoes,
    };
  }
}

export default new ReportService();
