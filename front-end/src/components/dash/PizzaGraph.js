"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Spin } from "antd";

// Import dinâmico do Doughnut Chart
const Doughnut = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  { ssr: false }
);

// Registrar os elementos do Chart.js (uma única vez)
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PizzaGraph({
  data,
  label,
  options,
  className,
  loading,
}) {
  const [chartData, setChartData] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Aguarda montagem e define dados válidos
  useEffect(() => {
    if (!isClient || !data || !data.datasets) return;

    const timer = setTimeout(() => {
      const hasValidData = data.datasets.some(
        (d) =>
          Array.isArray(d.data) &&
          d.data.length > 0 &&
          d.data.some((val) => val > 0)
      );

      if (hasValidData) {
        setChartData(data);
      } else {
        setChartData({
          labels: ["Sem dados"],
          datasets: [
            {
              data: [1],
              backgroundColor: ["#E5E5E5"],
              borderWidth: 0,
              cutout: "0%",
            },
          ],
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [data, isClient]);

  // Opções seguras para o gráfico
  const safeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
    },
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: false,
          boxHeight: 18,
          color: "black",
          boxWidth: 18,
        },
      },
    },
    ...options,
  };

  if (!isClient) {
    return (
      <div
        className={`group h-full w-full flex items-center rounded-xl px-4 bg-[#EEF0F9] shadow-md ${className}`}
      >
        <div className="flex items-center justify-center w-full h-64">
          <Spin tip="Carregando..." />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`group h-full w-full flex items-center rounded-xl px-4 bg-[#EEF0F9] shadow-md ${className}`}
    >
      <div className="grid grid-col content-evenly w-full h-full">
        <span className="text-lg md:text-2xl font-bold lg:text-center text-[var(--primary)]">
          {label}
        </span>

        <div className="items-center justify-items-center w-full h-full min-h-[200px]">
          <div className="w-fit h-full min-h-[180px] flex items-center justify-center">
            {loading ? (
              <Spin tip="Carregando gráfico..." />
            ) : chartData ? (
              <Doughnut
                data={chartData}
                options={safeOptions}
                key={JSON.stringify(chartData)}
                width={250}
                height={250}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Carregando gráfico...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
