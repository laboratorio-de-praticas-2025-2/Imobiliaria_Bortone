"use client";

import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import PdfModal from "@/components/cms/table/PdfModal";
import RelatorioTable from "@/components/cms/table/RelatorioTable";
import { getRelatorioData } from "@/services/RelatorioService";
import { message } from "antd";
import { useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";  
import { useReactToPrint } from "react-to-print";

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
  const [reportData, setReportData] = useState(null);
  const [record, setRecord] = useState();
  const pageSize = 5;

  const reportsLines = [
    {
      key: 1,
      nome: `Relatório Geral`,
      pdfNome: "Imobiliaria-Bortone",
      tipo: "geral",
    },
    {
      key: 2,
      nome: `Relatório Imóveis`,
      pdfNome: "Imobiliaria-Bortone-Imoveis",
      tipo: "imoveis",
    },
    {
      key: 3,
      nome: `Relatório Vendas`,
      pdfNome: "Imobiliaria-Bortone-Vendas",
      tipo: "vendas",
    },
    {
      key: 4,
      nome: `Relatório Locações`,
      pdfNome: "Imobiliaria-Bortone-Locacoes",
      tipo: "locacoes",
    },
    {
      key: 5,
      nome: `Relatório Usuários`,
      pdfNome: "Imobiliaria-Bortone-Usuarios",
      tipo: "usuarios",
    },
  ];

  const columns = [
    {
      title: "Nome do Relatório",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Ação",
      dataIndex: "tipo",
      key: "tipo",
      render: (text, record) => (
        <button
          className="bg-[var(--primary)] !text-white font-bold py-2 px-4 rounded-full"
          onClick={() => gerarPDF(record)}
        >
          Gerar PDF
        </button>
      ),
    },
  ];

  const filteredData = reportsLines.filter((item) =>
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

    getRelatorioData()
      .then((res) =>  {
        setReportData(res)
        setRecord(record);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
        setPdfReady(true);
      });
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

  const handlePrint = (ref) => {
    return useReactToPrint({
      contentRef: ref,
      documentTitle: record ? record.pdfNome : "Relatorio-Imobiliaria-Bortone",
      onAfterPrint: () => {
        showToast(record ? `${record.pdfNome}.pdf` : "Relatorio-Imobiliaria-Bortone.pdf", "Impressão concluída!");    
      },
    });
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
            reportData={reportData}
            record={record}
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
