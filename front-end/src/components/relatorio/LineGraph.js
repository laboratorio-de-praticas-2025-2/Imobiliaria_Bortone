"use client";
import { Row, Col } from "antd";
import { Line } from "react-chartjs-2";
import { useEffect, useRef } from "react";
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

// agora com parametro dos dados
export default function LineGraph({graphData, label} ) {
  const chartRef = useRef(null);
  // define os labels como nome do mes/ano  
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  // mapeia os dados com base nas labels e no formato esperado
  const labels = graphData && Array.isArray(graphData) ? graphData.map((item) => {
    const [year, month] = item.mes.split("-");
    return `${monthNames[parseInt(month) - 1]}/${year.slice(2)}`;
  }) : [];

  const data = {
    labels,
    datasets: [
      {
        label: "Casas",
        data: graphData && Array.isArray(graphData) ? graphData.map((item) => item.Casa) : [],
        borderColor: "#F39C12",
        borderWidth: 4,
        fill: false,
        tension: 0,
        pointRadius: 0,
      },
      {
        label: "Apartamentos",
        data: graphData && Array.isArray(graphData) ? graphData.map((item) => item.Apartamento) : [],
        borderColor: "#243B7B",
        borderWidth: 4,
        fill: false,
        tension: 0,
        pointRadius: 0,
      },
      {
        label: "Terrenos",
        data: graphData && Array.isArray(graphData) ? graphData.map((item) => item.Terreno) : [],
        /* data: [10, 5, 12, 1, 22, 13, 16, 11, 19, 7, 14, 9], */
        borderColor: "#E74C3C",
        borderWidth: 4,
        fill: false,
        tension: 0,
        pointRadius: 0,
      },
    ],
  };

  // calcula o valor maximo entre todas as categorias para definir o teto do grafico
  const maxValue = graphData && Array.isArray(graphData) ? Math.max(
    ...graphData.map((m) =>
      Math.max(m.Casa, m.Apartamento, m.Terreno)
    )
  ) : 0;
  // arredonda o teto para o proximo multiplo de 5
  const graphCeiling =  maxValue + (5 - (maxValue % 5));
  // defino os steps como 5
  const stepSize = graphCeiling / 5;
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // Desabilita animação para melhor captura em PDF
    },
    devicePixelRatio: 2, // Melhora a qualidade para PDF
    scales: {
      y: {
        beginAtZero: true,
        max: graphCeiling,
        ticks: { stepSize },  
        grid: { color: "#000000" },
      },
      x: { grid: { grid: { color: "#000000" },display: true } },
    },
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          boxHeight: 30,
          boxWidth: 30,
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return datasets.map((dataset, i) => ({
              text: dataset.label,
              fillStyle: dataset.borderColor,
              strokeStyle: dataset.borderColor,
              lineWidth: 0,
              hidden: !chart.isDatasetVisible(i),
            }));
          },
        },
      },
    },
  };  

  useEffect(() => {
    if (graphData && chartRef.current) {
      // Força re-render do gráfico
      const chart = chartRef.current;
      if (chart.chartInstance) {
        chart.chartInstance.update();
      }
    }
  }, [graphData]);
  
  return (
    <div className="group h-[350px] !w-full flex items-center rounded-xl  px-10 md:px-3 2xl:px-10 !bg-[#EEF0F9] !shadow-md">
      <div className="grid grid-col content-evenly w-full h-full">
        <span className="text-lg ms-4 font-semibold text-[var(--primary)]">
          {label}
        </span>

        <div className="items-center justify-items-center w-full h-full">
          <div className="w-[95%] h-[280px]">
            <Line ref={chartRef} data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}