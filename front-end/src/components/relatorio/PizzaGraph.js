"use client";

import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Row, Col } from "antd";

const drawLabelsInSlices = {
  id: "drawLabelsInSlices",
  afterDraw(chart) {
    const { ctx, chartArea: { width, height } } = chart;

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

ChartJS.register(ArcElement, Tooltip, Legend );

export default function RentalByRegion({ data, label, className }) {
  const [chartData, setChartData] = useState(null);

  const options = {
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
    maintainAspectRatio: false,
  };
  return (
    <div
      className={`group h-full !w-full flex items-center rounded-xl px-4 pt-4 !bg-[#eef0f9] !shadow-md`}
    >
      <div className="grid grid-col content-evenly w-full h-full">
        <span className="text-lg font-bold lg:text-center text-[#273668] ">
          {label}
        </span>

        <div className="items-center justify-items-center w-full h-full">
          <div className={`mx-auto ${className}`}>
            <Doughnut data={data} options={options} plugins={[drawLabelsInSlices]}/>
          </div>
        </div>
      </div>
    </div>
  );
}
