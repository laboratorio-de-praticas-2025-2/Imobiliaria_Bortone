"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LocationButton from "@/components/mapa/LocationButton";

/* Corrige ícone padrão do Leaflet (usa CDN para evitar problemas em Next.js) */
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

/* Botões de zoom customizados (usa useMap dentro do contexto do mapa) */
function ZoomButtons() {
  const map = useMap();
  return (
    <div className="zoom-buttons absolute top-2 right-2 z-30 flex flex-col gap-2">
      <button
        type="button"
        className="w-8 h-8 rounded bg-white shadow flex items-center justify-center"
        onClick={() => map.zoomIn()}
      >
        +
      </button>
      <button
        type="button"
        className="w-8 h-8 rounded bg-white shadow flex items-center justify-center"
        onClick={() => map.zoomOut()}
      >
        −
      </button>
    </div>
  );
}

/* Captura clique no mapa, seta form e retorna posição para o pai */
function ClickHandler({ form, onSetPos }) {
  const map = useMapEvents({
    click(e) {
      const lat = Number(e.latlng.lat.toFixed(6));
      const lng = Number(e.latlng.lng.toFixed(6));

      if (form && typeof form.setFieldsValue === "function") {
        form.setFieldsValue({ latitude: lat, longitude: lng });
        console.log("form values after set:", form.getFieldValue("latitude"), form.getFieldValue("longitude"));
      } else {
        console.log("form undefined or no setFieldsValue");
      }
      // centraliza o mapa no ponto clicado mantendo o zoom atual
      map.setView([lat, lng], map.getZoom(), { animate: true });

      if (onSetPos) onSetPos([lat, lng]);
    },
  });
  return null;
}


export default function MapPick({ form, initialCenter = [-24.4886, -47.8442], initialZoom = 12 }) {
  const [pos, setPos] = useState(null);

  // se o form já tiver valores de latitude/longitude, inicializa o marcador
  useEffect(() => {
    if (!form) return;
    const lat = form.getFieldValue?.("latitude");
    const lng = form.getFieldValue?.("longitude");
    if (lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng)) {
      setPos([Number(lat), Number(lng)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={pos ?? initialCenter}
        zoom={initialZoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <ClickHandler form={form} onSetPos={setPos} />

        {pos && <Marker position={pos} />}

        <div className="map-controls pointer-events-none">
          <div className="location-button-wrapper pointer-events-auto absolute left-2 bottom-2 z-30">
            <LocationButton />
          </div>
        </div>

        <ZoomButtons />
      </MapContainer>
    </div>
  );
}
