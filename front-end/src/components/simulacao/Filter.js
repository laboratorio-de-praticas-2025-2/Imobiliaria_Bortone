import { useState, createContext, useContext } from "react";
import { Button, Col, Row } from "antd";

export const SimulacaoContext = createContext();

export default function Filter() {
  const { propertyType, setPropertyType, modalidade, setModalidade } = useContext(SimulacaoContext);

  return (
    <div className="flex justify-center w-full pt-20">
      <div className="w-3xl">
        <div className="rounded-2xl justify-self-center shadow-xl w-[80vw] md:w-[50vw] lg:w-[700px] h-[25vh] lg:h-[130px] meu-card bg-white ">
          <Row className="!flex !items-center h-full">
            <Col className="!flex !justify-center" xs={24} lg={12}>
              <div className="w-fit flex flex-col items-center">
                <p className="font-bold text-[14px] text-[var(--primary)] pb-3">
                  Escolha a modalidade:
                </p>
                <div>
                  <Button
                    onClick={() => setModalidade("price")}
                    className={`!px-6 !py-6 !font-bold !rounded-l-xl justify-center w-35 !rounded-none ${
                      modalidade === "price"
                        ? "!bg-[var(--primary)] !text-white"
                        : "!bg-white !text-[var(--primary)]"
                    }`}
                  >
                    PRICE
                  </Button>

                  <Button
                    onClick={() => setModalidade("sac")}
                    className={`!px-6 !py-6 !font-bold !rounded-r-xl w-35 !rounded-none ${
                      modalidade === "sac"
                        ? "!bg-[var(--primary)] !text-white"
                        : "!bg-white !text-[var(--primary)]"
                    }`}
                  >
                    SAC
                  </Button>
                </div>
              </div>
            </Col>
            <Col className="!flex !justify-center" xs={24} lg={12}>
              <div className="w-fit flex flex-col items-center">
                <p className="font-bold text-[14px] text-[var(--primary)] pb-3">
                  Escolha o tipo de imóvel:
                </p>
                <div>
                  <Button
                    onClick={() => setPropertyType("imovel")}
                    className={`!px-6 !py-6 !font-bold !rounded-l-xl w-35 !rounded-none ${
                      propertyType === "imovel"
                        ? "!bg-[var(--primary)] !text-white"
                        : "!bg-white !text-[var(--primary)]"
                    }`}
                  >
                    Imóvel
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
            </Col>
          </Row>
        </div>
        <div className="text-xs text-[var(--primary)] mt-4 hidden lg:block">
          Descubra de forma rápida o valor do imóvel que você deseja adquirir ou
          o valor das parcelas que cabem no seu bolso. Preencha seus dados e
          receba as melhores opções de planos de consórcio para conquistar seu
          imóvel sem juros e sem burocracia.
        </div>
      </div>
    </div>
  );
}