"use client";
import HomeNavbar from "@/components/home/HomeNavbar";
import Filtros from "@/components/vitrine/Filtros";
import { useFilterData } from "@/context/FilterDataContext";
import { Divider } from "antd";

export default function InnerImoveisPage({ qtdImoveis }) {
  const {
    filterData: { regiao },
  } = useFilterData();

  return (
    <>
      <HomeNavbar />
      <Filtros />
      <Divider size="large" style={{ margin: 0 }} />
      <div className="py-11 md:px-17 px-0">
        <p className="text-xl text-[var(--primary)] font-bold">
          {qtdImoveis} imóveis disponíveis
        </p>
        <p className="text-xl text-[var(--primary)] font-bold">
          para venda em {regiao}
        </p>
      </div>
    </>
  );
}
