import { Button, Flex } from "antd";
import { CloudinaryImg } from "@/components/ui/CloudinaryImage";
import { PiBathtub } from "react-icons/pi";
import { BsDoorOpenFill } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";
import Link from "next/link";

/* eslint-disable @next/next/no-img-element */
export default function ImovelCard({ imovel }) {
  const preco =
    imovel.preco === null || imovel.preco === undefined
      ? "Valor Oculto"
      : Number(imovel.preco).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

  const status = imovel.status?.toLowerCase();
  const overlayText =
    status === "vendido" ? "VENDIDO" : status === "locado" ? "LOCADO" : null;

  return (
    <div className="sm:p-3 bg-white sm:bg-[#DEE1F0] flex flex-col gap-2 align-middle rounded-xl sm:shadow-none shadow-lg">
      <div className="w-full aspect-[16/9] relative">
        <CloudinaryImg
          src={
            (imovel.imagens &&
              imovel.imagens.length > 0 &&
              imovel.imagens[0].url_imagem) ||
            (imovel.imagem_imovel &&
              imovel.imagem_imovel.length > 0 &&
              imovel.imagem_imovel[0].url_imagem) ||
            imovel.imagem ||
            "/404.png"
          }
          alt={"Imagem do imóvel"}
          type="imovel"
          className={`w-full h-full object-cover aspect-[16/9] transition-all duration-300 ${
            overlayText ? "brightness-50" : ""
          }`}
        />
        {overlayText && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-2xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded">
              {overlayText}
            </span>
          </div>
        )}
      </div>
      <Flex justify="space-between" gap="middle" className="sm:!p-0 !px-3">
        <span className="truncate text-[var(--primary)]">
          {imovel.tipo} - {imovel.endereco}
        </span>
        <p className="text-[var(--primary)] font-bold text-xl">{preco}</p>
      </Flex>
      <Flex
        justify={imovel.tipo == "Casa" ? "space-between" : "end"}
        gap="middle"
        className="sm:!p-0 !px-3"
      >
        <Flex gap="large">
          {(imovel.tipo == "Casa" || imovel.tipo == "Apartamento") && (
            <>
              <Flex gap="small" className="text-[var(--primary)]">
                <PiBathtub />
                <span>{imovel.banheiros || imovel.casa?.banheiros || imovel.apartamento?.banheiros || 0}</span>
              </Flex>
              <Flex gap="small" className="text-[var(--primary)]">
                <BsDoorOpenFill />
                <span>{imovel.vagas || imovel.casa?.vagas || imovel.apartamento?.vagas || 0}</span>
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
        <Link href={`/agendamento/${imovel.id}`} className="w-full">
          <Button
            shape="round"
            className="!border-none !text-[var(--primary)] hover:!border-none hover:!text-white hover:!bg-[var(--primary)] w-full !bg-[#D5D8E5] sm:!bg-white"
          >
            Agendar visita
          </Button>
        </Link>
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
