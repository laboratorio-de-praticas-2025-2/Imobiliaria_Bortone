/* eslint-disable @next/next/no-img-element */
"use client";

import "leaflet/dist/leaflet.css";
import React from "react";
import { Suspense, useMemo, useRef, useState } from "react";
import { handleImgError } from "@/utils/imageFallback";
import { buildImageUrl } from "@/utils/imageUtils";
import Image from "next/image";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import ImovelMarker from "./ImovelMarker";
import LocationButton from "./LocationButton";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

// Corrige o caminho dos ícones padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const casaIcon = new L.Icon({
  iconUrl: "images/icons/casa.png",
  iconSize: [38, 40],
  iconAnchor: [15, 30],
});

// Botões personalizados de zoom
function ZoomButtons() {
  const map = useMap();

  return (
    <div className="zoom-buttons">
      <button className="zoom-in" onClick={() => map.zoomIn()}>
        +
      </button>
      <button className="zoom-out" onClick={() => map.zoomOut()}>
        −
      </button>
    </div>
  );
}

export default function MapView({ imoveis }) {
  const [hoverImovel, setHoverImovel] = useState(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef(null);

  const handleHover = (imovel, map) => {
    // Limpa qualquer timeout pendente
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    setHoverImovel(imovel);
    const point = map.latLngToContainerPoint([
      imovel.latitude,
      imovel.longitude,
    ]);
    setCardPosition({ x: point.x, y: point.y });
  };

  const handleLeave = () => {
    // Limpa timeout anterior se existir
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Define um novo timeout para limpar o hover
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverImovel(null);
      hoverTimeoutRef.current = null;
    }, 100);
  };

  // Cleanup effect para limpar timeout quando componente for desmontado
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Gera uma key baseada nos IDs dos imóveis para forçar re-render quando a lista mudar
  const mapKey = useMemo(() => {
    if (!imoveis || imoveis.length === 0) return 'empty';
    return imoveis.map(i => i.id).sort().join('-');
  }, [imoveis]);

  console.log(`MapView renderizando com ${imoveis?.length || 0} imóveis`, { 
    mapKey, 
    imoveisInfo: imoveis?.map(i => ({ id: i.id, tipo: i.tipo, cidade: i.cidade })) 
  });

  return (
    <div 
      className="map-container"
      onMouseLeave={() => {
        // Limpa o hover quando o mouse sai do container do mapa
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
        setHoverImovel(null);
      }}
    >
      <MapContainer
        key={mapKey} // força remount se os imóveis mudarem
        center={[-23.5, -46.6]}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <MarkerClusterGroup
          chunkedLoading
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={true}
          maxClusterRadius={40}
        >
          {imoveis && imoveis.length > 0 ? (
            imoveis
              .filter(imovel => imovel.latitude && imovel.longitude) // Só renderiza imóveis com coordenadas válidas
              .map((imovel) => (
                <ImovelMarker
                  key={`${imovel.id}-${mapKey}`}
                  imovel={imovel}
                  icon={casaIcon}
                  onHover={handleHover}
                  onLeave={handleLeave}
                />
              ))
          ) : (
            // Nenhum marcador se não houver imóveis
            <></>
          )}
        </MarkerClusterGroup>

        <div className="map-controls">
          <div className="location-button-wrapper">
            <LocationButton />
          </div>
          <div className="zoom-button-wrapper">
            <ZoomButtons />
          </div>
        </div>
      </MapContainer>

      {hoverImovel && (
        <div
          className="hover-card"
          style={{
            left: `${cardPosition.x + 3.5}px`,
            top: `${cardPosition.y - 45}px`,
          }}
        >
          <img
            src={buildImageUrl(
              (hoverImovel.imagens && hoverImovel.imagens.length > 0 && hoverImovel.imagens[0].url_imagem) ||
              hoverImovel.imagem,
              'imovel',
              '/imovel1.png'
            )}
            alt="Imagem do imóvel"
            className="w-full h-32 object-cover mb-2 rounded"
            onError={handleImgError}
          />
          <a className="card-preco">
            <p>R$ {hoverImovel.preco.toLocaleString()}</p>
          </a>
          <a className="card-text">
            {hoverImovel.tipo} - {hoverImovel.endereco}
          </a>
        </div>
      )}
    </div>
  );
}
