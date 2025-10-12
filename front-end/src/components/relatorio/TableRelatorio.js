import logo from "@/../public/images/LogoAzul.svg";
import Image from "next/image";

/**
 * TableRelatorio - componente de tabela flexível para relatório
 * @param {Object[]} data - array de objetos (linhas)
 * @param {Array} headers - array de objetos { key, label, align, render? }
 * @param {string} title - título da tabela
 * @param {number} rowsPerPage - número de linhas por página
 * @param {number} returnPages  - retorna pages
 */
export default function TableRelatorio({
  data = [],
  headers = [],
  title = "Tabela Detalhada",
  rowsPerPage = 18,
  returnPages = true,
}) {
  const hasData = Array.isArray(data) && data.length > 0;

  const cellStyles = {
    padding: "4px 8px",
    border: "1px solid #ddd",
    fontSize: "11px",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "normal",
    lineHeight: "1.2",
  };

  // Se não há dados ou tem menos que o limite, renderiza normalmente
  if (!hasData || data.length <= rowsPerPage) {
    const tableContent = (
      <div className="w-full flex flex-col items-center table-section">
        {title && (
          <h2 className="text-xl font-bold text-[#273668] mb-4 mt-2 text-left w-full max-w-4xl">
            {title}
          </h2>
        )}

        <div className="overflow-x-auto w-full max-w-4xl rounded-lg">
          <table
            className="min-w-full border-separate border-spacing-0 shadow-md rounded-lg"
            style={{
              borderCollapse: "collapse",
              width: "100%",
              fontSize: "11px",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr>
                {headers.map((header, idx) => (
                  <th
                    key={header.key || idx}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#273668",
                      color: "white",
                      fontWeight: "bold",
                      border: "1px solid #ddd",
                      fontSize: "11px",
                      textAlign:
                        header.align === "right"
                          ? "right"
                          : header.align === "center"
                          ? "center"
                          : "left",
                      minWidth: "90px",
                    }}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hasData ? (
                data.map((row, i) => (
                  <tr
                    key={row.id || i}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#ffffff" : "#f5f7fa",
                      pageBreakInside: "avoid",
                      breakInside: "avoid",
                    }}
                  >
                    {headers.map((header, j) => (
                      <td
                        key={header.key || j}
                        style={{
                          ...cellStyles,
                          padding: "4px 8px",
                          border: "1px solid #ddd",
                          fontSize: "11px",
                          textAlign:
                            header.align === "right"
                              ? "right"
                              : header.align === "center"
                              ? "center"
                              : "left",
                        }}
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
                    style={{
                      textAlign: "center",
                      color: "#6b7280",
                      padding: "24px 0",
                      fontStyle: "italic",
                    }}
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

    // Se returnPages é true, envolve em uma página
    return returnPages ? (
      <div className="page">
        <header>
          <Image src={logo.src} alt="Logo Bortone" width={180} height={50} />
        </header>
        {tableContent}
      </div>
    ) : (
      tableContent
    );
  }

  // Divide os dados em chunks de rowsPerPage
  const chunks = [];
  for (let i = 0; i < data.length; i += rowsPerPage) {
    chunks.push(data.slice(i, i + rowsPerPage));
  }

  // Renderiza múltiplas páginas de tabela
  return (
    <>
      {chunks.map((chunkData, pageIndex) => (
        <div key={`table-page-${pageIndex}`} className="page">
          <header>
            <Image src={logo.src} alt="Logo Bortone" width={180} height={50} />
          </header>

          <div className="table-section">
            <div className="w-full flex flex-col items-center">
              {title && (
                <h2 className="text-xl font-bold text-[#273668] mb-4 mt-2 text-left w-full max-w-4xl">
                  {title}{" "}
                  {chunks.length > 1
                    ? `(Página ${pageIndex + 1} de ${chunks.length})`
                    : ""}
                </h2>
              )}

              <div className="overflow-x-auto w-full max-w-4xl rounded-lg">
                <table
                  className="min-w-full border-separate border-spacing-0 shadow-md rounded-lg"
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    fontSize: "11px",
                    tableLayout: "fixed",
                  }}
                >
                  <thead>
                    <tr>
                      {headers.map((header, idx) => (
                        <th
                          key={header.key || idx}
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "#273668",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid #ddd",
                            fontSize: "11px",
                            textAlign:
                              header.align === "right"
                                ? "right"
                                : header.align === "center"
                                ? "center"
                                : "left",
                            minWidth: "90px",
                          }}
                        >
                          {header.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chunkData.map((row, i) => (
                      <tr
                        key={row.id || i}
                        style={{
                          backgroundColor: i % 2 === 0 ? "#ffffff" : "#f5f7fa",
                        }}
                      >
                        {headers.map((header, j) => (
                          <td
                            key={header.key || j}
                            style={{
                              padding: "4px 8px",
                              border: "1px solid #ddd",
                              fontSize: "11px",
                              textAlign:
                                header.align === "right"
                                  ? "right"
                                  : header.align === "center"
                                  ? "center"
                                  : "left",
                            }}
                          >
                            {header.render
                              ? header.render(row[header.key], row)
                              : row[header.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mostra o total de registros na última página */}
              {pageIndex === chunks.length - 1 && (
                <div className="text-xs text-gray-500 mt-2 w-full max-w-4xl text-right">
                  Total de registros: {data.length}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
