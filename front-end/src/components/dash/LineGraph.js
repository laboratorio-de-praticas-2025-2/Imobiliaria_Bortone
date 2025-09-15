"use client";
import { Row, Col } from "antd";
import { Line } from "react-chartjs-2";
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

export default function LineGraph() {
  const data = {
    labels: [
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
    ],
    datasets: [
      {
        label: "Casas",
        data: [5, 10, 3, 10, 5, 15, 5, 7, , , ,],
        borderColor: "#F39200",
        borderWidth: 4,
        fill: false,
        tension: 0,
        pointRadius: 0,
      },
            {
        label: "Apartamentos",
        data: [2, 5, 4, 8, 10, 7, 2, 12, , , ,],
        borderColor: "#324587",
        borderWidth: 4,
        fill: false,
        tension: 0,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 50,
        ticks: { stepSize: 5 },
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
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return datasets.map((dataset, i) => ({
              text: dataset.label,
              fillStyle: dataset.borderColor, // quadrado totalmente preenchido
              strokeStyle: dataset.borderColor,
              lineWidth: 0,
              hidden: !chart.isDatasetVisible(i),
            }));
          },
        },
      },
    },
  };

  return (
    <div className="group h-[450px] !w-full flex items-center rounded-xl  px-10 md:px-3 2xl:px-10 !bg-[#EEF0F9] !shadow-md">
      <div className="grid grid-col content-evenly w-full h-full">
        <span className="text-lg md:text-2xl font-bold   text-[var(--primary)]">
          Evolução de vendas por mês
        </span>

        <div className="items-center justify-items-center w-full h-full">
          <div className="w-full h-[250px] md:h-[300px]">
            <Line data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}