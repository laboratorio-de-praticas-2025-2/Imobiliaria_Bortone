"use client";
import MapaNavbar from "@/components/mapa/MapaNavbar";
import CarrosselMapa from "@/components/mapa/CarrosselMapa";
import { getImoveis } from "@/services/imoveisService";
import { mockImoveis } from "@/constants/imoveis";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import SidebarMenu from "@/components/mapa/SidebarMenu/SidebarMenu";
import SplashScreen from "@/components/SplashScreen";
import { Input } from "antd";
import OrderButton from "@/components/mapa/OrderButton";
import { FiltersProvider } from "@/context/FiltersContext";

const { Search } = Input;

const onSearch = (value) => console.log(value);

const MapView = dynamic(() => import("@/components/mapa/MapView"), { ssr: false });

export default function Mapa() {
  const [imoveis, setImoveis] = useState([]);
  const [hoverImovel, setHoverImovel] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    setImoveis(getImoveis());
  }, []);

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
      <MapaNavbar />
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
        <SidebarMenu />
      </div>
      <div className="absolute z-900 sm:bottom-0 sm:right-0 flex justify-center w-full md:justify-end h-fit">
        <CarrosselMapa imoveis={mockImoveis} />
      </div>
      <div className="map-container">
        <MapView
          imoveis={imoveis}
          hoverImovel={hoverImovel}
          setHoverImovel={setHoverImovel}
        />
      </div>
    </FiltersProvider>
  );
}
