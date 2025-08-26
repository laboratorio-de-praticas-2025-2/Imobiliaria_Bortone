import { useState } from "react";

export default function useMapHover() {
  const [hoveredImovel, setHoveredImovel] = useState(null);

  const onHover = (imovel) => setHoveredImovel(imovel);
  const onLeave = () => setHoveredImovel(null);

  return { hoveredImovel, onHover, onLeave };
}