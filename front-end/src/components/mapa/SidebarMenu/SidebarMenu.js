"use client";

import { useState } from "react";
import MenuCasa from './MenuCasa';
import MenuTerreno from './MenuTerreno';

export default function SidebarMenu() {
  const [propertyType, setPropertyType] = useState("Casa");

  return (
    <div className="h-screen w-100 bg-gradient-to-b from-[#2E3F7C] to-[#0C1121] pt-7 px-8 overflow-auto scrollbar-thin scrollbar-thumb-[#3C54A9] scrollbar-track-transparent">
      {propertyType === "Casa" && (
        <MenuCasa activeType={propertyType} setActiveType={setPropertyType} />
      )}
      {propertyType === "Terreno" && (
        <MenuTerreno
          activeType={propertyType}
          setActiveType={setPropertyType}
        />
      )}
    </div>
  );
}
