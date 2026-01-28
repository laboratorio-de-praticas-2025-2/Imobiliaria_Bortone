"use client";
import Card from "@/components/dash/Card";
import Sidebar from "@/components/cms/Sidebar";
import PizzaGraph from "@/components/dash/PizzaGraph";
import CMS from "@/components/cms/table";
import { PiCoinsFill } from "react-icons/pi";
import { BsFillBuildingFill } from "react-icons/bs";
import { MdTerrain, MdOutlineBedroomParent } from "react-icons/md";
import { FaUserPlus, FaUserPen, FaUser, FaHouseChimney } from "react-icons/fa6";
import { FaCheckSquare } from "react-icons/fa";
import LineGraph from "@/components/dash/LineGraph";
import { useEffect, useState } from "react";
import { getDashboardData } from "@/services/dashboardService";
import dynamic from "next/dynamic";

// import DebugAuth from "@/components/DebugAuth"; // Temporário para debug
export default function Dashboard() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para o filtro de data
  const [dataInicio, setDataInicio] = useState(() => {
    const now = new Date();
    const tresMesesAtras = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    // Garante formato YYYY-MM-DD
    return tresMesesAtras.toISOString().split('T')[0];
  });
  const [dataFim, setDataFim] = useState(() => {
    const now = new Date();
    // Garante formato YYYY-MM-DD
    return now.toISOString().split('T')[0];
  });

  const LineGraph = dynamic(() => import("@/components/dash/LineGraph"), {
    ssr: false,
    loading: () => <div>Carregando gráfico...</div>,
  });

  const PizzaGraph = dynamic(() => import("@/components/dash/PizzaGraph"), {
    ssr: false,
    loading: () => <div>Carregando gráfico...</div>,
  });

  // Busca os dados da rota /Dashboard
  useEffect(() => {
    // Validação: só busca dados se as datas estiverem definidas
    if (!dataInicio || !dataFim) {
      console.warn('Dashboard: Datas não definidas, aguardando...');
      return;
    }

    // Validação: dataInicio não pode ser maior que dataFim
    if (new Date(dataInicio) > new Date(dataFim)) {
      setError('Data de início não pode ser maior que data fim');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getDashboardData(dataInicio, dataFim)
      .then((res) => {
        setDados(res);
      })
      .catch((err) => {
        console.error("Dashboard: Erro ao buscar dados", err);
        setError(err.message || "Erro ao carregar dados");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dataInicio, dataFim]); // Recarrega quando as datas mudam

  const semDados =
    !dados ||
    !dados.estoqueImobiliario ||
    Object.keys(dados.estoqueImobiliario).length === 0 ||
    !dados.estatisticasUsuarios;

  // Dados para o gráfico de setores - VENDAS
  const dataVendas = dados?.desempenhoVendas
    ? {
        labels: dados.desempenhoVendas.distribuicaoPorTipo.map((v) => v.tipo),
        datasets: [
          {
            data: dados.desempenhoVendas.distribuicaoPorTipo.map(
              (v) => v.quantidade
            ),
            backgroundColor: ["#243B7B", "#F39C12", "#E74C3C"],
            borderWidth: 0,
            cutout: "0%",
          },
        ],
      }
    : { labels: [], datasets: [] };

  // Dados para o gráfico de setores - PREÇOS
  const dataPrecos = dados?.estoqueImobiliario?.distribuicaoPorPreco
    ? {
        labels: dados.estoqueImobiliario.distribuicaoPorPreco.map((v) => {
          if (v.faixaPreco === "-300") return "Até R$ 300k";
          if (v.faixaPreco === "300-600") return "R$ 300k - 600k";
          if (v.faixaPreco === "+600") return "Acima de R$ 600k";
          return v.faixaPreco;
        }),
        datasets: [
          {
            data: dados.estoqueImobiliario.distribuicaoPorPreco.map(
              (v) => v.quantidade
            ),
            backgroundColor: ["#4CAF50", "#2196F3", "#FF9800"],
            borderWidth: 0,
            cutout: "0%",
          },
        ],
      }
    : { labels: [], datasets: [] };

  // Dados para o gráfico de setores - ALUGUEIS
  const dataAlugueis = dados?.desempenhoAlugueis?.distribuicaoPorTipo
    ? {
        labels: dados.desempenhoAlugueis.distribuicaoPorTipo.map((v) => v.tipo),
        datasets: [
          {
            data: dados.desempenhoAlugueis.distribuicaoPorTipo.map(
              (v) => v.quantidade
            ),
            backgroundColor: ["#9C27B0", "#F39C12", "#E74C3C"],
            borderWidth: 0,
            cutout: "0%",
          },
        ],
      }
    : { labels: [], datasets: [] };

  const options = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: false,
          boxHeight: 18,
          color: "black",
          boxWidth: 18,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <>
      {/* <DebugAuth /> */}
      <Sidebar />
      <div className="md:ml-20">
        <CMS.Body 
          title={"Dashboard"} 
          type="dashboard"
          dataInicio={dataInicio}
          dataFim={dataFim}
          onDataInicioChange={setDataInicio}
          onDataFimChange={setDataFim}
        >
          {/* Estado de carregamento */}
          {loading ? (
            <div className="flex justify-center items-center h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando dashboard...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-[60vh]">
              <div className="text-center text-red-500">
                <p className="text-xl mb-2">❌ Erro ao carregar dados</p>
                <p className="text-sm">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          ) : semDados ? (
            <div className="flex justify-center items-center h-[60vh] text-gray-500">
              Nenhum dado disponível no momento.
            </div>
          ) : (
            <>
              <div className="hidden xl:block">
                <div className="grid grid-cols-7 p-7 w-full gap-6">
                  <div className="grid grid-rows-6 col-span-2 gap-6">
                    <div className="row-span-2">
                      <PizzaGraph
                        label={"Distribuição de Vendas por Tipo"}
                        data={dataVendas}
                        options={options}
                        loading={loading}
                      />
                    </div>

                    <div className="grid grid-rows-3 row-span-3 content-between gap-6 h-full">
                      <Card
                        name={"novos_usuarios"}
                        label={"Novos Usuários"}
                        value={dados.estatisticasUsuarios.novosUsuarios}
                        labelCol={{ span: 24 }}
                        icon={
                          <FaUserPlus className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                        }
                        loading={loading}
                      />

                      <Card
                        name={"agendamentos_novos_usuarios"}
                        label={"Agendamentos por novos usuários"}
                        value={
                          dados.estatisticasUsuarios.agendamentosNovosUsuarios
                        }
                        labelCol={{ span: 24 }}
                        icon={
                          <FaUserPen className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                        }
                      />
                      <Card
                        name={"agendamentos_antigos_usuarios"}
                        label={"Agendamentos por antigos usuários"}
                        value={
                          dados.estatisticasUsuarios.agendamentosAntigoUsuarios
                        }
                        labelCol={{ span: 24 }}
                        icon={
                          <FaUserPen className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                        }
                      />
                      <Card
                        name={"taxa_conversao"}
                        label={"Taxa de conversão"}
                        value={`${parseFloat(dados.estatisticasUsuarios.taxaConversao).toFixed(2)}%`}
                        labelCol={{ span: 24 }}
                        icon={
                          <FaUserPen className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                        }
                      />
                      <Card
                        name={"total_vendas"}
                        label={"Valor total em vendas"}
                        value={`R$ ${
                          dados.sumarioExecutivo.totalVendas?.toLocaleString() ||
                          "0"
                        }`}
                        labelCol={{ span: 24 }}
                        className={"!text-xl"}
                        icon={
                          <FaUser className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                        }
                        loading={loading}
                      />
                    </div>
                  </div>
                  <div className="grid grid-rows-5 col-span-5 gap-6">
                    <div className="grid grid-rows-7 row-span-2 gap-6">
                      <div className="grid grid-cols-2 row-span-4  gap-6">
                        <Card
                          name={"vendas"}
                          label={"Total de imóveis disponíveis"}
                          className={"!text-3xl"}
                          value={
                            dados.estoqueImobiliario.estatisticas.disponiveis
                          }
                          labelCol={{ span: 24 }}
                          icon={
                            <BsFillBuildingFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                          }
                        />
                        <Card
                          name={"apartamentos_disponiveis"}
                          label={"Apartamentos disponíveis"}
                          value={
                            dados.estoqueImobiliario.distribuicaoPorTipo.find(
                              (item) => item.tipo === "Apartamento"
                            )?.quantidade || 0
                          }
                          labelCol={{ span: 24 }}
                          className={"!text-lg"}
                          icon={
                            <MdOutlineBedroomParent className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 row-span-3 gap-6">
                        <div className="">
                          <Card
                            name={"imoveis_alugados"}
                            label={"Total de imóveis alugados"}
                            value={
                              dados.estoqueImobiliario.estatisticas.locados
                            }
                            labelCol={{ span: 24 }}
                            className={"!text-lg"}
                            icon={
                              <FaCheckSquare className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                            }
                          />
                        </div>
                        <div className="">
                          <Card
                            name={"imoveis_vendidos"}
                            label={"Total de imóveis vendidos"}
                            value={
                              dados.estoqueImobiliario.estatisticas.vendidos
                            }
                            labelCol={{ span: 24 }}
                            className={"!text-lg"}
                            icon={
                              <PiCoinsFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                            }
                          />
                        </div>
                        <div className="">
                          <Card
                            name={"casas_disponiveis"}
                            label={"Casas disponíveis"}
                            value={
                              dados.estoqueImobiliario.distribuicaoPorTipo.find(
                                (item) => item.tipo === "Casa"
                              )?.quantidade || 0
                            }
                            labelCol={{ span: 24 }}
                            className={"!text-lg"}
                            icon={
                              <FaHouseChimney className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                            }
                          />
                        </div>
                        <div className="">
                          <Card
                            name={"terrenos_disponiveis"}
                            label={"Terrenos disponíveis"}
                            value={
                              dados.estoqueImobiliario.distribuicaoPorTipo.find(
                                (item) => item.tipo === "Terreno"
                              )?.quantidade || 0
                            }
                            labelCol={{ span: 24 }}
                            className={"!text-lg"}
                            icon={
                              <MdTerrain className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row-span-3">
                      <LineGraph
                        lineGraphData={dados.desempenhoAlugueis.evolucaoMensal}
                        title="Evolução de aluguéis no período"
                      />
                    </div>
                    <div className="row-span-3">
                      <LineGraph
                        lineGraphData={dados.desempenhoVendas.evolucaoMensal}
                        title="Evolução de vendas no período"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 col-span-7 gap-6 mt-6">
                    <div className="col-span-1">
                      <PizzaGraph
                        label={"Distribuição por Faixa de Preço"}
                        data={dataPrecos}
                        options={options}
                        loading={loading}
                      />
                    </div>
                    <div className="col-span-1">
                      <PizzaGraph
                        label={"Distribuição de Aluguéis por Tipo"}
                        data={dataAlugueis}
                        options={options}
                        loading={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block xl:hidden pb-10">
                <div className="grid grid-flow-row h-fit gap-6">
                  <div className="grid grid-cols-2 h-fit gap-6">
                    <div className="">
                      {" "}
                      <PizzaGraph
                        label={"Distribuição de Vendas por Tipo"}
                        className={"p-6"}
                        data={dataVendas}
                        options={options}
                        loading={loading}
                      />
                    </div>

                    <div className="grid grid-rows-2 h-[220px] gap-6">
                      {/* <Card
                        name={"vendas"}
                        label={"Total de imóveis"}
                        className={"!text-xl"}
                        value={
                          dados.estoqueImobiliario.estatisticas.totalImoveis
                        }
                        labelCol={{ span: 24 }}
                        icon={
                          <PiCoinsFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                        }
                        loading={loading}
                      /> */}
                      <Card
                        name={"imoveis_disponiveis"}
                        label={"Total de imóveis disponíveis"}
                        className={"!text-xl"}
                        value={
                          dados.estoqueImobiliario.estatisticas.disponiveis
                        }
                        labelCol={{ span: 24 }}
                        icon={
                          <MdOutlineBedroomParent className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                        }
                        loading={loading}
                      />

                      <Card
                        name={"imoveis_alugados"}
                        label={"Total de imóveis alugados"}
                        value={dados.estoqueImobiliario.estatisticas.locados}
                        labelCol={{ span: 24 }}
                        className={"!text-lg"}
                        icon={
                          <FaCheckSquare className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                        }
                      />

                      <Card
                        name={"imoveis_vendidos"}
                        label={"Total de imóveis vendidos"}
                        value={dados.estoqueImobiliario.estatisticas.vendidos}
                        labelCol={{ span: 24 }}
                        className={"!text-lg"}
                        icon={
                          <PiCoinsFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 h-[100px] gap-6">
                    {/* <div className="col-span-1">
                      {" "}
                      <Card
                        name={"imoveis_disponiveis"}
                        label={"Total de imóveis disponíveis"}
                        value={
                          dados.estoqueImobiliario.estatisticas.disponiveis
                        }
                        labelCol={{ span: 24 }}
                        className={"!text-lg"}
                        icon={
                          <FaCheckSquare className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                        }
                        loading={loading}
                      />
                    </div> */}

                    <div className="col-span-2">
                      {" "}
                      <Card
                        name={"apartamentos_disponiveis"}
                        label={"Apartamentos disponíveis"}
                        value={
                          dados.estoqueImobiliario.distribuicaoPorTipo.find(
                            (item) => item.tipo === "Apartamento"
                          )?.quantidade || 0
                        }
                        labelCol={{ span: 24 }}
                        className={"!text-xl"}
                        icon={
                          <BsFillBuildingFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                        }
                        loading={loading}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 h-[100px] gap-6">
                    {" "}
                    <Card
                      name={"casas_disponiveis"}
                      label={"Casas disponíveis"}
                      value={
                        dados.estoqueImobiliario.distribuicaoPorTipo.find(
                          (item) => item.tipo === "Casa"
                        )?.quantidade || 0
                      }
                      labelCol={{ span: 24 }}
                      className={"!text-xl"}
                      icon={
                        <FaHouseChimney className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                      }
                      loading={loading}
                    />{" "}
                    <Card
                      name={"terrenos_disponiveis"}
                      label={"Terrenos disponíveis"}
                      value={
                        dados.estoqueImobiliario.distribuicaoPorTipo.find(
                          (item) => item.tipo === "Terreno"
                        )?.quantidade || 0
                      }
                      labelCol={{ span: 24 }}
                      className={"!text-xl"}
                      icon={
                        <MdTerrain className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                      }
                      loading={loading}
                    />
                  </div>
                  <div className="">
                    {" "}
                    <LineGraph
                      lineGraphData={dados.desempenhoAlugueis.evolucaoMensal}
                      title="Evolução de aluguéis no período"
                      loading={loading}
                    />
                  </div>
                  <div className="">
                    {" "}
                    <LineGraph
                      lineGraphData={dados.desempenhoVendas.evolucaoMensal}
                      title="Evolução de vendas no período"
                      loading={loading}
                    />
                  </div>
                  <div className="grid grid-cols-2 h-[100px] gap-6">
                    {" "}
                    <Card
                      name={"usuarios_cadastrados"}
                      label={"Total de usuários cadastrados"}
                      value={dados.estatisticasUsuarios.novosUsuarios}
                      labelCol={{ span: 24 }}
                      className={"!text-xl"}
                      icon={
                        <FaUserPlus className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                      }
                      loading={loading}
                    />
                    <Card
                      name={"agendamentos_totais"}
                      label={"Agendamentos totais"}
                      value={dados.sumarioExecutivo.totalAgendamentosCriados}
                      labelCol={{ span: 24 }}
                      className={"!text-xl"}
                      icon={
                        <FaUserPen className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                      }
                      loading={loading}
                    />
                  </div>
                  <div className="h-[100px]">
                    {" "}
                    <Card
                      name={"total_vendas"}
                      label={"Valor total em vendas"}
                      value={`R$ ${
                        dados.sumarioExecutivo.totalVendas?.toLocaleString() ||
                        "0"
                      }`}
                      labelCol={{ span: 24 }}
                      className={"!text-xl"}
                      icon={
                        <FaUser className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                      }
                      loading={loading}
                    />
                  </div>

                  {/* Gráficos de pizza adicionais para tablet */}
                  <div className="grid grid-cols-2 gap-6">
                    <PizzaGraph
                      label={"Distribuição por Faixa de Preço"}
                      data={dataPrecos}
                      options={options}
                      loading={loading}
                    />
                    <PizzaGraph
                      label={"Distribuição de Aluguéis por Tipo"}
                      data={dataAlugueis}
                      options={options}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
              <div className="block md:hidden  pb-10">
                <div className="grid grid-flow-row h-fit gap-6">
                  <div className="">
                    <PizzaGraph
                      label={"Distribuição de Vendas por Tipo"}
                      className={"p-6"}
                      data={dataVendas}
                      options={options}
                      loading={loading}
                    />
                  </div>{" "}
                  <Card
                    name={"vendas"}
                    label={"Número total de vendas"}
                    className={"!text-xl"}
                    value={dados.sumarioExecutivo.valorGeralVendas}
                    labelCol={{ span: 24 }}
                    icon={
                      <PiCoinsFill className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                    }
                    loading={loading}
                  />
                  <Card
                    name={"locacoes"}
                    label={"Total de aluguéis"}
                    className={"!text-xl"}
                    value={dados.desempenhoAlugueis.total}
                    labelCol={{ span: 24 }}
                    icon={
                      <MdOutlineBedroomParent className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                    }
                    loading={loading}
                  />
                  <Card
                    name={"imoveis_disponiveis"}
                    label={"Total de imóveis disponíveis"}
                    value={dados.estoqueImobiliario.estatisticas.disponiveis}
                    labelCol={{ span: 24 }}
                    className={"!text-lg"}
                    icon={
                      <FaCheckSquare className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                    }
                    loading={loading}
                  />
                  <Card
                    name={"apartamentos_disponiveis"}
                    label={"Apartamentos disponíveis"}
                    value={
                      dados.estoqueImobiliario.distribuicaoPorTipo.find(
                        (item) => item.tipo === "Apartamento"
                      )?.quantidade || 0
                    }
                    labelCol={{ span: 24 }}
                    className={"!text-xl"}
                    icon={
                      <BsFillBuildingFill className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                    }
                    loading={loading}
                  />{" "}
                  <Card
                    name={"casas_disponiveis"}
                    label={"Casas disponíveis"}
                    value={
                      dados.estoqueImobiliario.distribuicaoPorTipo.find(
                        (item) => item.tipo === "Casa"
                      )?.quantidade || 0
                    }
                    labelCol={{ span: 24 }}
                    className={"!text-xl"}
                    icon={
                      <FaHouseChimney className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                    }
                    loading={loading}
                  />{" "}
                  <Card
                    name={"terrenos_disponiveis"}
                    label={"Terrenos disponíveis"}
                    value={
                      dados.estoqueImobiliario.distribuicaoPorTipo.find(
                        (item) => item.tipo === "Terreno"
                      )?.quantidade || 0
                    }
                    labelCol={{ span: 24 }}
                    className={"!text-xl"}
                    icon={
                      <MdTerrain className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                    }
                    loading={loading}
                  />{" "}
                  <LineGraph
                    lineGraphData={dados.desempenhoAlugueis.evolucaoMensal}
                    title="Evolução de aluguéis no período"
                    loading={loading}
                  />
                  <LineGraph
                    lineGraphData={dados.desempenhoVendas.evolucaoMensal}
                    title="Evolução de vendas no período"
                    loading={loading}
                  />
                  <Card
                    name={"usuarios_cadastrados"}
                    label={"Novos usuários"}
                    value={dados.estatisticasUsuarios.novosUsuarios}
                    labelCol={{ span: 24 }}
                    className={"!text-xl"}
                    icon={
                      <FaUserPlus className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                    }
                    loading={loading}
                  />
                  <Card
                    name={"agendamentos_totais"}
                    label={"Agendamentos totais"}
                    value={dados.sumarioExecutivo.totalAgendamentosCriados}
                    labelCol={{ span: 24 }}
                    className={"!text-xl"}
                    icon={
                      <FaUserPen className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                    }
                    loading={loading}
                  />{" "}
                  <Card
                    name={"total_vendas"}
                    label={"Valor total em vendas"}
                    value={`R$ ${
                      dados.sumarioExecutivo.totalVendas?.toLocaleString() ||
                      "0"
                    }`}
                    labelCol={{ span: 24 }}
                    className={"!text-xl"}
                    icon={
                      <FaUser className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                    }
                    loading={loading}
                  />
                  {/* Gráficos de pizza adicionais para mobile */}
                  <div className="flex flex-col gap-6">
                    <div className="h-[300px]">
                      <PizzaGraph
                        label={"Distribuição por Faixa de Preço"}
                        data={dataPrecos}
                        options={options}
                        loading={loading}
                      />
                    </div>
                    <div className="h-[300px]">
                      <PizzaGraph
                        label={"Distribuição de Aluguéis por Tipo"}
                        data={dataAlugueis}
                        options={options}
                        loading={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CMS.Body>
      </div>
    </>
  );
}
