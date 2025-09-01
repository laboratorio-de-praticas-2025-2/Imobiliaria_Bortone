import { useState } from "react";
import { Button, Col, Row } from "antd";

export default function Filter() {
  const [active, setActive] = useState("one");

  return (
    <div className="flex justify-center w-full">
      <div className="w-3xl">
      <div className="rounded-2xl justify-self-center
 shadow-xl w-[700px] h-[130px] meu-card bg-white ">
        <Row className="!flex !items-center h-full">
          <Col className="!flex  !justify-center " span={12}>
            <div className="w-fit flex flex-col items-center ">
              <p className="font-bold text-[14px] text-[var(--primary)] pb-3">
                Escolha o tipo de simulação:
              </p>
              <div>
                <Button
                  onClick={() => setActive("financiamento")}
                  className={`!px-6 !py-6 !font-bold !rounded-l-xl justify-center w-35 !rounded-none ${
                    active === "financiamento"
                      ? "!bg-[var(--primary)] !text-white"
                      : "!bg-white !text-[var(--primary)]"
                  }`}
                >
                  Financiamento
                </Button>

                <Button
                  onClick={() => setActive("aluguel")}
                  className={`!px-6 !py-6 !font-bold !rounded-r-xl w-35 !rounded-none ${
                    active === "aluguel"
                      ? "!bg-[var(--primary)] !text-white"
                      : "!bg-white !text-[var(--primary)]"
                  }`}
                >
                  Aluguel
                </Button>
              </div>
            </div>
          </Col>
          <Col className="!flex  !justify-center" span={12}>
            <div className="w-fit flex flex-col items-center">
              <p className="font-bold text-[14px] text-[var(--primary)] pb-3">
                Escolha o tipo de simulação:
              </p>
              <div>
                <Button
                  onClick={() => setActive("casa")}
                  className={`!px-6 !py-6 !font-bold  !rounded-l-xl w-35 !rounded-none ${
                    active === "casa"
                      ? "!bg-[var(--primary)] !text-white"
                      : "!bg-white !text-[var(--primary)]"
                  }`}
                >
                  Casa
                </Button>

                <Button
                  onClick={() => setActive("terreno")}
                  className={`!px-6 !py-6 !font-bold !rounded-r-xl w-35 !rounded-none ${
                    active === "terreno"
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
        <div className=" text-xs text-[var(--primary)] mt-4 ">
          Descubra de forma rápida o valor do imóvel que você deseja adquirir ou
          o valor das parcelas que cabem no seu bolso. Preencha seus dados e
          receba as melhores opções de planos de consórcio para conquistar seu
          imóvel sem juros e sem burocracia.
        </div>
      </div>
    </div>
  );
}
