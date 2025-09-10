export default function QuantidadeBotao({label, onClick, active}) {
    return (
      <button className={`w-14 h-10 flex items-center justify-center bg-transparent rounded-full !text-[var(--primary)] hover:bg-[var(--primary)] hover:!text-white transition-colors border-2 border-[var(--primary)] ${active ? '!bg-[var(--primary)] !text-white' : ''}`} onClick={onClick}>
        {label}
      </button>
    );
}