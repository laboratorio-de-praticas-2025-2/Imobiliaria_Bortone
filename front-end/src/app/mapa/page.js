"use client";
import MenuWrapper from "@/components/mapa/SidebarMenu/MenuWrapper";
import MapaNavbar from "@/components/mapa/MapaNavbar";
import CarrosselMapa from "@/components/mapa/CarrosselMapa";
import { getImoveis } from "@/services/imoveisService";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MapView = dynamic(() => import("@/components/mapa/MapView"), { ssr: false });

export default function Mapa() {
  const [imoveis, setImoveis] = useState([]);
  const [hoverImovel, setHoverImovel] = useState(null);

  useEffect(() => {
    setImoveis(getImoveis());
  }, []);

  return (
    <div>
      <MapaNavbar />
      <div className="absolute z-1002">
        <MenuWrapper />
      </div>
      <div className="absolute z-1001 md:bottom-0 md:right-0 flex justify-center w-full md:justify-end">
        <CarrosselMapa imoveis={imoveis} />
      </div>
      <div className="map-container">
        <MapView
          imoveis={imoveis}
          hoverImovel={hoverImovel}
          setHoverImovel={setHoverImovel}
        />
      </div>
    </div>
  );
}
