"use client";

import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import PdfModal from "@/components/cms/table/PdfModal";
import RelatorioTable from "@/components/cms/table/RelatorioTable";
import { message } from "antd";
import { useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function TableRelatorio() {
  const [toast, setToast] = useState(null);
  const showToast = (fileName, action) => {
    setToast({ fileName, action });
    setTimeout(() => setToast(null), 3000);
  };

  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [filterData, setFilterData] = useState({ order: null, search: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const mockData = Array.from({ length: 20 }, (_, i) => ({
    key: i,
    nome: `Relatório ${i + 1}`,
    acao: "Gerar PDF",
  }));

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
        <button className="bg-[var(--primary)] !text-white font-bold py-2 px-4 rounded-full" onClick={() => gerarPDF(record)}>
          {text}
        </button>
      ),
    },
  ];

  const filteredData = mockData.filter((item) =>
    item.nome.toLowerCase().includes(filterData.search?.toLowerCase() || "")
  );
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

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

  // PDF Modal handlers
  const handleDownload = () => {
    const url = "/relatorios/Relatorio-Exemplo.pdf";
    const link = document.createElement("a");
    link.href = url;
    link.download = "Relatorio-Exemplo.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Relatorio-Exemplo.pdf", "Download concluído");
  };
  const handleShare = async () => {
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
        message.error("Falha ao compartilhar o PDF");
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + fileUrl);
      message.info("Link copiado para a área de transferência!");
    }
    showToast("Relatorio-Exemplo.pdf", "Compartilhamento concluído");
  };
  const handlePrint = () => {
    const fileUrl = "/relatorios/Relatorio-Exemplo.pdf";
    const printWindow = window.open(fileUrl, "_blank");
    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
    };
    showToast("Relatorio-Exemplo.pdf", "Impressão concluído");
  };
  const handleClose = () => setPdfReady(false);

  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <CMS.Body title="Relatórios">
          <PdfModal
            loading={loading}
            pdfReady={pdfReady}
            onClose={handleClose}
            onDownload={handleDownload}
            onShare={handleShare}
            onPrint={handlePrint}
            toast={toast}
          />
          {toast && (
            <div className="fixed top-5 right-0 w-120 bg-white shadow-lg rounded-xl p-4 flex items-start gap-3 z-50 animate-slide-in">
              <IoCheckmarkCircle className="text-green-500 text-2xl mt-1" />
              <div className="flex flex-col">
                <span className="font-bold text-gray-800">
                  {toast.fileName}
                </span>
                <span className="text-gray-500 text-sm">{toast.action}</span>
              </div>
            </div>
          )}
          <CMS.Table>
            <CMS.TableHeader
              onSearch={onSearch}
              handleSelectOrder={handleSelectOrder}
              filterData={filterData}
              updateFilterData={updateFilterData}
              newButton={false}
            />
            <CMS.TableBody table={true}>
              <RelatorioTable
                columns={columns}
                data={paginatedData}
                loading={loadingTable}
                pdfReady={pdfReady}
              />
            </CMS.TableBody>
            <CMS.TableFooter
              postsData={filteredData}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </CMS.Table>
        </CMS.Body>
      </div>
    </>
  );
}
