"use client";
import { Spin } from "antd";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// ✅ Importa Chart.js normalmente e registra os módulos necessários
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// ✅ Importa o componente Line de forma dinâmica (sem SSR)
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

// agora com parametro dos dados
export default function LineGraph({ alugueisPorMes, loading }) {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef(null);

  const safeData =
    lineGraphData?.length > 0
      ? lineGraphData
      : [{ mes: "2024-01", Apartamento: 0, Casa: 0, Terreno: 0 }];

  // Atualiza o gráfico apenas quando o container está pronto
  useEffect(() => {
    const checkReadiness = () => {
      if (containerRef.current && safeData?.length > 0) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) setIsReady(true);
      }
    };

    const timer = setTimeout(checkReadiness, 100);

    const handleResize = () => {
      setTimeout(checkReadiness, 50);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [safeData]);

  useEffect(() => {
    setIsReady(false);
  }, [alugueisPorMes]);

  // Dados seguros
  const safeAlugueisPorMes =
    alugueisPorMes && alugueisPorMes.length > 0
      ? alugueisPorMes
      : [{ mes: "2024-01", Casa: 0, Apartamento: 0, Terreno: 0 }];

  // define os labels como nome do mes/ano
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  // mapeia os dados com base nas labels e no formato esperado
  const labels = safeAlugueisPorMes.map((item) => {
    try {
      const [year, month] = item.mes.split("-");
      return `${monthNames[parseInt(month) - 1]}/${year.slice(2)}`;
    } catch {
      return "N/A";
    }
  });

  // dados do gráfico
  const chartData = {
    labels,
    datasets: [
      {
        label: "Casas",
        data: safeData.map((i) => i.Casa || 0),
        borderColor: "#F39C12",
        borderWidth: 4,
        fill: false,
        tension: 0,
        pointRadius: 0,
      },
      {
        label: "Apartamentos",
        data: safeData.map((i) => i.Apartamento || 0),
        borderColor: "#243B7B",
        borderWidth: 4,
        fill: false,
        tension: 0,
        pointRadius: 0,
      },
      {
        label: "Terrenos",
        data: safeData.map((i) => i.Terreno || 0),
        borderColor: "#E74C3C",
        borderWidth: 4,
        fill: false,
        tension: 0,
        pointRadius: 0,
      },
    ],
  };

  // escala dinâmica do gráfico
  const maxValue = Math.max(
    1,
    ...safeData.map((m) =>
      Math.max(m.Casa || 0, m.Apartamento || 0, m.Terreno || 0)
    )
  );
  const graphCeiling = Math.ceil(maxValue / 5) * 5 || 5;
  const stepSize = graphCeiling / 5;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: graphCeiling,
        ticks: { stepSize },
        grid: { color: "#000000" },
      },
      x: { grid: { display: false } },
    },
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          boxHeight: 30,
          boxWidth: 30,
          generateLabels: (chart) =>
            chart.data.datasets.map((dataset, i) => ({
              text: dataset.label,
              fillStyle: dataset.borderColor,
              strokeStyle: dataset.borderColor,
              hidden: !chart.isDatasetVisible(i),
            })),
        },
      },
    },
  };

  return (
    <div className="group h-[450px] w-full flex items-center rounded-xl px-10 md:px-3 2xl:px-10 bg-[#EEF0F9] shadow-md">
      <div className="grid grid-col content-evenly w-full h-full">
        <span className="text-lg md:text-2xl font-bold text-[var(--primary)]">
          {title}
        </span>
        <div className="items-center justify-items-center w-full h-full">
          <div className="w-full h-[250px] md:h-[300px]" ref={containerRef}>
            {loading ? (
              <Spin tip="Carregando gráfico..." />
            ) : isReady ? (
              <Line data={data} options={options} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Carregando gráfico...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
