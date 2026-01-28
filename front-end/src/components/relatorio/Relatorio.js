import Image from "next/image";
import "../../styles/relatorio.css";
import LineGraph from "./LineGraph";
import PizzaGraph from "./PizzaGraph";
import logo from "@/../public/images/LogoAzul.svg";
import TableRelatorio from "@/components/relatorio/TableRelatorio.js";
import React from "react";
import dayjs from "dayjs";

/* Helper functions para formatação padronizada de valores vindos da API */
const formatCurrency = (value) => {
  const num = Number(value);
  if (!isFinite(num)) return "-";
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const formatNumber = (value) => {
  const num = Number(value);
  if (!isFinite(num)) return "-";
  return num.toLocaleString("pt-BR");
};

const formatPercent = (value) => {
  const num = Number(value);
  if (!isFinite(num)) return "-";
  return `${num}%`;
};

const formatTitle = (value) => {
  if (!value || typeof value !== "string") return "";

  // Remove extensão .pdf (case-insensitive) e quaisquer espaços extras
  let v = value.replace(/\.pdf$/i, "").trim();

  // Substitui hífens e underlines por espaço
  v = v.replace(/[-_]+/g, " ");

  // Normaliza múltiplos espaços em um único espaço
  v = v.replace(/\s+/g, " ").trim();

  //Remove "Imobiliaria Bortone"
  v = v.replace(/Imobiliaria Bortone/gi, "").trim();

  // Corrige palavras que precisam de acento
  const accentMap = {
    relatorio: "Relatório",
    estrategico: "Estratégico",
    sumario: "Sumário",
    geral: "Geral",
    imoveis: "Imóveis",
    jornada: "Jornada",
    cliente: "Cliente",
    desempenho: "Desempenho",
    vendas: "Vendas",
    locacoes: "Locações",
    locacao: "Locação",
  };

  // Reconstroi com acentuação
  v = v
    .split(" ")
    .map(
      (w) =>
        accentMap[w.toLowerCase()] ||
        w[0].toUpperCase() + w.slice(1).toLowerCase()
    )
    .join(" ");

  // Capitaliza cada palavra (exceto proposições muito curtas opcionalmente)
  v = v
    .split(" ")
    .map((w) =>
      w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w
    )
    .join(" ");

  return v;
};

export default function Relatorio({
  data,
  secoes = [],
  dateRange,
  reportCapaTitle = "Relatório Estratégico",
}) {
  // Se não vier array de seções ou vier vazio, renderiza todas as seções
  const todasSecoes = [
    "SUMARIO_EXECUTIVO",
    "JORNADA_CLIENTE",
    "ANALISE_ESTOQUE_IMOBILIARIO",
    "DESEMPENHO_VENDAS",
    "DESEMPENHO_LOCACOES",
  ];

  const secoesParaRenderizar =
    secoes && secoes.length > 0 ? secoes : todasSecoes;

  // Preparações de dados para gráficos (mesma lógica que antes)
  const desempenhoVendasDistribuicaoTipo = data?.desempenhoVendas
    ?.distribuicaoTipo
    ? {
        labels: data.desempenhoVendas.distribuicaoTipo.map((item) => item.tipo),
        datasets: [
          {
            data: data.desempenhoVendas.distribuicaoTipo.map(
              (item) => item.quantidade
            ),
            backgroundColor: ["#243B7B", "#F39C12", "#E74C3C"],
            borderWidth: 1,
            cutout: "0%",
          },
        ],
      }
    : { labels: [], datasets: [] };

  const desempenhoLocacoesDistribuicaoTipo = data?.desempenhoLocacoes
    ?.distribuicaoTipo
    ? {
        labels: data.desempenhoLocacoes.distribuicaoTipo.map(
          (item) => item.tipo
        ),
        datasets: [
          {
            data: data.desempenhoLocacoes.distribuicaoTipo.map(
              (item) => item.quantidade
            ),
            backgroundColor: ["#243B7B", "#F39C12", "#E74C3C"],
            borderWidth: 1,
            cutout: "0%",
          },
        ],
      }
    : { labels: [], datasets: [] };

  const estoqueImobiliarioDistribuicaoFaixaPreco = data?.analiseEstoque
    ?.distribuicaoPorPreco
    ? {
        labels: data.analiseEstoque.distribuicaoPorPreco.map(
          (item) => item.faixaPreco
        ),
        datasets: [
          {
            data: data.analiseEstoque.distribuicaoPorPreco.map(
              (item) => item.quantidade
            ),
            backgroundColor: ["#118C4F", "#F1EB9C", "#FF7276"],
            borderWidth: 1,
            cutout: "0%",
          },
        ],
      }
    : { labels: [], datasets: [] };

  const estoqueImobiliarioDistribuicaoTipo = data?.analiseEstoque
    ?.distribuicaoPorTipo
    ? {
        labels: data.analiseEstoque.distribuicaoPorTipo.map(
          (item) => item.tipo
        ),
        datasets: [
          {
            data: data.analiseEstoque.distribuicaoPorTipo.map(
              (item) => item.quantidade
            ),
            backgroundColor: ["#243B7B", "#F39C12", "#E74C3C"],
            borderWidth: 1,
            cutout: "0%",
          },
        ],
      }
    : { labels: [], datasets: [] };

  const dataAttribute = JSON.stringify(data);

  const currDate = new Date().toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const dataLocacaoPorTipo = data?.alugueis?.locacoesPorTipo
    ? {
        labels: Object.keys(data.alugueis.locacoesPorTipo),
        datasets: [
          {
            data: Object.values(data.alugueis.locacoesPorTipo),
            backgroundColor: ["#243B7B", "#F39C12", "#E74C3C"],
            borderWidth: 1,
            cutout: "0%",
          },
        ],
      }
    : { labels: [], datasets: [] };

  const distribuicaoImoveisPorPreco = data?.imoveis?.porFaixaDePreco
    ? {
        labels: [
          "até R$300.000",
          "entre R$300.000 e R$600.000",
          "maior que R$600.000",
        ],
        datasets: [
          {
            data: Object.values(data.imoveis.porFaixaDePreco),
            backgroundColor: ["#118C4F", "#F1EB9C", "#FF7276"],
            borderWidth: 1,
            cutout: "0%",
          },
        ],
      }
    : { labels: [], datasets: [] };

  if (!data) {
    return <div>Carregando dados do relatório...</div>;
  }

  /* Cada seção traz o título centralizado em SECTIONS[...].title para evitar divergência entre conteúdo e título na prévia/geração. */
  const SECTIONS = {
    SUMARIO_EXECUTIVO: {
      title: "Sumário Executivo",
      subtitles: [],
      render: (title) => (
        <div
          className="page flex flex-col justify-between"
          id="sumario-executivo"
        >
          <div>
            <header className="flex items-center gap-4 mb-4">
              <Image
                src={logo.src}
                alt="Logo Bortone"
                width={180}
                height={50}
              />
            </header>
            <h2 className="main-title text-center mb-6">{title}</h2>
            <div className="mb-6">
              <h3 className="!font-bold !text-lg !mb-2">KPIs de Vendas:</h3>
              <ul className="list-disc ml-8 mb-4">
                <li className="!text-lg">
                  <span>
                    Valor Geral de Vendas (VGV):
                  </span>{" "}
                  <span className="api-text">
                    {formatCurrency(data?.sumarioExecutivo?.totalVendas)}
                  </span>
                </li>
                <li className="!text-lg">
                  <span>
                    Quantidade Total de Vendas:
                  </span>{" "}
                  <span className="api-text">
                    {formatNumber(data?.sumarioExecutivo?.valorGeralVendas)}
                  </span>
                </li>
                <li className="!text-lg">
                  <span>Ticket Médio por Venda:</span>{" "}
                  <span className="api-text">
                    {(() => {
                      const totalVendas =
                        Number(data?.sumarioExecutivo?.valorGeralVendas) || 0;
                      const valorGeral =
                        Number(data?.sumarioExecutivo?.totalVendas) || 0;
                      const ticketMedio =
                        totalVendas > 0 ? valorGeral / totalVendas : 0;

                      return ticketMedio
                        ? ticketMedio.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                        : "-";
                    })()}
                  </span>
                </li>
              </ul>
              <hr className="my-4 border-gray-400" />
              <h3 className="!font-bold !text-lg !mb-2">
                KPIs de Leads e Engajamento:
              </h3>
              <ul className="list-disc ml-8">
                <li className="!text-lg">
                  <span>
                    Novos Agendamentos Criados:
                  </span>{" "}
                  <span className="api-text">
                    {formatNumber(
                      data?.sumarioExecutivo?.totalAgendamentosCriados
                    )}
                  </span>
                </li>
                <li className="!text-lg">
                  <span>
                    Novos Usuários Cadastrados que realizaram agendamentos:
                  </span>{" "}
                  <span className="api-text">
                    {formatNumber(
                      data?.sumarioExecutivo
                        ?.totalAgendamentosCriadosPorNovosUsuarios
                    )}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },

    JORNADA_CLIENTE: {
      title: "Jornada do Cliente",
      subtitles: [
        "Resumo dos Dados",
        "Relação - Novos Usuários e Agendamentos",
        "Tabela Detalhada de Agendamentos",
      ],
      render: (title) => (
        <>
          <div className="page" id="jornada-cliente">
            <header>
              <Image
                src={logo.src}
                alt="Logo Bortone"
                width={180}
                height={50}
              />
            </header>
            <div className="text-center">
              <h2 className="main-title">{title}</h2>
            </div>
            <div>
              <h3 className="title">Resumo dos Dados:</h3>
              <ul className="list-disc ml-8 mb-4">
                <li className="!text-lg">
                  <span>
                    Usuários Cadastrados no Período:
                  </span>{" "}
                  <span className="api-text">
                    {formatNumber(data?.jornadaCliente?.novosUsuarios)}
                  </span>
                </li>
                <li className="!text-lg">
                  <span>
                    Agendamentos Criados por novos Usuários:
                  </span>{" "}
                  <span className="api-text">
                    {formatNumber(
                      data?.jornadaCliente?.agendamentosNovosUsuarios
                    )}
                  </span>
                </li>
                <li className="!text-lg">
                  <span>
                    Agendamentos Criados por Usuários Antigos:
                  </span>{" "}
                  <span className="api-text">
                    {formatNumber(
                      data?.jornadaCliente?.agendamentosAntigoUsuarios
                    )}
                  </span>
                </li>
                <li className="!text-lg">
                  <span>
                    Taxa de Conversão de Agendamentos por Novos Usuários:
                  </span>{" "}
                  <span className="api-text">
                    {formatPercent(data?.jornadaCliente?.taxaConversao)}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="title">
                Relação - Novos Usuários e Agendamentos:
              </h3>
              {data.jornadaCliente?.evolucaoMensalAgendamentoEUsuario ? (
                <>
                  <LineGraph
                    label=""
                    graphData={
                      data.jornadaCliente.evolucaoMensalAgendamentoEUsuario
                    }
                  />
                  <p className="chart-caption">
                    Eixo X: Mês (MM/YYYY). Eixo Y: Contagem de usuários /
                    agendamentos (unidades).
                  </p>
                </>
              ) : (
                <p>Sem registro de Dados de Evolução Mensal.</p>
              )}
            </div>
          </div>
          <TableRelatorio
            title={`${title}`}
            data={data?.jornadaCliente?.tabelaAgendamentos}
            headers={[
              { key: "id_agendamento", label: "ID Agendamento" },
              { key: "data_marcada", label: "Data Marcada" },
              { key: "data_cadastro_usuario", label: "Data Cadastro Usuário" },
              { key: "email", label: "Email" },
              { key: "endereco", label: "Endereço do Imóvel" },
              { key: "tipo", label: "Tipo" },
            ]}
            returnPages={true}
          />
        </>
      ),
    },

    ANALISE_ESTOQUE_IMOBILIARIO: {
      title: "Análise de Estoque Imobiliário",
      subtitles: [
        "Resumo do Estoque",
        "Imóveis Mais Acessados no Site",
        "Registro Detalhado do Portfólio",
        "Insights e Ações",
      ],
      render: (title) => (
        <>
          <div className="page" id="estoque-imobiliario">
            <header>
              <Image
                src={logo.src}
                alt="Logo Bortone"
                width={180}
                height={50}
              />
            </header>
            <div className="text-center">
              <h2 className="main-title !m-0">{title}</h2>
              <span>
                Essa seção abrange análises além do intervalo de período
                selecionado!
              </span>
            </div>
            <div>
              <h3 className="title !m-0 !mt-2">Resumo do Estoque:</h3>
              <ul className="list-disc ml-8 mt-2">
                <li className="!text-lg">
                  <span>Total de Imóveis:</span>{" "}
                  <span className="api-text">
                    {formatNumber(
                      data?.analiseEstoque?.estatisticas?.[0]?.total_imoveis
                    )}
                  </span>
                </li>
                <li className="!text-lg">
                  <span>
                    Total de Imóveis Disponíveis:
                  </span>{" "}
                  <span className="api-text">
                    {formatNumber(
                      data?.analiseEstoque?.estatisticas?.[0]
                        ?.total_imoveis_disponiveis
                    )}
                  </span>
                </li>
                <li className="!text-lg">
                  <span>
                    Total de Imóveis Locados:
                  </span>{" "}
                  <span className="api-text">
                    {formatNumber(
                      data?.analiseEstoque?.estatisticas?.[0]
                        ?.total_imoveis_locados
                    )}
                  </span>
                </li>
                <li className="!text-lg">
                  <span>
                    Total de Imóveis Vendidos:
                  </span>{" "}
                  <span className="api-text">
                    {formatNumber(
                      data?.analiseEstoque?.estatisticas?.[0]
                        ?.total_imoveis_vendidos
                    )}
                  </span>
                </li>
                <li className="!text-lg">
                  <span>
                    Imóveis com Preço Visível:
                  </span>{" "}
                  <span className="api-text">
                    {formatNumber(
                      data?.analiseEstoque?.estatisticas?.[0]
                        ?.total_preco_visivel
                    )}
                  </span>
                </li>
                <li className="!text-lg">
                  <span>
                    Imóveis com Preço Oculto:
                  </span>{" "}
                  <span className="api-text">
                    {formatNumber(
                      data?.analiseEstoque?.estatisticas?.[0]
                        ?.total_preco_oculto
                    )}
                  </span>
                </li>
                <li className="!text-lg li-graph">
                  <span>
                    Distribuição de imóveis por faixa de preço:
                  </span>
                  <div>
                    {estoqueImobiliarioDistribuicaoFaixaPreco ? (
                      <>
                        <PizzaGraph
                          label={""}
                          className={"!ms-12"}
                          data={estoqueImobiliarioDistribuicaoFaixaPreco}
                        />
                        <p className="chart-caption">
                          Legenda: faixas de preço (unidade: imóveis).
                        </p>
                      </>
                    ) : (
                      <p>Não há itens para exibir.</p>
                    )}
                  </div>
                </li>
                <li className="!text-lg li-graph">
                  <span>
                    Distribuição de imóveis por tipo:
                  </span>
                  <br />
                  <div>
                    {estoqueImobiliarioDistribuicaoTipo ? (
                      <>
                        <PizzaGraph
                          label={""}
                          className={"!ms-12"}
                          data={estoqueImobiliarioDistribuicaoTipo}
                        />
                        <p className="chart-caption">
                          Legenda: tipos de imóvel (unidade: imóveis).
                        </p>
                      </>
                    ) : (
                      <p>Não há itens para exibir.</p>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <TableRelatorio
            title={`${title}`}
            data={data?.analiseEstoque?.tabelaAcessos}
            headers={[
              { key: "id", label: "ID" },
              { key: "quantidade_acessos", label: "Quantidade Acessos" },
              { key: "tipo", label: "Tipo" },
              { key: "visibilidade_preco", label: "Visibilidade Preço" },
              {
                key: "area",
                label: "Área",                
                render: (value) => (value ? `${value} m²` : "-"),
              },
              { key: "endereco", label: "Endereço" },
            ]}
            returnPages={true}
          />
        </>
      ),
    },

    DESEMPENHO_VENDAS: {
      title: "Desempenho de Vendas",
      subtitles: [
        "Resumo de Vendas",
        "Gráfico de Evolução Mensal das Vendas",
        "Tabela Detalhada de Vendas",
      ],
      render: (title) => (
        <>
          <div className="page" id="desempenho-vendas">
            <header>
              <Image
                src={logo.src}
                alt="Logo Bortone"
                width={180}
                height={50}
              />
            </header>
            <div>
              <h2 className="main-title">{title}</h2>
              <h3 className="title">Resumo de Vendas:</h3>
              <div>
                <ul className="list-disc ml-8 mb-4">
                  <li className="!text-lg !flex !flex-row !items-center !justify-start">
                    <span>Total de Vendas:</span>{" "}
                    <span className="api-text">
                      {formatNumber(data?.desempenhoVendas?.totalVendas)}
                    </span>
                  </li>
                  <li className="!text-lg li-graph">
                    <span>
                      Distribuição das Vendas por Tipo:
                    </span>
                    <br />
                    <div>
                      {desempenhoVendasDistribuicaoTipo ? (
                        <>
                          <PizzaGraph
                            label={""}
                            className={"w-[450px] h-[300px] !ms-12"}
                            data={desempenhoVendasDistribuicaoTipo}
                          />
                          <p className="chart-caption">
                            Legenda: categorias de venda (unidade: vendas).
                          </p>
                        </>
                      ) : (
                        <p className="!ms-4">Não Houveram Vendas No período</p>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="title">Evolução Mensal das Vendas:</h3>
              {data.desempenhoVendas?.evolucaoMensal ? (
                <>
                  <LineGraph
                    label=""
                    graphData={data.desempenhoVendas.evolucaoMensal}
                  />
                  <p className="chart-caption">
                    Eixo X: Mês (MM/YYYY). Eixo Y: Número de vendas (unidades).
                  </p>
                </>
              ) : (
                <p>Sem registro de Dados de Evolução Mensal das Vendas.</p>
              )}
            </div>
          </div>
          <TableRelatorio
            title={`${title}`}
            data={data?.desempenhoVendas?.tabelaVendas}
            headers={[
              { key: "id", label: "ID" },
              {
                key: "data_update_status_str",
                label: "Data de Venda",                
              },
              { key: "tipo", label: "Tipo do Imóvel" },
              { key: "endereco", label: "Endereco" },
              {
                key: "preco",
                label: "Preço",                
                render: (value) => formatCurrency(value),
              },
              { key: "visibilidade_preco", label: "Visibilidade Preço" },
              {
                key: "area",
                label: "Área",                
                render: (value) => (value ? `${value} m²` : "-"),
              },
            ]}
            returnPages={true}
          />
        </>
      ),
    },

    DESEMPENHO_LOCACOES: {
      title: "Desempenho de Locações",
      subtitles: [
        "Resumo de Locações",
        "Gráfico de Evolução Mensal das Locações",
        "Tabela Detalhada de Locações",
      ],
      render: (title) => (
        <>
          <div className="page" id="desempenho-locacoes">
            <header>
              <Image
                src={logo.src}
                alt="Logo Bortone"
                width={180}
                height={50}
              />
            </header>
            <div>
              <h2 className="main-title">{title}</h2>
              <h3 className="title">Resumo de Locações:</h3>
              <div>
                <ul className="list-disc ml-8 mb-4">
                  <li className="!text-lg">
                    <span>Total de Locações:</span>{" "}
                    <span className="api-text">
                      {formatNumber(data?.desempenhoLocacoes?.totalLocacoes)}
                    </span>
                  </li>
                  <li className="!text-lg li-graph">
                    <span>
                      Distribuição das Locações por Tipo:
                    </span>
                    <br />
                    <div>
                      {desempenhoLocacoesDistribuicaoTipo ? (
                        <>
                          <PizzaGraph
                            label={""}
                            className={"w-[450px] h-[300px] !ms-12"}
                            data={desempenhoLocacoesDistribuicaoTipo}
                          />
                          <p className="chart-caption">
                            Legenda: categorias de locação (unidade: locações).
                          </p>
                        </>
                      ) : (
                        <p>Não Houveram Locações No período</p>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="title">Evolução Mensal das Locações:</h3>
              {data.desempenhoLocacoes?.evolucaoMensal ? (
                <>
                  <LineGraph
                    label=""
                    graphData={data.desempenhoLocacoes.evolucaoMensal}
                  />
                  <p className="chart-caption">
                    Eixo X: Mês (MM/YYYY). Eixo Y: Número de locações
                    (unidades).
                  </p>
                </>
              ) : (
                <p>Sem registro de Dados de Evolução Mensal das Locações.</p>
              )}
            </div>
          </div>
          <TableRelatorio
            title={`${title}`}
            data={data?.desempenhoLocacoes?.tabelaLocacoes}
            headers={[
              { key: "id", label: "ID" },
              {
                key: "data_update_status_str",
                label: "Data de Locação",                
              },
              { key: "tipo", label: "Tipo do Imóvel" },
              { key: "endereco", label: "Endereco" },
              {
                key: "preco",
                label: "Preço",                
                render: (value) => formatCurrency(value),
              },
              { key: "visibilidade_preco", label: "Visibilidade Preço" },
              {
                key: "area",
                label: "Área",                
                render: (value) => (value ? `${value} m²` : "-"),
              },
            ]}
            returnPages={true}
          />
        </>
      ),
    },
  };

  // Gera o sumário dinâmico
  const generateSumario = () => {
    let sumarioItems = [];
    let sectionCounter = 1;

    secoesParaRenderizar.forEach((secaoKey) => {
      const secao = SECTIONS[secaoKey];
      if (!secao) return;

      // Adiciona título principal da seção
      sumarioItems.push(
        <div
          key={`section-${secaoKey}`}
          className="flex justify-between border-b border-transparent mb-1 mt-2"
        >
          <span className="font-semibold">
            {sectionCounter}. {secao.title}
          </span>
        </div>
      );

      // Adiciona subtítulos se existirem
      if (secao.subtitles && secao.subtitles.length > 0) {
        secao.subtitles.forEach((subtitle, subtitleIndex) => {
          sumarioItems.push(
            <div
              key={`${secaoKey}-${subtitleIndex}`}
              className="pl-4 flex justify-between border-b border-transparent mb-1"
            >
              <span>
                {sectionCounter}.{subtitleIndex + 1}. {subtitle}
              </span>
            </div>
          );
        });
      }

      sectionCounter++;
    });

    return sumarioItems;
  };

  return (
    <div data-report-data={dataAttribute}>
      {/* CAPA */}
      <div className="page flex flex-col justify-between items-center relative bg-white text-[#010101]">
        {/* Logo e nome do grupo */}
        <div className="flex flex-col items-center mt-12 mb-8">
          <Image
            src={logo.src}
            alt="Logo Grupo Bortone"
            width={180}
            height={50}
            className="mb-2"
          />
        </div>

        <div>
          <h1 className="text-4xl md:text-5xl text-center leading-[2.8rem] !font-extrabold">
            {formatTitle(reportCapaTitle)}
            <br/>
            Imobiliária Bortone
          </h1>

          <div className="text-center mt-20 mb-2">
            <div className="!font-semibold text-base">Período Analisado</div>
            <div className="font-semibold text-lg">
              {dayjs(dateRange.startDate).format("DD/MM/YYYY")} -{" "}
              {dayjs(dateRange.endDate).format("DD/MM/YYYY")}
            </div>
          </div>
        </div>
        <div className="header-meta">Data de Emissão: {currDate}</div>
      </div>

      {/* SUMÁRIO */}
      <div className="page flex flex-col items-center pt-10">
        <header className="w-full flex justify-start items-center mb-8">
          <Image
            src={logo.src}
            alt="Logo Bortone"
            width={180}
            height={50}
            className="mb-2"
          />
        </header>
        <h2 className="main-title text-left w-full mb-8">Sumário:</h2>
        <div className="w-full max-w-2xl mx-auto text-[1.1rem]">
          {generateSumario()}
        </div>
      </div>

      {/* RENDERIZA AS SEÇÕES SOLICITADAS */}
      {secoesParaRenderizar.map((secaoKey) => {
        const secao = SECTIONS[secaoKey];
        if (!secao) return null;
        return (
          <React.Fragment key={secaoKey}>
            {secao.render(secao.title)}
          </React.Fragment>
        );
      })}
    </div>
  );
}
