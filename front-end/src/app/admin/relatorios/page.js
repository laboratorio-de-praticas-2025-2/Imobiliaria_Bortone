"use client";

import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import PdfModal from "@/components/cms/table/PdfModal";
import RelatorioTable from "@/components/cms/table/RelatorioTable";
import { getRelatorioData, getAllRelatorios } from "@/services/RelatorioService"; // API para listagem
import { message } from "antd";
import { useRef, useState, useEffect } from "react";
import { exportRelatorioToPdf } from "@/utils/pdfUtils";
import { exportRelatorioToPdfV2 } from "@/utils/pdfUtilsV2";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";

// Funções auxiliares para compartilhamento
const generatePdfAsBlob = async (element, fileName, reportType) => {
  const { exportRelatorioToPdfAsBlob } = await import("@/utils/pdfUtilsV2");
  return await exportRelatorioToPdfAsBlob(element, fileName, reportType);
};

const downloadPdfBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function TableRelatorio() {
  const [toast, setToast] = useState(null);
  const showToast = (fileName, action) => {
    setToast({ fileName, action });
    setTimeout(() => setToast(null), 3000);
  };

  const [loading, setLoading] = useState(false); // Para PDF
  const [loadingTable, setLoadingTable] = useState(true); // Para listagem
  const [pdfReady, setPdfReady] = useState(false);
  const [filterData, setFilterData] = useState({ search: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [reportData, setReportData] = useState(null);
  const [record, setRecord] = useState();
  const [reportList, setReportList] = useState([]);
  const pageSize = 5;

  const componentToPrintRef = useRef();

  // Busca os relatórios da API
  useEffect(() => {
    setLoadingTable(true);
    getAllRelatorios()
      .then((res) => {
        // Adiciona a chave necessária para o Table
        const dataComKey = res.map((r, idx) => ({ ...r, key: idx + 1 }));
        setReportList(dataComKey);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingTable(false));
  }, []);


  // Colunas da tabela
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


  // Filtragem e paginação
  const filteredData = reportList.filter((item) =>
    item.nome.toLowerCase().includes(filterData.search?.toLowerCase() || "")
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const onSearch = (value) => setFilterData({ search: value });

  // Função para gerar PDF
  const gerarPDF = (record) => {
    setLoading(true);
    setPdfReady(false);

    getRelatorioData(record.tipo)
      .then((res) => {
        setReportData(res);
        setRecord(record);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
        setPdfReady(true);
      });
  };

  // Handlers do PDF Modal
  const handleDownload = async () => {
    try {
      if (!componentToPrintRef.current) throw new Error("Ref não encontrado");
      const fileName = record ? `${record.pdfNome}.pdf` : "Relatorio.pdf";
      const reportType = record ? record.tipo : 'geral';
      await exportRelatorioToPdfV2(componentToPrintRef.current, fileName, reportType);
      showToast(fileName, "Download concluído");
    } catch (e) {
      console.error(e);
      message.error("Falha ao gerar PDF");
    }
  };

  const handleShare = async () => {
    try {
      if (!componentToPrintRef.current) throw new Error("Ref não encontrado");
      
      const fileName = record ? `${record.pdfNome}.pdf` : "Relatorio.pdf";
      const reportType = record ? record.tipo : 'geral';
      
      // Gerar PDF como blob
      const pdfBlob = await generatePdfAsBlob(componentToPrintRef.current, fileName, reportType);
      
      if (navigator.share && navigator.canShare) {
        // Usar Web Share API se disponível
        const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Relatório - Imobiliária Bortone",
            text: `Confira o relatório: ${fileName}`,
            files: [file]
          });
          message.success("PDF compartilhado com sucesso!");
        } else {
          // Fallback: baixar o arquivo
          downloadPdfBlob(pdfBlob, fileName);
          message.info("PDF baixado para compartilhamento!");
        }
      } else {
        // Fallback: baixar o arquivo
        downloadPdfBlob(pdfBlob, fileName);
        message.info("PDF baixado para compartilhamento!");
      }
      
      showToast(fileName, "Compartilhamento concluído");
    } catch (error) {
      console.error('Erro ao compartilhar PDF:', error);
      message.error("Falha ao compartilhar o PDF");
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentToPrintRef,
    documentTitle: record ? record.pdfNome : "Relatorio",
    onAfterPrint: () => {
      showToast(record ? `${record.pdfNome}.pdf` : "Relatorio.pdf", "Impressão concluída!");
    },
  });

  const handleClose = () => setPdfReady(false);

  // Render
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
            componentToPrintRef={componentToPrintRef}
          />
          {toast && (
            <div className="fixed top-5 right-0 w-120 bg-white shadow-lg rounded-xl p-4 flex items-start gap-3 z-50 animate-slide-in">
              <IoCheckmarkCircle className="text-green-500 text-2xl mt-1" />
              <div className="flex flex-col">
                <span className="font-bold text-gray-800">{toast.fileName}</span>
                <span className="text-gray-500 text-sm">{toast.action}</span>
              </div>
            </div>
          )}
          <CMS.Table>
            <CMS.TableHeader
              onSearch={onSearch}
              filterData={filterData}
              updateFilterData={(data) => setFilterData(data)}
              newButton={false} // Não há botão "Novo Relatório"
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
