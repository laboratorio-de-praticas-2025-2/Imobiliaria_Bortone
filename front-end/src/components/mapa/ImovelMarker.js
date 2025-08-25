import { Marker, useMap } from "react-leaflet";

export default function ImovelMarker({ imovel, icon, onHover, onLeave }) {
  const map = useMap();

  return (
    <Marker
      position={[imovel.latitude, imovel.longitude]}
      icon={icon}
      eventHandlers={{
        mouseover: () => onHover(imovel, map),
        mouseout: () => onLeave(),
      }}
    />
  );
}
