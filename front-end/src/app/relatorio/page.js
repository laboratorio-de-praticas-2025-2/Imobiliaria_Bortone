"use client";

import { Table as AntTable, Spin, message } from "antd";
import { useState } from "react";
import { TableBody, TableFooter, TableHeader } from "@/components/cms/table";
import SidebarNav from "@/components/cms/SidebarNav";
import Sidebar from "@/components/cms/Sidebar";
import SidebarLinks from "@/components/cms/SidebarLinks";
import "@/styles/relatorio.css";
import { AiFillPrinter } from "react-icons/ai";
import { IoShareSocialSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import { HiOutlineExclamationCircle } from "react-icons/hi";


export default function TableRelatorio() {
  const [toast, setToast] = useState(null);
  const showToast = (fileName, action) => {
    setToast({ fileName, action });
    setTimeout(() => setToast(null), 3000); // some após 3s
  };

  const [loading, setLoading] = useState(false);
  const [pdfReady, setPdfReady] = useState(false); // indica que o PDF gerado deve aparecer
  const [filterData, setFilterData] = useState({ order: null, search: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // 🔹 MOCK de dados
  const mockData = Array.from({ length: 20 }, (_, i) => ({
    key: i,
    nome: `Relatório ${i + 1}`,
    acao: "Gerar PDF",
  }));

  // 🔹 Colunas da tabela
  const columns = [
    {
      title: "Nome do Relatório",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Ação",
      dataIndex: "acao",
      key: "acao",
      render: (text, record) => (
        <button
          className="gerar_pdf"
          onClick={() => gerarPDF(record)}
        >
          {text}
        </button>
      ),
    },
  ];

  // 🔹 Filtragem
  const filteredData = mockData.filter((item) =>
    item.nome.toLowerCase().includes(filterData.search?.toLowerCase() || "")
  );

  // 🔹 Paginação
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // 🔹 Handlers
  const onSearch = (value) => setFilterData({ ...filterData, search: value });
  const handleSelectOrder = (order) => setFilterData({ ...filterData, order });
  const updateFilterData = (newData) =>
    setFilterData((prev) => ({ ...prev, ...newData }));

  const gerarPDF = (record) => {
    setLoading(true);
    setPdfReady(false);
    setTimeout(() => {
      setLoading(false);
      setPdfReady(true);
      message.success(`Relatório "${record.nome}" gerado com sucesso!`);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen relative font-glacial">

      <div className="nav absolute top-0 left-0 w-full h-[253px] bg-[#F39200] -z-10">
        <p className="texto_nav text-white text-4xl pl-36 pt-16">Relatórios</p>
      </div>

    
        <Sidebar>
          <SidebarNav />
          <SidebarLinks />
        </Sidebar>
 

      {/* Tela de carregamento / PDF */}
      {(loading || pdfReady) && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center">
          <div className="pdf_modal rounded-4xl bg-white flex overflow-hidden">
            {/* Coluna esquerda - Preview do PDF */}
            <div className="col_esquerda_pdf">
              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-xl font-bold">Gerando relatório em PDF...</p>
                  <Spin size="large" />
                </div>
              ) : (
                <p className="text-xl text-gray-500">Preview do PDF aqui</p>
              )}
            </div>

            {/* Coluna direita - Informações e ações */}
            {!loading && (
              <div
                className="col_direita_pdf"
                style={{
                  background: "linear-gradient(180deg, #304383 0%, #0B0F1D 100%)",
                }}
              >
                <div className="flex justify-center items-center h-full">
                    <div className="relatorioFinal flex flex-col gap-4">
                        <p className="pdf_gerado">PDF Gerado com sucesso</p>
                        <p className="nome_arquivo">Relatorio-Exemplo.pdf</p>
                        <div className="flex gap-6">
                        <span>2 MB</span>
                        <span>2 Páginas</span>
                        </div>

                        <div className="botoes flex gap-3 mt-7">
                        <button className="btn_baixar"
                            onClick={() => {
                                // URL do PDF gerado (pode ser uma URL do backend ou mock local)
                                const url = "/relatorios/Relatorio-Exemplo.pdf"; 
                                const link = document.createElement("a");
                                link.href = url;
                                link.download = "Relatorio-Exemplo.pdf"; // Nome do arquivo ao baixar
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                
                                
                               setToast({ fileName: "Relatorio-Exemplo.pdf", action: "Download concluído" });
                               setTimeout(() => setToast(null), 5000);
                            }}
                        >
                            Baixar
                        </button>

                        <button className="btn_compartilhar"
                            onClick={async () => {
                                const fileUrl = "/relatorios/Relatorio-Exemplo.pdf";
                                const fileName = "Relatorio-Exemplo.pdf";

                                if (navigator.share) {
                                try {
                                    await navigator.share({
                                    title: "Compartilhar PDF",
                                    text: `Confira o relatório: ${fileName}`,
                                    url: fileUrl,
                                    });
                                    message.success("PDF compartilhado com sucesso!");
                                } catch (err) {
                                    console.error(err);
                                    message.error("Falha ao compartilhar o PDF");
                                }
                                } else {
                                // Fallback: copiar link para a área de transferência
                                navigator.clipboard.writeText(window.location.origin + fileUrl);
                                message.info("Link copiado para a área de transferência!");
                                }

                                setToast({ fileName: "Relatorio-Exemplo.pdf", action: "Compartilhamento concluído" });
                                setTimeout(() => setToast(null), 5000);
                            }}
                            >
                            <IoShareSocialSharp className="icon"/>
                        </button>

                        <button className="btn_imprimir"
                            onClick={() => {
                                const fileUrl = "/relatorios/Relatorio-Exemplo.pdf"; // caminho do PDF
                                const printWindow = window.open(fileUrl, "_blank");
                                printWindow.onload = function () {
                                printWindow.focus();
                                printWindow.print();
                                };

                                setToast({ fileName: "Relatorio-Exemplo.pdf", action: "Impressão concluído" });
                                setTimeout(() => setToast(null), 5000);
                            }}
                        >
                            <AiFillPrinter className="icon"/>
                        </button>

                        <button className="btn_fechar" onClick={() => setPdfReady(false)}>
                            <MdClose className="icon"/>
                        </button>
                        </div>
                    </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-5 right-0 w-120 bg-white shadow-lg rounded-xl p-4 flex items-start gap-3 z-50 animate-slide-in">
          <IoCheckmarkCircle className="text-green-500 text-2xl mt-1" />
          <div className="flex flex-col">
            <span className="font-bold text-gray-800">{toast.fileName}</span>
            <span className="text-gray-500 text-sm">{toast.action}</span>
          </div>
        </div>
      )}


      {/* Conteúdo principal */}
      <div className="tabela flex-1 ml-25 mr-5 mt-47 flex flex-col">
        <TableHeader
          onSearch={onSearch}
          href="#"
          buttonText="Novo Relatório"
          filterData={filterData}
          handleSelectOrder={handleSelectOrder}
          updateFilterData={updateFilterData}
        />

        {/* Corpo da tabela */}
        <TableBody table>
            {paginatedData.length > 0 ? (
                !loading || pdfReady ? (
                  <AntTable
                    columns={columns}
                    dataSource={paginatedData}
                    pagination={false}
                    rowKey="key"
                  />
                ) : (
                  <div className="flex justify-center items-center h-40">
                    <Spin size="large" />
                  </div>
                )
              ) : (
                <div className="w-full flex justify-center mt-8">
                  <div className="aviso">
                    <div className="flex items-center gap-2">
                      <HiOutlineExclamationCircle className="icon_aviso"/>
                      <span>Atenção</span>
                    </div>
                    <p className="miniTextoAviso">
                      Não foi possível exibir os relatórios devido à falta de existência do mesmo.
                    </p>
                    <button
                      className="btn_recarregar"
                      onClick={() => window.location.reload()} // ou chamar função de fetch mock
                    >
                      Recarregar
                    </button>
                  </div>
                </div>
              )}
          </TableBody>

        <div className="mt-auto mb-6">
          <TableFooter
            postsData={filteredData}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}
