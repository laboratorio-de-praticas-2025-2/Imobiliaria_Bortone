import { Card, Button, Input, Slider, ConfigProvider } from "antd";
import { useState } from "react";

export default function RequestForm() {
  const [parcelas, setParcelas] = useState(20);

  return (
    <div className="flex justify-center w-full ">
      <div className="w-sm shadow-xl rounded-b-2xl">
        <div className="bg-[var(--primary)] text-white rounded-t-2xl p-5 text-center">
          <span className="form font-light">Solicite uma</span>
          <p className="form font-semibold">simulação de compra</p>
        </div>
        <div className="grid h-fit bg-white grid-rows-1 justify-items-center content-evenly gap-6 text-center py-4 rounded-b-2xl">
          <div className="w-3xs">
            <label className="text-[14px] font-bold text-[var(--primary)]  ">
              Valor da parcela:
            </label>
            <Input
              placeholder="Digite aqui o valor"
              className="rounded-lg mt-1 h-12 text-center shadow-md"
            />
          </div>
          <div className="w-3xs">
            <label className="text-[14px] font-bold text-[var(--primary)] ">
              Valor de entrada:
            </label>
            <Input
              placeholder="Digite aqui o valor"
              className="rounded-lg mt-1 h-12 text-center shadow-md"
            />
          </div>
          <div className="w-2xs">
            <label className="text-[14px]  font-bold text-[var(--primary)] ">
              Escolha a quantidade de Parcelas:
            </label>
            <Input
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
                value={parcelas}
                onChange={(value) => setParcelas(value)}
              />
            </ConfigProvider>
          </div>
          <div className="w-3xs">
            <span className="text-[var(--primary)] font-bold">
              Taxa de juros mensal:{" "}
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

      {/* <Card className="rounded-2xl shadow-lg w-[350px] meu-card h-[70vh]">
        <div className="bg-[#374A8C] text-white rounded-t-2xl p-5 text-center -m-6 mb-6">
          <span className=" form font-light">Solicite uma</span>
          <p className="form font-semibold">simulação de compra</p>
        </div>
        <div className="justify-items-center w-full grid h-fit grid-rows-1 content-around gap-10">
          <div className="flex flex-col gap-4 text-center w-40 ">
            <div>
              <label className="text-[14px] font-bold text-[var(--primary)]  ">
                Valor da parcela:
              </label>
              <Input
                placeholder="Digite aqui o valor"
                className="rounded-lg mt-1 h-12 text-center shadow-md"
              />
            </div>

            <div>
              <label className="text-[14px] font-bold text-[var(--primary)] ">
                Valor de entrada:
              </label>
              <Input
                placeholder="Digite aqui o valor"
                className="rounded-lg mt-1 h-12 text-center shadow-md"
              />
            </div>
          </div>
          <div className="justify-items-center w-full grid h-fit  content-around gap-10">
            <div className="w-60 text-center">
              <label className="text-[14px]  font-bold text-[var(--primary)] ">
                Escolha a quantidade de Parcelas:
              </label>
              <Input
                value={parcelas}
                readOnly
                className="rounded-lg mt-1 h-12 text-center shadow-md"
              />
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
                  value={parcelas}
                  onChange={(value) => setParcelas(value)}
                />
              </ConfigProvider>
            </div>
          </div>

          <div>
            <span className="text-[var(--primary)] font-bold">
              Taxa de juros mensal:{" "}
              <span className="text-[#919DC8]">valor</span>
            </span>
          </div>

          <div className="justify-items-center pt-4">
            <Button className="!bg-[#3b478f] !text-white rounded-lg !h-10 mt-2 !w-60">
              <span className="font-bold">Simular Agora</span>
            </Button>
          </div>
        </div>
      </Card> */}
    </div>
  );
}
