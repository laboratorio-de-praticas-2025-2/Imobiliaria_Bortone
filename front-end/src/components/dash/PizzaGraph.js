"use client";

import { useState, useEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend,  } from "chart.js";
import { Row, Col } from "antd";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RentalByRegion({ data, label, options, className }) {
  const [chartData, setChartData] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  // Aguarda o container estar pronto e dados válidos
  useEffect(() => {
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
          }
        }
      }
    };

    // Aguarda um pouco para garantir que o DOM esteja totalmente renderizado
    const timer = setTimeout(checkReadiness, 100);
    
    // Também verifica quando há resize
    const handleResize = () => {
      setTimeout(checkReadiness, 50);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

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
            {isReady ? (
              <Doughnut 
                ref={chartRef}
                data={safeData} 
                options={safeOptions}
                key={JSON.stringify(data)} // Force re-render when data changes
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
