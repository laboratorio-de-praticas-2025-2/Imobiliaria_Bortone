"use client";
import HomeNavbar from "@/components/home/HomeNavbar";
import Filtros from "@/components/vitrine/Filtros";
import { useFilterData } from "@/context/FilterDataContext";
import { Divider } from "antd";
import GridImoveis from "@/components/vitrine/GridImoveis";
import HomeFooter from "@/components/home/HomeFooter";
import { useEffect, useState } from "react";



export default function InnerImoveisPage({ imoveis = [], pagination = {}, loading, onPageChange = ()=>{}, searchedCity = "" }) {
  const [qtdImoveis, setQtdImoveis] = useState(0);

  useEffect(() => {
    setQtdImoveis(imoveis.length);
  }, [imoveis]);


  const {
    filterData: { endereco },
  } = useFilterData();

  return (
    <>
      <HomeNavbar />
      <Filtros />
      <Divider size="large" style={{ margin: 0 }} />
      <div className="py-11 px-3 md:px-17">
        <p className="text-xl text-[var(--primary)] font-bold">

          
          {pagination?.totalCount ?? qtdImoveis} imóveis disponíveis
        </p>
        <p className="text-xl text-[var(--primary)] font-bold">
          {searchedCity ? `em ${searchedCity}` : ''}

        </p>
        {loading && (
          <p className="text-sm text-gray-500 mt-2">
            Carregando imóveis...
          </p>
        )}
      </div>
      <div className="pb-11 md:px-17 sm:px-3 px-0 flex justify-center">


        <GridImoveis
          imoveis={imoveis}
          pagination={pagination}
          onPageChange={onPageChange}


        />
      </div>
      <Divider size="large" style={{ margin: 0 }} />
      <HomeFooter />
    </>
  );
}
