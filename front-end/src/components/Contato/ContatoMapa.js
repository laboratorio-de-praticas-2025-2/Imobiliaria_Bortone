"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";

export default function ContatoMapa() {
  useEffect(() => {
    // Coordenadas do marcador
    const coordinates = [-24.49660419803683, -47.844100896162836];
    
    // Garante que não haja uma instância de mapa existente no elemento antes de inicializar.
    const container = L.DomUtil.get("leaflet-map");
    if (container != null) {
      container._leaflet_id = null;
    }

    // Inicializa o mapa com as coordenadas corretas e zoom 16
    const map = L.map("leaflet-map", {
      center: coordinates,
      zoom: 16,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <Link href="https://www.openstreetmap.org/copyright">OpenStreetMap</Link> contributors',
      maxZoom: 19,
    }).addTo(map);

    const iconHtml = ReactDOMServer.renderToString(
      <FaMapMarkerAlt size={38} color="#4c62ae" />
    );

    const customIcon = L.divIcon({
      html: iconHtml,
      className: "custom-react-icon",
      iconSize: [38, 38],
      iconAnchor: [19, 38],
    });

    L.marker(coordinates, { icon: customIcon }).addTo(map);

    // Força a atualização do mapa após renderização
    setTimeout(() => {
      map.invalidateSize();
      map.setView(coordinates, 16);
    }, 100);

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
