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
export default function Dashboard() {

  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca os dados da rota /Dashboard
  useEffect(() => {
    getDashboardData()
      .then((res) => setDados(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <p>Carregando...</p>;
  if (!dados) return <p>Erro ao carregar</p>;

  // Dados para o gráfico de setores
  const data = dados?.desempenhoVendas
  ? {
      labels: dados.desempenhoVendas.distribuicaoPorTipo.map((v) => v.tipo),
      datasets: [
        {
          data: dados.desempenhoVendas.distribuicaoPorTipo.map((v) => v.quantidade),
          backgroundColor: ["#243B7B", "#F39C12", "#E74C3C"],
          borderWidth: 0,
          cutout: "0%",
        },
      ],
    }
  : { labels: [], datasets: [] };

/*   const data = {
    labels: dados.vendasRecentes.map((v) => v.tipo),
    // labels: ["Apartamentos", "Casas", "Terrenos"],
    datasets: [
      {
        data: [45, 25, 15],
        backgroundColor: [
          "#243B7B",
          "#F39C12",
          "#E74C3C",
          "#B8AEBF",
          "#A6A6A6",
        ], // cores
        borderWidth: 0,
        cutout: "0%", // transforma em donut (se fosse 0%, seria uma pizza cheia)
      },
    ],
  }; */
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
          {/* Aparente em telas grandes: */}
          <div className="hidden xl:block">
            <div className="grid grid-cols-7 p-7 w-full gap-6">
              <div className="grid grid-rows-5 col-span-2 gap-6">
                <div className="row-span-2">
                  <PizzaGraph
                    label={"Vendas no período"}
                    data={data}
                    options={options}
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
                  />

                  <Card
                    name={"agendamentos_novos_usuarios"}
                    label={"Agendamentos por novos usuários"}
                    value={dados.estatisticasUsuarios.agendamentosNovosUsuarios}
                    labelCol={{ span: 24 }}
                    icon={
                      <FaUserPen className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                    }
                  />
                   <Card
                    name={"agendamentos_antigos_usuarios"}
                    label={"Agendamentos por antigos usuários"}
                    value={dados.estatisticasUsuarios.agendamentosAntigoUsuarios}
                    labelCol={{ span: 24 }}
                    icon={
                      <FaUserPen className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                    }
                  />
                  <Card
                    name={"taxa_conversao"}
                    label={"Taxa de conversão"}
                    value={dados.estatisticasUsuarios.taxaConversao}
                    labelCol={{ span: 24 }}
                    icon={
                      <FaUserPen className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                    }
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
                      value={dados.estoqueImobiliario.estatisticas.disponiveis}
                      labelCol={{ span: 24 }}
                      icon={
                        <PiCoinsFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                      }
                    />
                    <Card
                      name={"locacoes"}
                      label={"Total de imóveis disponíveis para locações"}
                      className={"!text-3xl"}
                      value={dados.estoqueImobiliario.estatisticas.disponiveis}
                      labelCol={{ span: 24 }}
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
                        value={dados.estoqueImobiliario.estatisticas.locados}
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
                        value={dados.estoqueImobiliario.estatisticas.vendidos}
                        labelCol={{ span: 24 }}
                        className={"!text-lg"}
                        icon={
                          <BsFillBuildingFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                        }
                      />
                    </div>
                    <div className="">
                      <Card
                        name={"casas_disponiveis"}
                        label={"Casas disponíveis"}
                        value={dados.estoqueImobiliario.distribuicaoPorTipo.find(item => item.tipo === 'Casa')?.quantidade || 0}
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
                        value={dados.estoqueImobiliario.distribuicaoPorTipo.find(item => item.tipo === 'Terreno')?.quantidade || 0}
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
                  {/* Passa os dados dos alugueis como propriedade pro componente */}
                    <LineGraph lineGraphData={dados.desempenhoAlugueis.evolucaoMensal}
                    title="Evolução de aluguéis" />
                </div>
                <div className="row-span-3">
                  {/* Passa os dados dos alugueis como propriedade pro componente */}
                    <LineGraph lineGraphData={dados.desempenhoVendas.evolucaoMensal}
                    title="Evolução de vendas" />
                </div>
              </div>
            </div>
          </div>
          {/* Aparente em telas médias: */}
          <div className="hidden md:block xl:hidden pb-10">
            <div className="grid grid-flow-row h-fit gap-6">
              <div className="grid grid-cols-2 h-fit gap-6">
                <div className="">
                  {" "}
                  <PizzaGraph
                    label={"Venda nos últimos 30 dias"}
                    className={"p-6"}
                    data={data}
                    options={options}
                  />
                </div>
                <div className="grid grid-rows-2 h-[220px] gap-6">
                  <Card
                    name={"vendas"}
                    label={"Total de imóveis disponíveis para venda"}
                    className={"!text-xl"}
                    value={0}
                    labelCol={{ span: 24 }}
                    icon={
                      <PiCoinsFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                    }
                  />
                  <Card
                    name={"locacoes"}
                    label={"Total de imóveis disponíveis para locações"}
                    className={"!text-xl"}
                    value={0}
                    labelCol={{ span: 24 }}
                    icon={
                      <MdOutlineBedroomParent className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 h-[100px] gap-6">
                <div className="col-span-1">
                  {" "}
                  <Card
                    name={"imoveis_disponiveis"}
                    label={"Total de imóveis disponíveis"}
                    value={0}
                    labelCol={{ span: 24 }}
                    className={"!text-lg"}
                    icon={
                      <FaCheckSquare className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                    }
                  />
                </div>
                <div className="col-span-2">
                  {" "}
                  <Card
                    name={"apartamentos_disponiveis"}
                    label={"Apartamentos disponíveis"}
                    value={0}
                    labelCol={{ span: 24 }}
                    className={"!text-xl"}
                    icon={
                      <BsFillBuildingFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 h-[100px] gap-6">
                {" "}
                <Card
                  name={"casas_disponiveis"}
                  label={"Casas disponíveis"}
                  value={0}
                  labelCol={{ span: 24 }}
                  className={"!text-xl"}
                  icon={
                    <FaHouseChimney className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                  }
                />{" "}
                <Card
                  name={"terrenos_disponiveis"}
                  label={"Terrenos disponíveis"}
                  value={0}
                  labelCol={{ span: 24 }}
                  className={"!text-xl"}
                  icon={
                    <MdTerrain className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                  }
                />
              </div>
              <div className="">
                {" "}
                {/* <LineGraph alugueisPorMes={0} /> */}
              </div>
              <div className="grid grid-cols-2 h-[100px] gap-6">
                {" "}
                <Card
                  name={"usuarios_cadastrados"}
                  label={"Total de usuários cadastrados"}
                  value={0}
                  labelCol={{ span: 24 }}
                  className={"!text-xl"}
                  icon={
                    <FaUserPlus className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                  }
                />
                <Card
                  name={"usuarios_administradores"}
                  label={"Usuários administradores"}
                  value={0}
                  labelCol={{ span: 24 }}
                  className={"!text-xl"}
                  icon={
                    <FaUserPen className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                  }
                />
              </div>
              <div className="h-[100px]">
                {" "}
                <Card
                  name={"casas_visitantes"}
                  label={"Usuários visitantes"}
                  value={0}
                  labelCol={{ span: 24 }}
                  className={"!text-xl"}
                  icon={
                    <FaUser className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                  }
                />
              </div>
            </div>
          </div>
          <div className="block md:hidden  pb-10">
            <div className="grid grid-flow-row h-fit gap-6">
              <div className="">
                <PizzaGraph
                  label={"Venda nos últimos 30 dias"}
                  className={"p-6"}
                  data={data}
                  options={options}
                />
              </div>{" "}
              <Card
                name={"vendas"}
                label={"Número total de vendas"}
                className={"!text-xl"}
                value={0}
                labelCol={{ span: 24 }}
                icon={
                  <PiCoinsFill className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                }
              />
              <Card
                name={"locacoes"}
                label={"Número total de locações"}
                className={"!text-xl"}
                value={0}
                labelCol={{ span: 24 }}
                icon={
                  <MdOutlineBedroomParent className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                }
              />
              <Card
                name={"imoveis_disponiveis"}
                label={"Total de imóveis disponíveis"}
                value={0}
                labelCol={{ span: 24 }}
                className={"!text-lg"}
                icon={
                  <FaCheckSquare className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                }
              />
              <Card
                name={"apartamentos_disponiveis"}
                label={"Apartamentos disponíveis"}
                value={0}
                labelCol={{ span: 24 }}
                className={"!text-xl"}
                icon={
                  <BsFillBuildingFill className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                }
              />{" "}
              <Card
                name={"casas_disponiveis"}
                label={"Casas disponíveis"}
                value={0}
                labelCol={{ span: 24 }}
                className={"!text-xl"}
                icon={
                  <FaHouseChimney className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                }
              />{" "}
              <Card
                name={"terrenos_disponiveis"}
                label={"Terrenos disponíveis"}
                value={0}
                labelCol={{ span: 24 }}
                className={"!text-xl"}
                icon={
                  <MdTerrain className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                }
              />{" "}
              {/* <LineGraph alugueisPorMes={dados.alugueisPorMes} /> */}
              <Card
                name={"usuarios_cadastrados"}
                label={"Total de usuários cadastrados"}
                value={0}
                labelCol={{ span: 24 }}
                className={"!text-xl"}
                icon={
                  <FaUserPlus className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                }
              />
              <Card
                name={"usuarios_administradores"}
                label={"Usuários administradores"}
                value={0}
                labelCol={{ span: 24 }}
                className={"!text-xl"}
                icon={
                  <FaUserPen className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                }
              />{" "}
              <Card
                name={"usuarios_visitantes"}
                label={"Usuários visitantes"}
                value={0}
                labelCol={{ span: 24 }}
                className={"!text-xl"}
                icon={
                  <FaUser className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                }
              />
            </div>
          </div>
        </CMS.Body>
      </div>
    </>
  );
}
