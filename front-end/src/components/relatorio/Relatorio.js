import Image from "next/image";
import Card from "@/components/relatorio/Card.js";
import { FaUserPlus, FaUserPen, FaUser, FaHouseChimney } from "react-icons/fa6";
import "../../styles/relatorio.css";
import { FaCheckSquare } from "react-icons/fa";
import { BsFillBuildingFill } from "react-icons/bs";
import { MdOutlineBedroomParent, MdTerrain } from "react-icons/md";
import { PiCoinsFill } from "react-icons/pi";
import LineGraph from "./LineGraph";
import PizzaGraph from "./PizzaGraph";

export default function Relatorio({ data }) {
  let pageNumber = 1;

  const currDate = new Date().toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const dataLocacaoPorTipo = data?.alugueis?.alugueisPorTipo
    ? {
        labels: data.alugueis.alugueisPorTipo.map((v) => v.tipoImovel),
        datasets: [
          {
            data: data.alugueis.alugueisPorTipo.map((v) => v.quantidade),
            backgroundColor: ["#243B7B", "#F39C12", "#E74C3C"],
            borderWidth: 1,
            cutout: "0%",
          },
        ],
      } : { labels: [], datasets: [] };

      const dataVendasPorTipo = data?.vendas?.vendasPorTipo
    ? {
        labels: data.vendas.vendasPorTipo.map((v) => v.tipoImovel),
        datasets: [
          {
            data: data.vendas.vendasPorTipo.map((v) => v.quantidade),
            backgroundColor: ["#243B7B", "#F39C12", "#E74C3C"],
            borderWidth: 1,
            cutout: "0%",
          },
        ],
      } : { labels: [], datasets: [] };

  const distribuicaoImoveisPorPreco =   data?.imoveis?.imoveisPorPreco
  ? {
    labels: [
      "até R$300.00",
      "entre R$300.000 e R$600.000",
      "maior que R$600.000",
    ],
    datasets: [
      {
        data: data.imoveis?.imoveisPorPreco.map((v) => v.quantidade),
        backgroundColor: ["#118C4F", "#F1EB9C", "#FF7276"],
        borderWidth: 1,
        cutout: "0%",
      },
    ],
  } : { labels: [], datasets: [] };

  // Safety check to ensure data exists
  if (!data) {
    return <div>Carregando dados do relatório...</div>;
  }

  return (
    <>
      {/* Página Imóveis */}
      {data?.imoveis && (
        <div className="page">
          <header>
            <Image
              src="/images/LogoAzul.svg"
              alt="Logo Bortone"
              width={180}
              height={50}
            />
            <div className="header-meta">Emitido em: {currDate}</div>
          </header>
          <div>
            <h1 className="main-title">Relatório - Imobiliária Bortone</h1>
            <h2 className="title">Imóveis</h2>
          </div>

          <div className="card-container">
            <div className="grid grid-cols-2 content-between gap-6 h-full">
              <Card
                name={"imoveis_disponiveis"}
                label={"Total de imóveis disponíveis"}
                value={data.imoveis?.totalImoveis || 0}
                labelCol={{ span: 24 }}
                className={"!text-lg"}
                icon={
                  <FaCheckSquare className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl" />
                }
              />
              <Card
                name={"apartamentos_disponiveis"}
                label={"Apartamentos disponíveis"}
                value={data.imoveis?.totalApartamentos || 0}
                labelCol={{ span: 24 }}
                className={"!text-lg"}
                icon={
                  <BsFillBuildingFill className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl" />
                }
              />
            </div>
            <div className="grid grid-cols-2 content-between gap-6 h-full">
              <Card
                name={"casas_disponiveis"}
                label={"Casas disponíveis"}
                value={data.imoveis?.totalCasas || 0}
                labelCol={{ span: 24 }}
                className={"!text-lg"}
                icon={
                  <FaHouseChimney className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl" />
                }
              />
              <Card
                name={"terrenos_disponiveis"}
                label={"Terrenos disponíveis"}
                value={data.imoveis?.totalTerrenos || 0}
                labelCol={{ span: 24 }}
                className={"!text-lg"}
                icon={
                  <MdTerrain className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl" />
                }
              />
            </div>
          </div>

          <div className="chart-container">
            <PizzaGraph
              label={"Distribuição de imóveis por faixa de preço"}
              className={"w-[450px] h-[300px]"}
              data={distribuicaoImoveisPorPreco}
            />
          </div>

          <div className="chart-container"></div>
          <footer>{pageNumber++}</footer>
        </div>
      )}

      {/* Página alugueis */}
      {data?.alugueis && (
        <div className="page">
          <header>
            <Image
              src="/images/LogoAzul.svg"
              alt="Logo Bortone"
              width={180}
              height={50}
            />
            <div className="header-meta">Emitido em: {currDate}</div>
          </header>

          <h2 className="title">Locações</h2>

          <div className="card-content">
            <div className="grid grid-cols-2 content-between gap-6 h-full">
              <div className="cols-span-1">
                <Card
                  name={"locacoes"}
                  label={"Total de imóveis disponíveis para locação"}
                  className={"!text-lg"}
                  value={data.alugueis?.totalLocacao || 0}
                  labelCol={{ span: 24 }}
                  icon={
                    <MdOutlineBedroomParent className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl" />
                  }
                />
              </div>
              <div className="cols-span-1">
                <PizzaGraph
                  label={"Distribuição de imóveis alugados por categoria"}
                  className={"h-[200px] w-[200px]"}
                  data={dataLocacaoPorTipo}
                />
              </div>
            </div>
          </div>

          <div className="chart-container">
            <LineGraph
              label="Evolução das locações nos últimos 12 meses"
              graphData={data.alugueis?.alugueisPorMes}
            />
          </div>

          <footer>{pageNumber++}</footer>
        </div>
      )}

      {/* Página Vendas */}
      {data?.vendas && (
        <div className="page">
          <header>
            <Image
              src="/images/LogoAzul.svg"
              alt="Logo Bortone"
              width={180}
              height={50}
            />
            <div className="header-meta">Emitido em: {currDate}</div>
          </header>
          <h2 className="title">Vendas</h2>

          <div className="card-content">
            <div className="grid grid-cols-2 content-between gap-6 h-full">
              <div className="cols-span-1">
                <Card
                  name={"vendas"}
                  label={"Total de imóveis disponíveis para venda"}
                  className={"!text-lg"}
                  value={data.vendas?.totalVenda || 0}
                  labelCol={{ span: 24 }}
                  icon={
                    <PiCoinsFill className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl" />
                  }
                />
              </div>
              <div className="cols-span-1">
                <PizzaGraph
                  label={"Distribuição de imóveis vendidos por categoria"}
                  className={"h-[200px] w-[200px]"}
                  data={dataVendasPorTipo}
                />
              </div>
            </div>
          </div>

          <div className="chart-container">
            <LineGraph
              label="Evolução das vendas nos últimos 12 meses"
              graphData={data.vendas?.vendasPorTipoMes}
            />
          </div>

          <footer>{pageNumber++}</footer>
        </div>
      )}

      {/* Página Usuários */}
      {data?.usuarios && (
        <div className="page">
          <header>
            <Image
              src="/images/LogoAzul.svg"
              alt="Logo Bortone"
              width={180}
              height={50}
            />
            <div className="header-meta">Emitido em: {currDate}</div>
          </header>

          <h2 className="title">Relatório de Usuários</h2>

          <div className="card-content">
            <div className="grid grid-flow-col grid-rows-3 gap-6 h-full items-start">
              <Card
                name={"usuarios_cadastrados"}
                label={"Total de usuários cadastrados"}
                value={data.usuarios?.totalUsuarios || 0}
                labelCol={{ span: 24 }}
                className={"!text-xl"}
                icon={
                  <FaUserPlus className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl" />
                }
              />
              <Card
                name={"usuarios_administradores"}
                label={"Usuários administradores"}
                value={data.usuarios?.totalAdministradores || 0}
                labelCol={{ span: 24 }}
                className={"!text-xl"}
                icon={
                  <FaUserPen className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl" />
                }
              />
              <Card
                name={"casas_visitantes"}
                label={"Usuários visitantes"}
                value={data.usuarios?.totalVisitantes || 0}
                labelCol={{ span: 24 }}
                className={"!text-xl"}
                icon={
                  <FaUser className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl" />
                }
              />
            </div>
          </div>

          <footer>{pageNumber++}</footer>
        </div>
      )}
    </>
  );
}
