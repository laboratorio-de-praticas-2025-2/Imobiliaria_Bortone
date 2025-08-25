"use client";
import React, { useState } from "react";
import { Button } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";

export default function MenuToggleButton({ onToggle }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
    if (onToggle) onToggle(!open); // se quiser notificar o pai
  };

  return (
    <Button
      onClick={handleClick}
      style={{
        width: "50px",
        height: "50px",
        minWidth: "40px",
        background: "var(--background)",
        border: "var(--fog-gray) 2px solid",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
      icon={
        open ? (
          <CloseOutlined style={{ fontSize: 20, color: "#374a8c" }} />
        ) : (
          <MenuOutlined style={{ fontSize: 20, color: "#374a8c" }} />
        )
      }
    />
  );
}