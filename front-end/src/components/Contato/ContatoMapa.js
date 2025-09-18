"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";

export default function ContatoMapa() {
  useEffect(() => {
    // Garante que não haja uma instância de mapa existente no elemento antes de inicializar.
    const container = L.DomUtil.get("leaflet-map");
    if (container != null) {
      container._leaflet_id = null;
    }

    const map = L.map("leaflet-map").setView([-24.491917, -47.848722], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const iconHtml = ReactDOMServer.renderToString(
      <FaMapMarkerAlt size={38} color="#C0392B" />
    );

    const customIcon = L.divIcon({
      html: iconHtml,
      className: "custom-react-icon", 
      iconSize: [38, 38], 
      iconAnchor: [19, 38], 
    });

    L.marker([-24.491917, -47.848722], { icon: customIcon }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      id="leaflet-map"
      className="w-full h-full rounded-2xl overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105"
    ></div>
  );
}