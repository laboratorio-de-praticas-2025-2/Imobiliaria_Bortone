/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import LocationButton from "@/components/mapa/LocationButton";

// Botões personalizados de zoom
function ZoomButtons() {
  const map = useMap();

  return (
    <div className="zoom-buttons">
      <button className="zoom-in" onClick={() => map.zoomIn()}>
        +
      </button>
      <button className="zoom-out" onClick={() => map.zoomOut()}>
        -
      </button>
    </div>
  );
}

export default function MapPick() {
  return (
    <div className="h-full">
      <MapContainer
        center={[-24.4886, -47.8442]}
        zoom={12}
        scrollWheelZoom={true}
        zoomControl={false} // desativa zoom padrão
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <div className="map-controls">
          <div className="location-button-wrapper">
            <LocationButton />
          </div>
          <div className="zoom-button-wrapper">
            <ZoomButtons />
          </div>
        </div>
      </MapContainer>
    </div>
  );
}
