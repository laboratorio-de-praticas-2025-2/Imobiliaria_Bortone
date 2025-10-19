"use client";
import { Line } from "react-chartjs-2";
import { useRef, useEffect } from "react";
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

export default function LineGraph({ graphData = [], label }) {
  const chartRef = useRef(null);

  // nomes dos meses
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

  // === 1️⃣ Detecta o campo de data ===
  const dateKey = graphData[0]?.mes
    ? "mes"
    : graphData[0]?.data
    ? "data"
    : null;

  // === 2️⃣ Gera labels (ex: "Agosto/25") ===
  const labels =
    graphData && Array.isArray(graphData)
      ? graphData.map((item) => {
          const dateStr = item[dateKey];
          if (!dateStr) return "";
          const [year, month] = dateStr.split("-");
          if (!year || !month) return dateStr;
          return `${monthNames[parseInt(month) - 1]}/${year.slice(2)}`;
        })
      : [];

  // === 3️⃣ Detecta automaticamente as chaves numéricas ===
  const keys =
    graphData.length > 0
      ? Object.keys(graphData[0]).filter(
          (k) => k !== dateKey && typeof graphData[0][k] === "number"
        )
      : [];

  // === 4️⃣ Define cores automáticas para até 6 linhas ===
  const colors = [
    "#273668", // azul
    "#F39C12", // laranja
    "#E74C3C", // vermelho
    "#2ECC71", // verde
    "#9B59B6", // roxo
    "#3498DB", // azul-claro
  ];

  // === 5️⃣ Cria datasets dinamicamente ===
  const datasets = keys.map((key, i) => ({
    label: key,
    data: graphData.map((item) => item[key]),
    borderColor: colors[i % colors.length],
    backgroundColor: colors[i % colors.length],
    borderWidth: 1,
    fill: true,
    tension: 0,
    pointRadius: 3,
  }));

  const data = { labels, datasets };

  // === 6️⃣ Calcula limites do gráfico ===
  const allValues = graphData.flatMap((d) =>
    keys.map((k) => d[k]).filter((v) => typeof v === "number")
  );
  const maxValue = allValues.length ? Math.max(...allValues) : 0;
  const graphCeiling = maxValue ? maxValue + (5 - (maxValue % 5 || 5)) : 5;
  const stepSize = Math.ceil(graphCeiling / 5);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    devicePixelRatio: 2,
    scales: {
      y: {
        beginAtZero: true,
        max: graphCeiling,
        ticks: { stepSize },
        grid: { color: "#ccc" },
      },
      x: {
        grid: { color: "#eee" },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: { boxWidth: 20, boxHeight: 20 },
      },
      title: {
        display: !!label,
        text: label,
        font: { size: 16, weight: "bold" },
      },
    },
  };

  // === 7️⃣ Atualiza gráfico quando os dados mudam ===
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [graphData]);

  return (
    <div className="flex items-center justify-center w-full h-full py-4">
      <div className="w-[100%] h-[280px]">
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}
