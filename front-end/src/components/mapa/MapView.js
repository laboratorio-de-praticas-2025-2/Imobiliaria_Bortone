/* eslint-disable @next/next/no-img-element */
"use client";

import "leaflet/dist/leaflet.css";
import React from "react";
import { useState } from "react";
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

  const handleHover = (imovel, map) => {
    setHoverImovel(imovel);
    const point = map.latLngToContainerPoint([
      imovel.latitude,
      imovel.longitude,
    ]);
    setCardPosition({ x: point.x, y: point.y });
  };

  const handleLeave = () => {
    setTimeout(() => setHoverImovel(null), 100); // delay para evitar flicker
  };

  return (
    <div className="map-container">
      <MapContainer
        key={JSON.stringify(imoveis.map((i) => i.id))} // força remount se os imóveis mudarem
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
          {imoveis.map((imovel) => (
            <ImovelMarker
              key={imovel.id}
              imovel={imovel}
              icon={casaIcon}
              onHover={handleHover}
              onLeave={handleLeave}
            />
          ))}
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
            src={hoverImovel.imagem}
            alt="Imagem do imóvel"
            className="w-full h-32 object-cover mb-2 rounded"
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
