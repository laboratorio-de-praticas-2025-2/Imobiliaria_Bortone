"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Row, Col } from "antd";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Registrar elementos necessários globalmente
ChartJS.register(ArcElement, Tooltip, Legend);

// Import dinâmico apenas do Doughnut
const Doughnut = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  { ssr: false }
);

export default function RentalByRegion({ data, label, options, className }) {
  const [chartData, setChartData] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const checkReadiness = () => {
      if (containerRef.current && data?.labels && data?.datasets) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const hasData = data.datasets.some(
            (d) => d.data?.some((v) => v > 0)
          );
          if (hasData) {
            setIsReady(true);
            setChartData(data);
          }
        }
      }
    };

    const timer = setTimeout(checkReadiness, 500);
    window.addEventListener("resize", checkReadiness);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkReadiness);
    };
  }, [data, isMounted]);

  useEffect(() => setIsReady(false), [data]);

  const safeData =
    data?.labels && data?.datasets
      ? data
      : {
          labels: ["Sem dados"],
          datasets: [
            {
              data: [1],
              backgroundColor: ["#E5E5E5"],
              borderWidth: 0,
              cutout: "0%",
            },
          ],
        };

  const safeOptions = {
    ...options,
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: isReady ? options?.animation?.duration || 300 : 0 },
    plugins: {
      ...options?.plugins,
      legend: {
        ...options?.plugins?.legend,
        display: !!data?.labels?.length,
      },
    },
  };

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
            {isReady ? (
              <Doughnut
                ref={chartRef}
                data={safeData}
                options={safeOptions}
                key={JSON.stringify(data)}
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
