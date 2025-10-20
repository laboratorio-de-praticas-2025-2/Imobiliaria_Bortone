export default function Body({ children, title, type, dataInicio, dataFim, onDataInicioChange, onDataFimChange }) {
  // Funções auxiliares para os botões rápidos
  const setUltimoMes = () => {
    if (onDataInicioChange && onDataFimChange) {
      const now = new Date();
      const umMesAtras = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      onDataInicioChange(umMesAtras.toISOString().split('T')[0]);
      onDataFimChange(now.toISOString().split('T')[0]);
    }
  };

  const setTresMeses = () => {
    if (onDataInicioChange && onDataFimChange) {
      const now = new Date();
      const tresMesesAtras = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      onDataInicioChange(tresMesesAtras.toISOString().split('T')[0]);
      onDataFimChange(now.toISOString().split('T')[0]);
    }
  };

  const setSeisMeses = () => {
    if (onDataInicioChange && onDataFimChange) {
      const now = new Date();
      const seisMesesAtras = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      onDataInicioChange(seisMesesAtras.toISOString().split('T')[0]);
      onDataFimChange(now.toISOString().split('T')[0]);
    }
  };

  return (
    <div className="h-full">
      {/* Header com título e filtros */}
      <div className="min-h-[30vh] w-full bg-[var(--secondary)] flex flex-col justify-center sm:px-16 px-3 text-white font-bold py-4">
        <div className="flex items-center justify-between w-full flex-wrap gap-4">
          <p className={`text-3xl ${type === "dashboard" ? "hidden sm:block" : ""}`}>{title}</p>

          {type === "dashboard" && (
            <div className="flex items-center flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Campo de pesquisa */}
              <div className="flex items-center bg-[#f5f7ff] rounded-full px-4 py-2 text-[var(--primary)] w-full sm:w-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Pesquisa"
                  className="bg-transparent outline-none text-[var(--primary)] placeholder-[var(--primary)] text-sm w-full"
                />
              </div>

              {/* Inputs de data com funcionalidade */}
              <div className="flex items-center gap-2 text-[var(--primary)] w-full sm:w-auto flex-wrap">
                <label className="bg-[#f5f7ff] rounded px-2 py-1 text-sm flex items-center flex-1 sm:flex-none">
                  De:
                  <input
                    type="date"
                    value={dataInicio || ''}
                    onChange={(e) => onDataInicioChange && onDataInicioChange(e.target.value)}
                    max={dataFim}
                    className="ml-1 bg-transparent outline-none cursor-pointer text-sm"
                    title="Data de início do período"
                  />
                </label>
                <label className="bg-[#f5f7ff] rounded px-2 py-1 text-sm flex items-center flex-1 sm:flex-none">
                  Até:
                  <input
                    type="date"
                    value={dataFim || ''}
                    onChange={(e) => onDataFimChange && onDataFimChange(e.target.value)}
                    min={dataInicio}
                    className="ml-1 bg-transparent outline-none cursor-pointer text-sm"
                    title="Data de fim do período"
                  />
                </label>
              </div>
            </div>
          )}
          {/* Barra de pesquisa e filtros */}
        </div>

        {/* Botões rápidos de período - apenas para dashboard */}
        {type === "dashboard" && onDataInicioChange && onDataFimChange && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-xs text-white/80 mr-2">Período:</span>
            <button
              onClick={setUltimoMes}
              className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-full transition-colors"
              title="Exibir dados do último mês"
            >
              Último Mês
            </button>
            <button
              onClick={setTresMeses}
              className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-full transition-colors"
              title="Exibir dados dos últimos 3 meses"
            >
              3 Meses
            </button>
            <button
              onClick={setSeisMeses}
              className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-full transition-colors"
              title="Exibir dados dos últimos 6 meses"
            >
              6 Meses
            </button>
            {dataInicio && dataFim && (
              <span className="text-xs text-white/70 ml-2">
                📊 {new Date(dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')} até {new Date(dataFim + 'T00:00:00').toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Conteúdo abaixo do cabeçalho */}
      <div className="px-5 mt-[-9vh] flex items-center justify-center w-full">
        {children}
      </div>
    </div>
  );
}
