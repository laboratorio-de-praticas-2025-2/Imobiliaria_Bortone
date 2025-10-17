"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LocationButton from "@/components/mapa/LocationButton";
import { useGeocoding } from "@/hooks/useGeocoding";
import { message } from "antd";

/* Corrige ícone padrão do Leaflet (usa CDN para evitar problemas em Next.js) */
let DefaultIcon;
try {
  DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  L.Marker.prototype.options.icon = DefaultIcon;
} catch (error) {
  console.warn("Erro ao carregar ícone do marcador:", error);
  // Fallback para ícone SVG inline
  DefaultIcon = L.divIcon({
    html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
    className: 'custom-map-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  L.Marker.prototype.options.icon = DefaultIcon;
}

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
function ClickHandler({ form, onSetPos, onLocationFound }) {
  const map = useMapEvents({
    async click(e) {
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
      
      // Chamar geocodificação reversa
      if (onLocationFound) {
        onLocationFound(lat, lng);
      }
    },
  });
  return null;
}

/* Componente para atualizar o centro do mapa quando necessário */
function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && center[0] !== undefined && center[1] !== undefined) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  
  return null;
}


export default function MapPick({ 
  form, 
  initialCenter = [-24.4886, -47.8442], 
  initialZoom = 12,
  onCityStateFound // Callback para retornar cidade e estado encontrados
}) {
  const [pos, setPos] = useState(null);
  const [mapCenter, setMapCenter] = useState(initialCenter);
  const { reverseGeocode, loading } = useGeocoding();

  // Função para buscar cidade/estado a partir das coordenadas
  const handleLocationFound = async (lat, lng) => {
    try {
      const locationData = await reverseGeocode(lat, lng);
      
      if (locationData && locationData.cidade && locationData.estado) {
        console.log("📍 Local encontrado:", locationData);
        
        // Notificar o usuário
        message.success(`Local: ${locationData.cidade} - ${locationData.estado}`);
        
        // Callback para o componente pai
        if (onCityStateFound) {
          onCityStateFound({
            cidade: locationData.cidade,
            estado: locationData.estado,
            bairro: locationData.bairro,
            rua: locationData.rua,
            endereco_completo: locationData.endereco_completo
          });
        }
      } else {
        message.warning("Não foi possível identificar a cidade neste local");
      }
    } catch (error) {
      console.error("Erro na geocodificação reversa:", error);
      message.error("Erro ao buscar localização");
    }
  };

  // se o form já tiver valores de latitude/longitude, inicializa o marcador
  useEffect(() => {
    if (!form) return;
    
    const checkFormValues = () => {
      const lat = form.getFieldValue?.("latitude");
      const lng = form.getFieldValue?.("longitude");
      
      if (lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng)) {
        const newPos = [Number(lat), Number(lng)];
        setPos(newPos);
        setMapCenter(newPos);
        console.log("MapPick: Posição definida a partir do form:", newPos);
      }
    };

    // Verificar imediatamente
    checkFormValues();
    
    // Verificar novamente após um pequeno delay para garantir que o form foi atualizado
    const timeout = setTimeout(checkFormValues, 100);
    
    return () => clearTimeout(timeout);
  }, [form]);

  // Observar mudanças nos valores do form
  useEffect(() => {
    if (!form) return;

    const interval = setInterval(() => {
      const lat = form.getFieldValue?.("latitude");
      const lng = form.getFieldValue?.("longitude");
      
      if (lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng)) {
        const newPos = [Number(lat), Number(lng)];
        const currentPos = pos;
        
        // Só atualizar se a posição realmente mudou
        if (!currentPos || currentPos[0] !== newPos[0] || currentPos[1] !== newPos[1]) {
          setPos(newPos);
          setMapCenter(newPos);
          console.log("MapPick: Posição atualizada via form:", newPos);
        }
      }
    }, 500); // Verifica a cada 500ms

    return () => clearInterval(interval);
  }, [form, pos]);

  return (
    <div className="h-full w-full relative">
      {loading && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50 bg-white px-4 py-2 rounded shadow-lg">
          Buscando localização...
        </div>
      )}
      <MapContainer
        center={mapCenter}
        zoom={initialZoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
        key={`${mapCenter[0]}-${mapCenter[1]}`} // Force re-render when center changes
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <ClickHandler form={form} onSetPos={setPos} onLocationFound={handleLocationFound} />
        <MapUpdater center={pos} />

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
