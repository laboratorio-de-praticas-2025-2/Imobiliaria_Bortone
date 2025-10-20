"use client";
import Card from "@/components/dash/Card";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import { PiCoinsFill } from "react-icons/pi";
import { BsFillBuildingFill } from "react-icons/bs";
import { MdTerrain, MdOutlineBedroomParent } from "react-icons/md";
import { FaUserPlus, FaUserPen, FaUser, FaHouseChimney } from "react-icons/fa6";
import { FaCheckSquare } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getDashboardData } from "@/services/dashboardService";
import dynamic from "next/dynamic";

// Importação dinâmica dos componentes de gráfico
const LineGraph = dynamic(() => import("@/components/dash/LineGraph"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      Carregando gráfico...
    </div>
  ),
});

const PizzaGraph = dynamic(() => import("@/components/dash/PizzaGraph"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      Carregando gráfico...
    </div>
  ),
});

export default function Dashboard() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca os dados da rota /Dashboard
  useEffect(() => {
    setLoading(true);
    setError(null);

    getDashboardData()
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
  }, []);

  const semDados =
    !dados ||
    !dados.estoqueImobiliario ||
    Object.keys(dados.estoqueImobiliario).length === 0 ||
    !dados.estatisticasUsuarios;

  const data = dados?.desempenhoVendas
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
      <Sidebar />
      <div className="md:ml-20">
        <CMS.Body title={"Dashboard"}>
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
              {/* Layout Desktop XL */}
              <div className="hidden xl:block">
                <div className="grid grid-cols-7 p-7 w-full gap-6">
                  {/* Coluna 1: Gráfico Pizza e Cards de Usuários */}
                  <div className="grid grid-rows-5 col-span-2 gap-6">
                    <div className="row-span-2">
                      <PizzaGraph
                        label={"Distribuição de Vendas por Tipo"}
                        data={data}
                        options={options}
                        loading={loading}
                      />
                    </div>

                    <div className="grid grid-rows-4 row-span-3 content-between gap-6 h-full">
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
                        label={"Agendamentos por usuários existentes"}
                        value={
                          dados.estatisticasUsuarios.agendamentosAntigoUsuarios
                        }
                        labelCol={{ span: 24 }}
                        icon={
                          <FaUserPen className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                        }
                      />
                      <Card
                        name={"total_agendamentos"}
                        label={"Total de Agendamentos"}
                        value={dados.sumarioExecutivo.totalAgendamentosCriados}
                        labelCol={{ span: 24 }}
                        icon={
                          <FaCheckSquare className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                        }
                      />
                    </div>
                  </div>

                  {/* Coluna 2: Cards de Estoque e Gráficos */}
                  <div className="grid grid-rows-5 col-span-5 gap-6">
                    {/* Linha 1: Cards de Estatísticas */}
                    <div className="grid grid-rows-7 row-span-2 gap-6">
                      <div className="grid grid-cols-2 row-span-4 gap-6">
                        <Card
                          name={"total_imoveis"}
                          label={"Total de Imóveis"}
                          className={"!text-3xl"}
                          value={
                            dados.estoqueImobiliario.estatisticas.totalImoveis
                          }
                          labelCol={{ span: 24 }}
                          icon={
                            <BsFillBuildingFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                          }
                        />
                        <Card
                          name={"imoveis_disponiveis"}
                          label={"Imóveis Disponíveis"}
                          className={"!text-3xl"}
                          value={
                            dados.estoqueImobiliario.estatisticas.disponiveis
                          }
                          labelCol={{ span: 24 }}
                          icon={
                            <FaCheckSquare className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 row-span-3 gap-6">
                        <Card
                          name={"imoveis_alugados"}
                          label={"Imóveis Alugados"}
                          value={dados.estoqueImobiliario.estatisticas.locados}
                          labelCol={{ span: 24 }}
                          className={"!text-lg"}
                          icon={
                            <MdOutlineBedroomParent className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                          }
                        />
                        <Card
                          name={"imoveis_vendidos"}
                          label={"Imóveis Vendidos"}
                          value={dados.estoqueImobiliario.estatisticas.vendidos}
                          labelCol={{ span: 24 }}
                          className={"!text-lg"}
                          icon={
                            <PiCoinsFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                          }
                        />
                        <Card
                          name={"apartamentos_disponiveis"}
                          label={"Apartamentos"}
                          value={
                            dados.estoqueImobiliario.distribuicaoPorTipo.find(
                              (item) => item.tipo === "Apartamento"
                            )?.quantidade || 0
                          }
                          labelCol={{ span: 24 }}
                          className={"!text-lg"}
                          icon={
                            <BsFillBuildingFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                          }
                        />
                        <Card
                          name={"casas_disponiveis"}
                          label={"Casas"}
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
                    </div>

                    {/* Linha 2: Gráfico de Aluguéis */}
                    <div className="row-span-3">
                      <LineGraph
                        lineGraphData={dados.desempenhoAlugueis.evolucaoMensal}
                        title="Evolução de Aluguéis"
                        loading={loading}
                      />
                    </div>

                    {/* Linha 3: Gráfico de Vendas */}
                    <div className="row-span-3">
                      <LineGraph
                        lineGraphData={dados.desempenhoVendas.evolucaoMensal}
                        title="Evolução de Vendas"
                        loading={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout Tablet */}
              <div className="hidden md:block xl:hidden pb-10">
                <div className="grid grid-flow-row h-fit gap-6 p-6">
                  <div className="grid grid-cols-2 h-fit gap-6">
                    <div>
                      <PizzaGraph
                        label={"Distribuição de Vendas por Tipo"}
                        className={"p-6"}
                        data={data}
                        options={options}
                        loading={loading}
                      />
                    </div>
                    <div className="grid grid-rows-2 h-[220px] gap-6">
                      <Card
                        name={"total_imoveis"}
                        label={"Total de Imóveis"}
                        className={"!text-xl"}
                        value={
                          dados.estoqueImobiliario.estatisticas.totalImoveis
                        }
                        labelCol={{ span: 24 }}
                        icon={
                          <BsFillBuildingFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                        }
                      />
                      <Card
                        name={"imoveis_disponiveis"}
                        label={"Imóveis Disponíveis"}
                        className={"!text-xl"}
                        value={
                          dados.estoqueImobiliario.estatisticas.disponiveis
                        }
                        labelCol={{ span: 24 }}
                        icon={
                          <FaCheckSquare className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 h-[100px] gap-6">
                    <Card
                      name={"imoveis_alugados"}
                      label={"Alugados"}
                      value={dados.estoqueImobiliario.estatisticas.locados}
                      labelCol={{ span: 24 }}
                      className={"!text-lg"}
                      icon={
                        <MdOutlineBedroomParent className="text-[var(--primary)] text-4xl group-hover:text-white transition-colors" />
                      }
                    />
                    <Card
                      name={"imoveis_vendidos"}
                      label={"Vendidos"}
                      value={dados.estoqueImobiliario.estatisticas.vendidos}
                      labelCol={{ span: 24 }}
                      className={"!text-lg"}
                      icon={
                        <PiCoinsFill className="text-[var(--primary)] text-4xl group-hover:text-white transition-colors" />
                      }
                    />
                    <Card
                      name={"apartamentos"}
                      label={"Apartamentos"}
                      value={
                        dados.estoqueImobiliario.distribuicaoPorTipo.find(
                          (item) => item.tipo === "Apartamento"
                        )?.quantidade || 0
                      }
                      labelCol={{ span: 24 }}
                      className={"!text-lg"}
                      icon={
                        <BsFillBuildingFill className="text-[var(--primary)] text-4xl group-hover:text-white transition-colors" />
                      }
                    />
                    <Card
                      name={"casas"}
                      label={"Casas"}
                      value={
                        dados.estoqueImobiliario.distribuicaoPorTipo.find(
                          (item) => item.tipo === "Casa"
                        )?.quantidade || 0
                      }
                      labelCol={{ span: 24 }}
                      className={"!text-lg"}
                      icon={
                        <FaHouseChimney className="text-[var(--primary)] text-4xl group-hover:text-white transition-colors" />
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <LineGraph
                        lineGraphData={dados.desempenhoAlugueis.evolucaoMensal}
                        title="Evolução de Aluguéis"
                        loading={loading}
                      />
                    </div>
                    <div>
                      <LineGraph
                        lineGraphData={dados.desempenhoVendas.evolucaoMensal}
                        title="Evolução de Vendas"
                        loading={loading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 h-[100px] gap-6">
                    <Card
                      name={"novos_usuarios"}
                      label={"Novos Usuários"}
                      value={dados.estatisticasUsuarios.novosUsuarios}
                      labelCol={{ span: 24 }}
                      className={"!text-xl"}
                      icon={
                        <FaUserPlus className="text-[var(--primary)] text-4xl group-hover:text-white transition-colors" />
                      }
                    />
                    <Card
                      name={"total_agendamentos"}
                      label={"Total Agendamentos"}
                      value={dados.sumarioExecutivo.totalAgendamentosCriados}
                      labelCol={{ span: 24 }}
                      className={"!text-xl"}
                      icon={
                        <FaCheckSquare className="text-[var(--primary)] text-4xl group-hover:text-white transition-colors" />
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Layout Mobile */}
              <div className="block md:hidden pb-10">
                <div className="grid grid-flow-row h-fit gap-6 p-4">
                  <PizzaGraph
                    label={"Distribuição de Vendas por Tipo"}
                    className={"p-4"}
                    data={data}
                    options={options}
                    loading={loading}
                  />

                  <Card
                    name={"total_imoveis"}
                    label={"Total de Imóveis"}
                    className={"!text-xl"}
                    value={dados.estoqueImobiliario.estatisticas.totalImoveis}
                    labelCol={{ span: 24 }}
                    icon={
                      <BsFillBuildingFill className="text-[var(--primary)] text-4xl group-hover:text-white transition-colors" />
                    }
                  />

                  <Card
                    name={"imoveis_disponiveis"}
                    label={"Imóveis Disponíveis"}
                    className={"!text-xl"}
                    value={dados.estoqueImobiliario.estatisticas.disponiveis}
                    labelCol={{ span: 24 }}
                    icon={
                      <FaCheckSquare className="text-[var(--primary)] text-4xl group-hover:text-white transition-colors" />
                    }
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Card
                      name={"imoveis_alugados"}
                      label={"Alugados"}
                      value={dados.estoqueImobiliario.estatisticas.locados}
                      labelCol={{ span: 24 }}
                      className={"!text-lg"}
                      icon={
                        <MdOutlineBedroomParent className="text-[var(--primary)] text-3xl group-hover:text-white transition-colors" />
                      }
                    />
                    <Card
                      name={"imoveis_vendidos"}
                      label={"Vendidos"}
                      value={dados.estoqueImobiliario.estatisticas.vendidos}
                      labelCol={{ span: 24 }}
                      className={"!text-lg"}
                      icon={
                        <PiCoinsFill className="text-[var(--primary)] text-3xl group-hover:text-white transition-colors" />
                      }
                    />
                  </div>

                  <Card
                    name={"novos_usuarios"}
                    label={"Novos Usuários"}
                    value={dados.estatisticasUsuarios.novosUsuarios}
                    labelCol={{ span: 24 }}
                    className={"!text-xl"}
                    icon={
                      <FaUserPlus className="text-[var(--primary)] text-4xl group-hover:text-white transition-colors" />
                    }
                  />

                  <Card
                    name={"total_agendamentos"}
                    label={"Total Agendamentos"}
                    value={dados.sumarioExecutivo.totalAgendamentosCriados}
                    labelCol={{ span: 24 }}
                    className={"!text-xl"}
                    icon={
                      <FaCheckSquare className="text-[var(--primary)] text-4xl group-hover:text-white transition-colors" />
                    }
                  />

                  <LineGraph
                    lineGraphData={dados.desempenhoAlugueis.evolucaoMensal}
                    title="Evolução de Aluguéis"
                    loading={loading}
                  />

                  <LineGraph
                    lineGraphData={dados.desempenhoVendas.evolucaoMensal}
                    title="Evolução de Vendas"
                    loading={loading}
                  />
                </div>
              </div>
            </>
          )}
        </CMS.Body>
      </div>
    </>
  );
}
