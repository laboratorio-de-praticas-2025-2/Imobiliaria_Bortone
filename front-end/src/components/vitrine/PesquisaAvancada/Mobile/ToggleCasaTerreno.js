export default function ToggleCasaTerreno({ selectedType, setSelectedType }) {
  return (
    <div className="w-full rounded-xl bg-[#DEE1F0] flex flex-row gap-14 px-8 py-3">
      <button
        className={`!text-[var(--primary)] font-bold cursor-pointer transition-opacity ${
          selectedType === "Casa" ? "" : "opacity-50"
        }`}
        onClick={() => setSelectedType("Casa")}
      >
        Casa
      </button>
      <button
        className={`!text-[var(--primary)] font-bold cursor-pointer transition-opacity ${
          selectedType === "Terreno" ? "" : "opacity-50"
        }`}
        onClick={() => setSelectedType("Terreno")}
      >
        Terreno
      </button>
    </div>
  );
}