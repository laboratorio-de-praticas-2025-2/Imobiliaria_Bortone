"use client";

import { useState } from "react";
import MenuCasa from "./MenuCasa";
import MenuTerreno from "./MenuTerreno";

export default function SidebarMenu() {
  const [propertyType, setPropertyType] = useState("Casa");

  return (
    <div
      className="
        h-full 
        md:bg-gradient-to-b from-[#2E3F7C] to-[#0C1121] 
         
        justify-self-center
        scrollbar-track-transparent
        max-w-80
        pt-14
        md:hidden
      "
    >
      <h1
        className="md:hidden justify-self-center menu-label pb-1 "
        style={{ fontSize: "25px" }}
      >
        {" "}
        Filtros
      </h1>
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
