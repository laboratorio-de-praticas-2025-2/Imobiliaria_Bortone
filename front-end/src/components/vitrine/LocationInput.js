"use client";
import { useEffect, useRef } from "react";
import { PiMapPinFill } from "react-icons/pi";

export default function LocationInput() {
  const inputRef = useRef(null);

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
      console.log("Endereço selecionado:", place.formatted_address);
      console.log("Latitude:", place.geometry?.location.lat());
      console.log("Longitude:", place.geometry?.location.lng());
    });
  }, []); 

  return (
    <div className="w-full max-w-lg">
      <div className="w-full max-w-lg relative">
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
