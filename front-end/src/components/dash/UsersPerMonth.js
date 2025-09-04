"use client";

import { useState, useEffect } from "react";import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function RentalByRegion() {
  const data = {
    labels: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    datasets: [
      {
        label: 'Imóveis alugados',
        data: [0, 80, 60, 120, 100, 120, 140, 200, , , , ],
        borderColor: '#F39200',
        borderWidth: 2,
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
        max: 200,
        ticks: { stepSize: 20 },
        grid: { color: '#000000' },
      },
      x: { grid: { display: false } },
    },
    plugins: {
      legend: {
        display: true,
        position: 'right',
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
    <div className="group h-[450px] !w-full flex items-center rounded-xl px-10 !bg-[#EEF0F9] !shadow-md">
      <div className="grid grid-col content-evenly w-full h-full">
        <span className="text-lg md:text-2xl font-bold lg:text-center text-[var(--primary)]">
          Evolução de usuários por mês
        </span>

        <div className="items-center justify-items-center w-full h-full">
          <div className="md:w-[550px] xl:w-[600px] 2xl:w-[800px] h-[300px]">
            <Line data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
