import { Button, Flex } from "antd";
import { PiBathtub } from "react-icons/pi";
import { BsDoorOpenFill } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";

/* eslint-disable @next/next/no-img-element */
export default function ImovelCard({ imovel }) {
    return (
      <div className="sm:p-3 bg-white sm:bg-[#DEE1F0] flex flex-col gap-2 align-middle rounded-xl sm:shadow-none shadow-lg">
        <div className="w-full aspect-[16/9]">
          <img
            src={imovel.imagens[0].url_imagem}
            alt={imovel.imagens[0].descricao}
            className="w-full h-full object-cover rounded-md aspect-[16/9]"
          />
        </div>
        <Flex justify="space-between" gap="middle" className="sm:!p-0 !px-3">
          <span className="truncate text-[var(--primary)]">
            {imovel.tipo} - {imovel.endereco}
          </span>
          <p className="text-[var(--primary)] font-bold text-xl">
            R$ {imovel.preco.toLocaleString()}
          </p>
        </Flex>
        <Flex
          justify={imovel.tipo == "Casa" ? "space-between" : "end"}
          gap="middle"
          className="sm:!p-0 !px-3"
        >
          <Flex gap="large">
            {imovel.tipo == "Casa" && (
              <>
                <Flex gap="small" className="text-[var(--primary)]">
                  <PiBathtub />
                  <span>{imovel.banheiros}</span>
                </Flex>
                <Flex gap="small" className="text-[var(--primary)]">
                  <BsDoorOpenFill />
                  <span>{imovel.vagas}</span>
                </Flex>
              </>
            )}
          </Flex>
          <p className="text-[var(--primary)]">{imovel.area} m²</p>
        </Flex>
        <Flex
          justify="space-between"
          align="center"
          gap={8}
          className="sm:!p-0 !p-3"
        >
          <Button
            shape="round"
            className="!border-none !text-[var(--primary)] hover:!border-none hover:!text-white hover:!bg-[var(--primary)] w-full !bg-[#D5D8E5] sm:!bg-white"
          >
            Fazer Proposta
          </Button>
          <Button
            shape="circle"
            className="!border-none !text-[var(--primary)] hover:!border-none hover:!text-white hover:!bg-[var(--primary)] !bg-[#D5D8E5] sm:!bg-white"
          >
            <AiOutlineMessage size={20} style={{ transform: "scaleX(-1)" }} />
          </Button>
        </Flex>
      </div>
    );
}