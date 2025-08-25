"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getImoveis } from "@/services/imoveisService";
import SidebarMenu from "@/components/SidebarMenu/SidebarMenu";
import CarrosselMapa from "@/components/CarrosselMapa";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Mapa() {
  const [imoveis, setImoveis] = useState([]);
  const [hoverImovel, setHoverImovel] = useState(null);

  useEffect(() => {
    setImoveis(getImoveis());
  }, []);

  return (
    <div>
      <div className="absolute z-1001">
        <SidebarMenu />
      </div>
      <div
        className="absolute z-1001 md:bottom-0 md:right-0 flex justify-center w-full md:justify-end"
      >
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
