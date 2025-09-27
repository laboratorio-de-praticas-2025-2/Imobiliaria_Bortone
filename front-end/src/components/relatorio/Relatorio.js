import Image from "next/image";
import Card from "@/components/relatorio/Card.js";
import { FaUserPlus, FaUserPen, FaUser, FaHouseChimney } from "react-icons/fa6";
import "../../styles/relatorio.css";
import { FaCheckSquare } from "react-icons/fa";
import { BsFillBuildingFill } from "react-icons/bs";
import { MdOutlineBedroomParent, MdTerrain } from "react-icons/md";
import { PiCoinsFill } from "react-icons/pi";

export default function Relatorio({ data }) {
  const currDate = new Date().toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Safety check to ensure data exists
  if (!data) {
    return <div>Carregando dados do relatório...</div>;
  }

  return (
    <>
      {/* Página 1 */}
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

        <h2 className="title">Relatório de Imóveis</h2>

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
          <canvas id="grafico-colunas-imoveis"></canvas>
        </div>
        <footer>1</footer>
      </div>

      {/* Página 2 */}
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

        <h2 className="title">Relatório de Locações</h2>

        <div className="card-content">
          <div className="grid grid-cols-1 content-between gap-6 h-full">
            <Card
              name={"locacoes"}
              label={"Total de imóveis disponíveis para locação"}
              className={"!text-3xl"}
              value={data.alugueis?.totalLocacao || 0}
              labelCol={{ span: 24 }}
              icon={
                <MdOutlineBedroomParent className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl" />
              }
            />
          </div>
        </div>

        <footer>2</footer>
      </div>

      {/* Página 3 */}
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
        <h2 className="title">Relatório de Vendas</h2>

        <div className="card-content">
          <div className="grid grid-cols-1 content-between gap-6 h-full">
            <Card
              name={"vendas"}
              label={"Total de imóveis disponíveis para venda"}
              className={"!text-xl"}
              value={data.vendas?.totalVenda || 0}
              labelCol={{ span: 24 }}
              icon={
                <PiCoinsFill className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl" />
              }
            />
          </div>
        </div>

        <footer>3</footer>
      </div>

      {/* Página 4 */}
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

        <footer>4</footer>
      </div>
    </>
  );
}
