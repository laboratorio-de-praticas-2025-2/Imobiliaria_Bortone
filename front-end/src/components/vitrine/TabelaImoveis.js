import { useState } from "react";
import ImovelCard from "./ImovelCard";
import { mockImoveis } from "@/constants/imoveis";

export default function TabelaImoveis() {
    const [visibleCount, setVisibleCount] = useState(4);

    const handleMostrarMais = () => {
        setVisibleCount((prev) => prev + 4);
    };

    return (
        <div className="w-full">
            {/* Mobile: grid + botão "Mostrar mais" */}
            <div className="sm:hidden">
                <div className="grid gap-10 grid-cols-1">
                    {mockImoveis.slice(0, visibleCount).map((imovel, index) => (
                        <ImovelCard key={index} imovel={imovel} />
                    ))}
                </div>
                {visibleCount < mockImoveis.length && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleMostrarMais}
                            className="px-6 py-2 rounded-full bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary-dark)] transition"
                        >
                            Mostrar mais anúncios
                        </button>
                    </div>
                )}
            </div>

            {/* sm+: tabela */}
            <div className="hidden sm:block">
                <div
                    className="
                        grid sm:gap-2
                        grid-cols-2 
                        md:grid-cols-3 
                        lg:grid-cols-4
                    "
                >
                    {mockImoveis.map((imovel, index) => (
                        <ImovelCard key={index} imovel={imovel} />
                    ))}
                </div>
            </div>
        </div>
    );
}
