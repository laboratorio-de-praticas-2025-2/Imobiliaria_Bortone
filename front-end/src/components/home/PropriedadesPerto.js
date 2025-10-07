import ImovelCard from "@/components/home/ImovelCard";
import { mockImoveis } from "@/mock/imoveis";

export default function PropriedadesPerto() {
  const [modo, setModo] = useState("comprar");

  const imoveisFiltrados = imoveis.filter((imovel) =>
    modo === "comprar" ? imovel.tipo === "comprar" : imovel.tipo === "alugar"
  );

  return (
    <div className="px-4 md:px-16 py-7 flex gap-7 flex-col">
      <div className="flex flex-row justify-between items-center">
        <p className="lemon-milk md:text-3xl text-xl text-[var(--primary)]">
          IMÓVEIS QUE PODEM TE INTERESSAR
        </p>
        {/* Switch Comprar / Alugar */}
        <div className="flex bg-[#e6e8f0] rounded-lg w-fit p-1">
          <button
            onClick={() => setModo("comprar")}
            className={`px-6 py-2 rounded-md font-semibold transition-all ${
              modo === "comprar"
                ? "bg-[#2c3d84] !text-white shadow"
                : "!text-[#30438380]"
            }`}
          >
            Comprar
          </button>
          <button
            onClick={() => setModo("alugar")}
            className={`px-6 py-2 rounded-md font-semibold transition-all ${
              modo === "alugar"
                ? "bg-[#2c3d84] !text-white shadow"
                : "!text-[#30438380]"
            }`}
          >
            Alugar
          </button>
        </div>
      </div>

      <div className="propriedades-selecionadas-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {mockImoveis.map((imovel) => (
          <ImovelCard key={imovel.id} imovel={imovel} />
        ))}
      </div>
    </div>
  );
}
