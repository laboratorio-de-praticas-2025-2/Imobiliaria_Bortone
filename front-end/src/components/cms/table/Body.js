export default function Body({ children, title, type }) {
  return (
    <div className="h-full">
      {/* Header com título e filtros */}
      <div className="h-[30vh] w-full bg-[var(--secondary)] flex flex-col justify-center sm:px-16 px-3 text-white font-bold">
        <div className="flex items-center justify-between w-full">
          <p className={`text-3xl ${type === "dashboard" ? "hidden sm:block" : ""}`}>{title}</p>

          {type === "dashboard" && (
            <div className="flex items-center flex-col sm:flex-row gap-3">
              {/* Campo de pesquisa */}
              <div className="flex items-center bg-[#f5f7ff] rounded-full px-4 py-2 text-[var(--primary)]">
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
                  className="bg-transparent outline-none text-[var(--primary)] placeholder-[var(--primary)] text-sm"
                />
              </div>

              {/* Inputs de data */}
              <div className="flex items-center gap-2 text-[var(--primary)]">
                <label className="bg-[#f5f7ff] rounded px-2 py-1 text-sm flex items-center">
                  De:
                  <input
                    type="date"
                    className="ml-1 bg-transparent outline-none"
                  />
                </label>
                <label className="bg-[#f5f7ff] rounded px-2 py-1 text-sm flex items-center">
                  Ate:
                  <input
                    type="date"
                    className="ml-1 bg-transparent outline-none"
                  />
                </label>
              </div>
            </div>
          )}
          {/* Barra de pesquisa e filtros */}
        </div>
      </div>

      {/* Conteúdo abaixo do cabeçalho */}
      <div className="px-5 mt-[-9vh] flex items-center justify-center w-full">
        {children}
      </div>
    </div>
  );
}
