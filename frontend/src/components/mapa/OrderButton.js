"use client";
import { useState } from "react";
import { Button } from "antd";
import { HiArrowsUpDown } from "react-icons/hi2";

export default function OrderButton({ onToggle }) {
    const [rotated, setRotated] = useState(false);

    const handleClick = () => {
        setRotated((prev) => !prev);
        if (onToggle) onToggle();
    };

    return (
      <Button onClick={handleClick} className="!shadow-lg order-button">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            transition: "transform 0.3s",
          }}
        >
          <span className="text-[#374A8C57] font-bold hidden lg:flex">
            Ordenar: <span className="text-[var(--primary)]">Relevância</span>
          </span>
          <span
            style={{
              display: "inline-flex",
              transition: "transform 0.3s",
              transform: rotated ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <HiArrowsUpDown size={20} color="374a8c" />
          </span>
        </span>
      </Button>
    );
}