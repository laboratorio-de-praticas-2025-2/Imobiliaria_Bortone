"use client";
import HomeNavbar from "@/components/home/HomeNavbar";
import Filtros from "@/components/vitrine/Filtros";
import { useFilterData } from "@/context/FilterDataContext";
import { Divider } from "antd";
import GridImoveis from "@/components/vitrine/GridImoveis";
import HomeFooter from "@/components/home/HomeFooter";
import { useEffect, useState } from "react";

export default function InnerImoveisPage({ imoveis }) {
  const [qtdImoveis, setQtdImoveis] = useState(0);

  useEffect(() => {
    setQtdImoveis(imoveis.length);
  }, [imoveis]);

  const {
    filterData: { regiao },
  } = useFilterData();

  return (
    <>
      <HomeNavbar />
      <Filtros />
      <Divider size="large" style={{ margin: 0 }} />
      <div className="py-11 px-3 md:px-17">
        <p className="text-xl text-[var(--primary)] font-bold">
          {qtdImoveis} imóveis disponíveis
        </p>
        <p className="text-xl text-[var(--primary)] font-bold">
          para venda em {regiao}
        </p>
      </div>
      <div className="pb-11 md:px-17 sm:px-3 px-0 flex justify-center">
        <GridImoveis imoveis={imoveis} />
      </div>
      <Divider size="large" style={{ margin: 0 }} />
      <HomeFooter />
    </>
  );
}
