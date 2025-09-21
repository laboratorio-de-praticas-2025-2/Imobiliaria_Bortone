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

// agora com parametro dos dados
export default function LineGraph({alugueisPorMes}) {
  // define os labels como nome do mes/ano
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  // mapeia os dados com base nas labels e no formato esperado
  const labels = alugueisPorMes.map((item) => {
    const [year, month] = item.mes.split("-");
    return `${monthNames[parseInt(month) - 1]}/${year.slice(2)}`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Casas",
        data: alugueisPorMes.map((item) => item.Casa),
        borderColor: "#F39C12",
        borderWidth: 4,
        fill: false,
        tension: 0,
        pointRadius: 0,
      },
      {
        label: "Apartamentos",
        data: alugueisPorMes.map((item) => item.Apartamento),
        borderColor: "#243B7B",
        borderWidth: 4,
        fill: false,
        tension: 0,
        pointRadius: 0,
      },
      {
        label: "Terrenos",
        data: alugueisPorMes.map((item) => item.Terreno),
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
  const maxValue = Math.max(
    ...alugueisPorMes.map((m) =>
      Math.max(m.Casa, m.Apartamento, m.Terreno)
    )
  );
  // arredonda o teto para o proximo multiplo de 5
  const graphCeiling =  maxValue + (5 - (maxValue % 5));
  // defino os steps como 5
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