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
        <Button
            onClick={handleClick}
            style={{
                width: "50px",
                height: "50px",
                background: "var(--background)",
                border: "var(--fog-gray) 2px solid",
                borderRadius: "1000px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "15px",
            }}
            className="!shadow-lg"
            icon={
                <span
                    style={{
                        display: "inline-block",
                        transition: "transform 0.3s",
                        transform: rotated ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                >
                    <HiArrowsUpDown size={20} color="374a8c" />
                </span>
            }
        />
    );
}