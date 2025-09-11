export default function BotaoPesquisar({onClick}) {
    return (
      <button className="w-full h-12 bg-[var(--primary)] !text-white font-bold rounded-full hover:bg-transparent transition-colors border-2 border-[var(--primary)] hover:!text-[var(--primary)]" onClick={onClick}>
        Pesquisar
      </button>
    );
}