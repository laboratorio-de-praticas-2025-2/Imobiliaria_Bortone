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

export default function RentalByRegion({
  data,
  label,
  options,
  className,
  loading,
}) {
  const [chartData, setChartData] = useState(null);
  const containerRef = useRef(null);

  // Aguarda montagem e define dados válidos
  useEffect(() => {
    if (!data || !data.datasets) return;

    const timer = setTimeout(() => {
      const hasValidData = data.datasets.some(
        (d) => Array.isArray(d.data) && d.data.length > 0
      );

      if (hasValidData) {
        setChartData(data);
      } else {
        // Evita loop infinito mostrando "sem dados"
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
  }, [data]);

  // Opções seguras para o gráfico
  const safeOptions = {
    ...options,
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
    },
    plugins: {
      ...options?.plugins,
      legend: {
        ...options?.plugins?.legend,
        display: !!(chartData?.labels?.length > 0),
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className={`group h-full !w-full flex items-center rounded-xl px-4 !bg-[#EEF0F9] !shadow-md ${className}`}
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
