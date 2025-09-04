 "use client"
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RentalByRegion() {
  const data = {
    labels: [
      "Região Central",
      "Região Sul",
      "Região Norte",
      "Região Leste",
      "Região Oeste"
    ],
    datasets: [
      {
        data: [45, 25, 15, 10, 5], // proporções de exemplo
        backgroundColor: [
          "#324587", // azul Central
          "#F39200", // laranja Sul
          "#BEB2BC", // lilás Norte
          "#A5A7A6", // cinza Leste
          "#FF3131"  // vermelho Oeste
        ],
        borderWidth: 0,
        cutout: "50%" // circulo do meio
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          boxWidth: 20
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div
      className="group h-[300px] !w-full flex items-center rounded-xl px-10 !bg-[#EEF0F9] !shadow-md"
    >
      <div className="grid grid-col content-evenly w-full h-full">
        <span className="text-2xl font-bold lg:text-center text-[var(--primary)] ">
          Proporção de locações por região
        </span>

        <div className="items-center justify-items-center w-full h-full">
          <div className="w-fit h-fit">
            <Doughnut data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
