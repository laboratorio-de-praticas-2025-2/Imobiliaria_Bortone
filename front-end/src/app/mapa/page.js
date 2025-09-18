"use client";
import CarrosselMapa from "@/components/mapa/CarrosselMapa";
import MapaNavbar from "@/components/mapa/MapaNavbar";
import OrderButton from "@/components/mapa/OrderButton";
import SidebarMenu from "@/components/mapa/SidebarMenu/SidebarMenu";
import SplashScreen from "@/components/SplashScreen";
import { FiltersProvider } from "@/context/FiltersContext";
import { mockImoveis } from "@/mock/imoveis";
import { getImoveis } from "@/services/imoveisService";
import { Input } from "antd";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { getSEOConfig } from "@/config/seo";
import "dotenv/config";
import HomeNavbar from "@/components/home/HomeNavbar";

const { Search } = Input;

const onSearch = (value) => console.log(value);

const MapView = dynamic(() => import("@/components/mapa/MapView.client"), {

  ssr: false,
});

export default function Mapa() {
  useSEO(getSEOConfig("/mapa"));
  const [imoveis, setImoveis] = useState([]);
  const [imoveisCarrossel, setImoveisCarrossel] = useState([]);
  const [imoveisMapa, setImoveisMapa] = useState([]);
  const [hoverImovel, setHoverImovel] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  const onSearch = async (value) => {
    console.log("Buscando imóveis para:", value);
    const endereco = {
      endereco: value,
    };
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/search/mapa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(endereco),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data) {
          // Atualize os estados com os dados retornados da API
          setImoveisCarrossel(data.propriedades.carrossel || []);
          setImoveisMapa(data.propriedades.mapa || []);
        }
      } else {
        console.error("Erro ao buscar imóveis:", response.statusText);
      }
    } catch (error) {
      console.error("Erro na requisição de busca:", error);
    }
  };

  // useEffect(() => {
  //   setImoveis(getImoveis());
  // }, []);

  useEffect(() => {
    if (showSplash) {
      const timer1 = setTimeout(() => setAnimateOut(true), 2000);
      const timer2 = setTimeout(() => setShowSplash(false), 1500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen animateOut={animateOut} />;
  }

  return (
    <FiltersProvider>
      <HomeNavbar />
      <div className="absolute z-1002 ml-90 mt-4.5 lg:flex hidden w-[52%]">
        <Search
          placeholder="Pesquisar"
          onSearch={onSearch}
          style={{ width: "50%" }}
          allowClear
          className="nav-search-map"
        />
        <OrderButton onToggle={() => console.log("Ordenar")} />
      </div>
      <div className="absolute z-1002">
        <SidebarMenu
          setImoveisMapa={setImoveisMapa}
          setImoveisCarrossel={setImoveisCarrossel}
        />
      </div>
      <div className="absolute z-900 sm:bottom-0 sm:right-0 flex justify-center w-full md:justify-end h-fit">
        <CarrosselMapa imoveis={imoveisCarrossel} />
      </div>
      <div className="map-container">
        <MapView
          imoveis={imoveisMapa}
          hoverImovel={hoverImovel}
          setHoverImovel={setHoverImovel}
        />
      </div>
    </FiltersProvider>
  );
}
