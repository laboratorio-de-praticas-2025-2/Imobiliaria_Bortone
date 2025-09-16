"use client";

import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend,  } from "chart.js";
import { Row, Col } from "antd";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RentalByRegion({ data, label, options,className }) {
  const [chartData, setChartData] = useState(null);

  // // Puxando dados de uma API real, mas a API tá fora do ar no momento ↓
  // useEffect(() => {
  //   fetch("https://6a3f34f1-cba4-496f-bbb1-ab1de57caebb.mock.pstmn.io/regioes") // URL da sua API
  //     .then((res) => res.json())
  //     .then((data) => {
  //       // aqui você ajusta o formato para o Chart.js
  //       setChartData({
  //         labels: data.map((item) => item.nome), // exemplo: "Região Sul"
  //         datasets: [
  //           {
  //             data: data.map((item) => item.valor), // exemplo: 25
  //             backgroundColor: [
  //               "#243B7B",
  //               "#F39C12",
  //               "#B8AEBF",
  //               "#A6A6A6",
  //               "#E74C3C",
  //             ],
  //             borderWidth: 0,
  //             cutout: "60%",
  //           },
  //         ],
  //       });
  //     });
  // }, []);


  return (
    <div className={`group h-full !w-full flex items-center rounded-xl px-4 !bg-[#EEF0F9] !shadow-md ${className}`}>
      <div className="grid grid-col content-evenly w-full h-full">
        <span className="text-lg md:text-2xl font-bold lg:text-center text-[var(--primary)] ">
          {label}
        </span>

        <div className="items-center justify-items-center w-full h-full">
          <div className="w-fit h-full">
            <Doughnut data={data} options={options} />

            {/* Puxando dados de uma API real, mas a API tá fora do ar no momento ↓ */}
              {/* {chartData ? (
                <Doughnut data={chartData} options={options} />
              ) : (
                <p>Carregando...</p>
              )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
