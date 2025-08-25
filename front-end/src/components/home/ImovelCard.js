import { Flex } from "antd";
import { PiBathtub } from "react-icons/pi";
import { BsDoorOpenFill } from "react-icons/bs";

/* eslint-disable @next/next/no-img-element */
export default function ImovelCard({ imovel }) {
    return(
        <div className="p-3 bg-[#DEE1F0] flex flex-col gap-2 align-middle rounded-xl">
             <div className="w-full aspect-[16/9]">
                <img
                src={imovel.imagens[0].url_imagem}
                alt={imovel.imagens[0].descricao}
                className="w-full h-full object-cover rounded-md aspect-[16/9]"
                />
            </div>
            <Flex justify="space-between" gap="middle">
                <span className="truncate text-[var(--primary)]">
                    {imovel.tipo} - {imovel.endereco}
                </span>
                <p className="text-[var(--primary)] font-bold text-xl">R$ {imovel.preco.toLocaleString()}</p>
            </Flex>
            <Flex justify="space-between" gap="middle">
                <Flex gap="large">
                    <Flex gap="small" className="text-[var(--primary)]">
                        <PiBathtub />
                        <span>{imovel.banheiros}</span>
                    </Flex>
                    <Flex gap="small" className="text-[var(--primary)]">
                        <BsDoorOpenFill />
                        <span>{imovel.vagas}</span>
                    </Flex>
                </Flex>
                <p className="text-[var(--primary)]">{imovel.area} m²</p>
            </Flex>
        </div>
    )
}