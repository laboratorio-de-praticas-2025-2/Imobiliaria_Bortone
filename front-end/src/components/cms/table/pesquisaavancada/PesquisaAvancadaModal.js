import { Button, Flex } from "antd";
import { useState } from "react";
import BotaoPesquisar from "@/components/vitrine/PesquisaAvancada/BotaoPesquisar";

export default function PesquisaAvancadaModal() {
  const [nivel, setNivel] = useState(null);

  const handlePesquisar = () => {
    const filtros = { nivel };
    console.log("Filtros enviados:", filtros);
    // Aqui você pode fazer a requisição com os filtros
  };

  const baseClasses =
    "!border-2 !h-10 !text-lg !rounded-full w-full transition-colors";

  return (
    <div className="absolute md:right-0 z-50 bg-[#DEE1F0] rounded-b-[28px] md:rounded-tr-none rounded-tr-2xl py-6 px-2 w-[217.85px]">
      <Flex vertical align="center" justify="center" className="!gap-10">
        <div className="flex flex-col gap-2 w-full">
          <p className="text-lg text-[var(--primary)] !font-bold">Nível</p>

          {/* Botão Administrador */}
          <Button
            className={`${baseClasses} ${
              nivel === "administrador"
                ? "!bg-[var(--primary)] !text-white hover:!bg-[#374A8C]"
                : "!bg-transparent !text-[var(--primary)] !border-[var(--primary)] hover:!bg-[#d1d3e0]"
            }`}
            onClick={() =>
              setNivel(nivel === "administrador" ? null : "administrador")
            }
          >
            Administrador
          </Button>

          {/* Botão Usuário Padrão */}
          <Button
            className={`${baseClasses} ${
              nivel === "usuario"
                ? "!bg-[var(--primary)] !text-white hover:!bg-[#374A8C]"
                : "!bg-transparent !text-[var(--primary)] !border-[var(--primary)] hover:!bg-[#d1d3e0]"
            }`}
            onClick={() => setNivel(nivel === "usuario" ? null : "usuario")}
          >
            Usuário Padrão
          </Button>
        </div>

        <BotaoPesquisar onClick={handlePesquisar} />
      </Flex>
    </div>
  );
}
