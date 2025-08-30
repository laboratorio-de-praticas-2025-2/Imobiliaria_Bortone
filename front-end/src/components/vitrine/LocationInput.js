"use client";
import { useFilterData } from "@/context/FilterDataContext";
import { useEffect, useRef } from "react";
import { PiMapPinFill } from "react-icons/pi";

export default function LocationInput() {
  const inputRef = useRef(null);
  const { updateFilterData } = useFilterData();

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["(cities)"], // pode ser ['geocode'] para endereços completos
        componentRestrictions: { country: "br" },
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const addressComponents = place.address_components || [];

      let city = "";
      let state = "";

      addressComponents.forEach((component) => {
        if (component.types.includes("administrative_area_level_2")) {
          city = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
          state = component.long_name;
        }
      });

      const formattedAddress =
        city && state ? `${city}, ${state}` : city || state;

      // Atualiza a localização no contexto global
      updateFilterData({ regiao: formattedAddress });

      console.log("Endereço selecionado:", formattedAddress);
      console.log("Latitude:", place.geometry?.location.lat());
      console.log("Longitude:", place.geometry?.location.lng());
    });

  }, [updateFilterData]);

  return (
    <div className="w-[23vw]">
      <div className="w-full relative">
        {/* Ícone de localização */}
        <PiMapPinFill className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--primary)] w-4 h-4" />

        {/* Input com valor inicial */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Registro, São Paulo, Brasil"
          className="w-full rounded-3xl pl-10 pr-4 py-2 bg-[#EEF0F9] border-0 !text-[var(--primary)] !placeholder-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
        />
      </div>
    </div>
  );
}
