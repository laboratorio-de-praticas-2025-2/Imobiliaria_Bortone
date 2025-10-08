import { useState } from "react";
import { Button, Col, Row } from "antd";

export default function Filter() {
  const [simulationType, setSimulationType] = useState("financiamento");
  const [propertyType, setPropertyType] = useState("casa");

  return (
    <div className="flex justify-center w-full pt-20">
      <div className="w-3xl">
        <div className="rounded-2xl justify-self-center shadow-xl w-fit p-8  meu-card bg-white ">
        
              <div className="w-fit flex flex-col items-center">
                <p className="font-bold text-[14px] text-[var(--primary)] pb-3">
                  Escolha o tipo de imóvel:
                </p>
                <div className="flex flex-row">
                  <Button
                    onClick={() => setPropertyType("casa")}
                    className={`!px-6 !py-6 !font-bold  !rounded-l-xl w-35 !rounded-none ${
                      propertyType === "casa"
                        ? "!bg-[var(--primary)] !text-white"
                        : "!bg-white !text-[var(--primary)]"
                    }`}
                  >
                    Casa
                  </Button>

                  <Button
                    onClick={() => setPropertyType("terreno")}
                    className={`!px-6 !py-6 !font-bold !rounded-r-xl w-35 !rounded-none ${
                      propertyType === "terreno"
                        ? "!bg-[var(--primary)] !text-white"
                        : "!bg-white !text-[var(--primary)]"
                    }`}
                  >
                    Terreno
                  </Button>
                </div>
              </div>
        </div>
        <div className=" text-xs text-[var(--primary)] mt-4 hidden lg:block ">
          Descubra de forma rápida o valor do imóvel que você deseja adquirir ou
          o valor das parcelas que cabem no seu bolso. Preencha seus dados e
          receba as melhores opções de planos de consórcio para conquistar seu
          imóvel sem juros e sem burocracia.
        </div>
      </div>
    </div>
  );
}