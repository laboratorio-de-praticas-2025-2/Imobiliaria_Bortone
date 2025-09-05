import ImovelCard from "@/components/home/ImovelCard";
import { mockImoveis } from "@/mock/imoveis";
import { HiMapPin } from "react-icons/hi2";

export default function PropriedadesPerto() {
  return (
    <div className="px-4 md:px-16 py-7 flex gap-7 flex-col">
      <div className="flex flex-row justify-between items-center">
        <p className="lemon-milk md:text-3xl text-xl text-[var(--primary)]">
          IMÓVEIS PERTO DE VOCÊ
        </p>
        <p className="lemon-milk text-[var(--primary)] md:text-xl text-xs flex items-center gap-1.5">
          <HiMapPin />
          REGISTRO, SÃO PAULO
        </p>
      </div>
      <div className="propriedades-selecionadas-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {mockImoveis.map((imovel) => (
          <ImovelCard key={imovel.id} imovel={imovel} />
        ))}
      </div>
    </div>
  );
}
