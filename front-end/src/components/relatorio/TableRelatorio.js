/**
 * TableRelatorio - componente de tabela flexível para relatório
 * @param {Object[]} data - array de objetos (linhas)
 * @param {Array} headers - array de objetos { key, label, align, render? }
 * @param {string} title - título da tabela
 */
export default function TableRelatorio({
  data = [],
  headers = [],
  title = "Tabela Detalhada",
}) {  
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Título da tabela */}
      {title && (
        <h2 className="text-xl font-bold text-[#273668] mb-4 mt-2 text-left w-full max-w-4xl">
          {title}
        </h2>
      )}

      <div className="overflow-x-auto w-full max-w-4xl rounded-lg">
        <table className="min-w-full border-separate border-spacing-0 shadow-md rounded-lg">
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={header.key || idx}
                  className={
                    "px-4 py-2 bg-[#273668] text-white font-semibold text-xs border-b border-gray-300 " +
                    (header.align === "right"
                      ? "text-right"
                      : header.align === "center"
                      ? "text-center"
                      : "text-left")
                  }
                  style={{ minWidth: 90 }}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hasData ? (
              data.map((row, i) => (
                <tr key={row.id || i} className="bg-white even:bg-[#f5f7fa]">
                  {headers.map((header, j) => (
                    <td
                      key={header.key || j}
                      className={
                        "text-xs px-2 py-2 border-b border-gray-200 " +
                        (header.align === "right"
                          ? "text-right"
                          : header.align === "center"
                          ? "text-center"
                          : "text-left")
                      }
                    >
                      {header.render
                        ? header.render(row[header.key], row)
                        : row[header.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center text-gray-500 py-6 italic"
                >
                  Não há itens para exibir.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
