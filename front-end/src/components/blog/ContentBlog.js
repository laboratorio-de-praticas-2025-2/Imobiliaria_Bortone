"use client";
import Cards from "./Cards";

export default function ContentBlog() {
  return (
    <div className="px-4 md:px-16 py-8">
      {/* Títulos principais */}
      <div className="flex flex-col gap-2 mb-10">
        <span className="text-[var(--primary)] lg:text-5xl text-[5.5vw] uppercase lemon-milk">
          Tudo que você precisa saber
        </span>
        <span className="text-[var(--primary)] lg:text-3xl text-[3.8vw] uppercase lemon-milk">
          Antes de comprar ou alugar um imóvel
        </span>
      </div>
      {/* Cards */}
      <Cards />
    </div>
  );
}
