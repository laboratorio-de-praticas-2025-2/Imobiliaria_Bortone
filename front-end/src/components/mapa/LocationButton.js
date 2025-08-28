"use client";

import { useState } from "react";
import { useMap } from "react-leaflet";

export default function LocationButton() {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 15); 
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao obter localização:", err);
        setLoading(false);
      },
      {
        enableHighAccuracy: true, 
        timeout: 10000,           
        maximumAge: 0             
      }
    );
  };

  return (
    <button className="locate-button" onClick={handleClick} disabled={loading}>
      {loading ? "🔄 Localizando..." : <Image src="/icons/seta.png" alt="Localizar" className="icone-localizacao" />}
    </button>
  );
}
