import { Marker, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";

export default function ImovelMarker({ imovel, icon, onHover, onLeave }) {
  const markerRef = useRef();
  const map = useMap();

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const leafletMarker = marker;

    leafletMarker.on("mouseover", () => onHover(imovel, map));
    leafletMarker.on("mouseout", () => onLeave());

    return () => {
      leafletMarker.off("mouseover");
      leafletMarker.off("mouseout");
    };
  }, [imovel, map, onHover, onLeave]);

  return (
    <Marker
      position={[imovel.latitude, imovel.longitude]}
      icon={icon}
      ref={markerRef}
    />
  );
}
