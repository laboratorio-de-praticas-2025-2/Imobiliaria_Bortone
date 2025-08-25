"use client";

import { useState } from "react";
import SidebarMenu from "./SidebarMenu";
import MenuTerreno from "./MenuTerreno";

export default function MenuWrapper() {
  const [propertyType, setPropertyType] = useState("Casa");

  return (
    <>
      {propertyType === "Casa" ? (
        <SidebarMenu setPropertyType={setPropertyType} />
      ) : (
        <MenuTerreno setPropertyType={setPropertyType} />
      )}
    </>
  );
}
