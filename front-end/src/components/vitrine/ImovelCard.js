import ImageCarroussel from "./ImageCarroussel";

export default function ImovelCard({ imovel }) {
  const preco =
      imovel.visibilidade_preco === 0 || imovel.visibilidade_preco === false
      ? "Valor Oculto"
      : Number(imovel.preco).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

  return (
    <div className="hover:sm:shadow-lg sm:rounded-xl transition-shadow cursor-pointer gap-4 flex flex-col sm:p-4 w-full sm:w-72 md:w-80">
      <ImageCarroussel imovel={imovel} />

      <p className="md:text-xl text-2xl font-bold text-[var(--primary)] px-4 sm:px-0">
        {preco}
      </p>

      <div className="lg:text-lg sm:text-base text-lg sm:font-normal font-bold text-[var(--primary)] px-4 sm:px-0">
        <p className="flex flex-wrap items-center gap-1">
          {imovel.area} m²{" "}
          {(imovel.tipo === "Casa" || imovel.tipo === "Apartamento") &&
            imovel.casa && (
              <>
                • {imovel.casa.quartos} Quartos • {imovel.casa.banheiros}{" "}
                Banheiros
              </>
            )}
        </p>
        <p>{imovel.endereco}</p>
      </div>
    </div>
  );
}
