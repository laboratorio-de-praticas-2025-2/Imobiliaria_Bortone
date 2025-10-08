"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Spin } from "antd";

// Import dinâmico para evitar problemas de SSR no Vercel
const Doughnut = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  { ssr: false }
);

// Import dinâmico do Chart.js para evitar problemas no Vercel
const ChartJS = dynamic(
  () => import("chart.js").then((mod) => {
    const { Chart, ArcElement, Tooltip, Legend } = mod;
    Chart.register(ArcElement, Tooltip, Legend);
    return Chart;
  }),
  { ssr: false }
);

export default function RentalByRegion({ data, label, options, className, loading }) {
  const [chartData, setChartData] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  // Garantir que o componente está montado (importante para Vercel)
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Aguarda o container estar pronto e dados válidos
  useEffect(() => {
    if (!isMounted) return;

    const checkReadiness = () => {
      if (containerRef.current && data && data.labels && data.datasets) {
        const containerRect = containerRef.current.getBoundingClientRect();
        if (containerRect.width > 0 && containerRect.height > 0) {
          // Verifica se há dados válidos
          const hasValidData = data.datasets.some(dataset => 
            dataset.data && dataset.data.length > 0 && 
            dataset.data.some(value => value > 0)
          );
          
          if (hasValidData) {
            setIsReady(true);
            setChartData(data);
          }
        }
      }
    };

    // Aguarda mais tempo no Vercel para garantir hidratação completa
    const timer = setTimeout(checkReadiness, 500);
    
    // Também verifica quando há resize
    const handleResize = () => {
      setTimeout(checkReadiness, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [data, isMounted]);

  // Reset quando data mudar
  useEffect(() => {
    setIsReady(false);
  }, [data]);


  // Dados padrão para evitar erros
  const safeData = data && data.labels && data.datasets ? data : {
    labels: ['Sem dados'],
    datasets: [{
      data: [1],
      backgroundColor: ['#E5E5E5'],
      borderWidth: 0,
      cutout: "0%",
    }]
  };

  // Opções seguras para o gráfico
  const safeOptions = {
    ...options,
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: isReady ? (options?.animation?.duration || 300) : 0
    },
    plugins: {
      ...options?.plugins,
      legend: {
        ...options?.plugins?.legend,
        display: data && data.labels && data.labels.length > 0
      }
    }
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
            ) : isReady ? (
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
