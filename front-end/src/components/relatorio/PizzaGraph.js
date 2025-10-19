"use client";

import { useState, useEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Row, Col } from "antd";

const drawLabelsInSlices = {
  id: "drawLabelsInSlices",
  afterDraw(chart) {
    const {
      ctx,
      chartArea: { width, height },
    } = chart;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((element, index) => {
        const { x, y } = element.tooltipPosition();
        const value = dataset.data[index];

        if (!value || value == 0) return;

        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(value, x, y);
      });
    });
  },
};

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RentalByRegion({ data, label, className }) {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  const options = {
    cutout: "0%", // <-- sem buraco, igual a pizza
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: false,
          boxHeight: 14,
          color: "black",
          boxWidth: 14,
        },
      },
    },
    maintainAspectRatio: true, // Mantém proporção 1:1 para gráfico redondo
    aspectRatio: 1, // Força aspecto quadrado (redondo)
    animation: {
      duration: 0, // Desabilita animação para melhor captura em PDF
    },
    responsive: true,
    devicePixelRatio: 2, // Melhora a qualidade para PDF
  };

  useEffect(() => {
    if (data && chartRef.current) {
      // Força re-render do gráfico
      const chart = chartRef.current;
      if (chart.chartInstance) {
        chart.chartInstance.update();
      }
    }
  }, [data]);

  // Verifica se todos os valores são zero
  const allValuesZero =
    data &&
    data.datasets &&
    data.datasets[0] &&
    data.datasets[0].data &&
    data.datasets[0].data.every((value) => value === 0);

  if (allValuesZero) {
    return (
      <div className="items-start justify-items-start w-full m-0 p-0">
        <div
          style={{ width: "200px", height: "200px" }}
          className={`${className} flex items-center justify-center`}
        >
          <p className="text-gray-500 text-sm text-center">
            Não há dados para exibir o gráfico
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="items-start justify-items-start w-full m-0 p-0">
      <div style={{ width: "200px", height: "200px" }} className={className}>
        <Doughnut
          ref={chartRef}
          data={data}
          options={options}
          plugins={[drawLabelsInSlices]}
        />
      </div>
    </div>
  );
}
