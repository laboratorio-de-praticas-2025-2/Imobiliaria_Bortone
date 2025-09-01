"use client";
import { Slider, ConfigProvider, Button, Input } from "antd";
import { useState } from "react";

export default function Form() {
  const handleClick = () => {
    window.location.href = "/simulacao/simulador";
  };
  const [value, setValue] = useState(100000);

  // Função para formatar o valor como moeda brasileira
  const formatCurrency = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className=" justify-self-center lg:pb-10">
      <div className=" md:w-110 lg:h-85 bg-white p-7 md:p-10 rounded-3xl  relative z-20 text-center">
        <h3 className="text-[var(--primary)] form !font-bold text-[24px] mb-2">
          Chegou a hora de você
          <p>
            <span className="pr-1">financiar o seu</span>
            <span className="bg-[var(--primary)] text-white decoration-2 p-1 uppercase">
              IMÓVEL
            </span>
          </p>
        </h3>

        <p className="text-[var(--primary)] text-[16px] mb-4">
          Escolha o valor desejado:
        </p>

        <div className="mb-4 pt-2 w-3xs justify-self-center">
          <Input
            type="number"
            value={formatCurrency(value)}
            readOnly
            className="w-[35%] border border-gray-200 rounded px-3 py-2 focus:outline-none text-left h-12"
          />
        </div>

        <div className="mb-4">
          <ConfigProvider
            theme={{
              components: {
                Slider: {
                  railBg: "var(--secondary)",
                  trackBg: "var(--primary)",
                  trackHoverBg: "var(--primary)",
                  handleColor: "var(--primary)",
                  handleActiveColor: "var(--secondary)",
                  dotSize: 100,
                },
              },
            }}
          >
            <Slider
              min={20000}
              max={1000000}
              step={1}
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
          </ConfigProvider>
          <div className="flex  w-full">
            <p className="flex-none text-gray-400 font-thin text-[10px] pb-3">
              {formatCurrency(20000)}
            </p>
            <div className="grow"></div>
            <p className="flex-none text-gray-400 font-thin text-[10px] pb-3">
              {formatCurrency(1000000)}
            </p>
          </div>
        </div>
        <Button
          className="w-full !bg-[var(--secondary)] !text-white !h-10 rounded-lg "
          onClick={handleClick}
        >
          <span className=" font-bold">Simular Agora</span>
        </Button>
      </div>
    </div>
  );
}