import ImovelCard from "@/components/home/ImovelCard";
import { mockImoveis } from "@/mock/imoveis";

export default function PropriedadesPerto() {
  return (
    <div className="px-4 md:px-16 py-7 flex gap-7 flex-col">
      <div className="flex flex-row justify-between items-center">
        <p className="lemon-milk md:text-3xl text-xl text-[var(--primary)]">
          IMÓVEIS QUE PODEM TE INTERESSAR
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
