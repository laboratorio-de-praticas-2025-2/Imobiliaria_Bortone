import ImageCarroussel from "./ImageCarroussel";

export default function ImovelCard({imovel}) {
    return (
      <div className="hover:sm:shadow-lg sm:rounded-xl transition-shadow cursor-pointer gap-4 sm:w-fit flex flex-col sm:p-4">
        <ImageCarroussel imovel={imovel} />
        <p className="md:text-xl text-2xl font-bold text-[var(--primary)] px-4 sm:px-0">
          R$ {imovel.preco.toLocaleString()}
        </p>
        <div className="lg:text-lg sm:text-base text-lg sm:font-normal font-bold text-[var(--primary)] px-4 sm:px-0">
          <p className="flex flex-wrap items-center gap-1">
            {imovel.area} m²{" "}
            {imovel.tipo === "Casa" && (
              <>
                • {imovel.quartos} Quartos • {imovel.banheiros} Banheiros
              </>
            )}
          </p>
          <p>{imovel.endereco}</p>
        </div>
      </div>
    );
}