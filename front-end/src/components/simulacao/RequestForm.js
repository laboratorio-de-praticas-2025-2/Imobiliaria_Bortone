import { Card, Button, Input, Slider, ConfigProvider } from "antd";
import { useState } from "react";

export default function RequestForm() {
  const [parcelas, setParcelas] = useState(20);
  const handleInputChange = (e) => {
    const value = Math.max(1, Math.min(32, Number(e.target.value))); // Limita entre 1-32
    setParcelas(value || 1); // Caso seja inválido, define 1
  };

  return (
    <div className="flex justify-center w-full ">
      <div className="lg:w-sm 2xl:w-md w-[85vw] shadow-xl rounded-b-2xl">
        <div className="bg-[var(--primary)] text-white rounded-t-2xl p-5 text-center">
          <span className="form font-light">Solicite uma</span>
          <p className="form font-semibold">simulação de financiamento</p>
        </div>
        <div className="grid h-fit bg-white grid-rows-1 justify-items-center content-evenly gap-4 sm:gap-4 xxl:gap-12 pt-7 text-center py-4 rounded-b-2xl">
          <div className="w-3xs">
            <label className="text-[14px] font-bold text-[var(--primary)]  ">
              Valor da parcela:
            </label>
            <Input
              type="number"
              placeholder="Digite aqui o valor"
              step="0.01"
              className="rounded-lg mt-1 h-12 text-center shadow-md"
            />
          </div>
          <div className="w-3xs">
            <label className="text-[14px] font-bold text-[var(--primary)] ">
              Valor de entrada:
            </label>
            <Input
              type="number"
              placeholder="Digite aqui o valor"
              className="rounded-lg mt-1 h-12 text-center shadow-md"
            />
          </div>
          <div className="w-2xs">
            <label className="text-[14px]  font-bold text-[var(--primary)] ">
              Escolha a quantidade de Parcelas:
            </label>
            <Input
              type="number"
              min={1}
              max={32}
              value={parcelas}
              readOnly
              className="rounded-lg mt-1 h-12 text-center shadow-md"
            />
          </div>
          <div className="w-2xs">
            <ConfigProvider
              theme={{
                components: {
                  Slider: {
                    railBg: "var(--secondary)", // trilha vazia
                    trackBg: "var(--primary)", // preenchida
                    trackHoverBg: "var(--primary)",
                    handleColor: "var(--primary)",
                    handleActiveColor: "var(--secondary)",
                    dotSize: 100,
                  },
                },
              }}
            >
              <Slider
                min={1}
                max={32}
                step={0.1}
                value={parcelas}
                onChange={(value) => setParcelas(value)}
              />
            </ConfigProvider>
          </div>
          <div className="w-3xs">
            <span className="text-[var(--primary)] font-bold">
              Taxa de juros mensal:
              <span className="text-[#919DC8]">valor</span>
            </span>
          </div>
          <div className="w-2xs pb-5">
            <Button className="!bg-[#3b478f] !text-white rounded-lg !h-10  !w-full">
              <span className="font-bold">Simular Agora</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
