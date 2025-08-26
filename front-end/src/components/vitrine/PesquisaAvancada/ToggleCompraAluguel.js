"use client";
import { useState } from "react";

export default function ToggleCompraAluguel() {
    const [selected, setSelected] = useState("Alugar");
    const options = ["Alugar", "Comprar"];
    const selectedIndex = options.indexOf(selected);

    return (
        <div className="relative flex rounded-full border-2 border-[var(--primary)] overflow-hidden w-[220px] h-[40px]">
            {/* Slider animado */}
            <div
                className="absolute top-0 left-0 h-full w-1/2 bg-[var(--primary)] rounded-full transition-transform duration-300"
                style={{
                    transform: `translateX(${selectedIndex * 110}px)`, // 220px / 2 = 110px
                    zIndex: 1,
                }}
            />
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => setSelected(option)}
                    className={`flex-1 py-2 text-center transition-colors duration-200 rounded-full relative z-10
                        ${
                            selected === option
                                ? "!text-white"
                                : "!text-[var(--primary)]"
                        }`}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}
