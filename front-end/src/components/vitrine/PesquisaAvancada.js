import { TbAdjustmentsHorizontal } from "react-icons/tb";

export default function PesquisaAvancada() {
  return (
    <div className="relative inline-block">
      <button
        className="flex items-center justify-between w-fit gap-2 rounded-full bg-[#EEF0F9] px-4 py-2 !text-[var(--primary)] focus:outline-none font-bold"
      >
        <TbAdjustmentsHorizontal className="ml-2 h-4 w-4 text-[var(--primary)]" />
        Pesquisa avançada
      </button>
    </div>
  );
}
