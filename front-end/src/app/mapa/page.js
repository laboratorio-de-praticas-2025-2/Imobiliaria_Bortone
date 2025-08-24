"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getImoveis } from "@/services/imoveisService";
import "@/app/styles/map.css";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Home() {
  const [imoveis, setImoveis] = useState([]);
  const [hoverImovel, setHoverImovel] = useState(null);

  useEffect(() => {
    setImoveis(getImoveis());
  }, []);

  return (
    <div>
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
