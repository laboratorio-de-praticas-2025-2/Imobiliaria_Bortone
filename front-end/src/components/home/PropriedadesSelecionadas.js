import { mockImoveis } from "@/constants/imoveis";
import ImovelCard from "@/components/home/ImovelCard";

export default function PropriedadesSelecionadas() {
    return (
        <div className="px-4 md:px-16 py-7 flex gap-7 flex-col">
            <p className="lemon-milk text-3xl text-[var(--primary)]">IMÓVEIS SELECIONADOS PARA VOCÊ</p>
            <div className="propriedades-selecionadas-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {mockImoveis.map(imovel => (
                    <ImovelCard key={imovel.id} imovel={imovel} />
                ))}
            </div>
        </div>
    );
}
