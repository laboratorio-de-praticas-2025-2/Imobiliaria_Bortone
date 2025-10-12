"use client";

import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import PdfModal from "@/components/cms/table/PdfModal";
import RelatorioTable from "@/components/cms/table/RelatorioTable";
import {
  getRelatorioData,
  getAllRelatorios,
} from "@/services/RelatorioService"; // API para listagem
import { message } from "antd";
import { useRef, useState, useEffect } from "react";
import { exportRelatorioToPdf } from "@/utils/pdfUtils";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas-pro";
import html2pdf from "html2pdf.js";
import DateRangeModal from "@/components/relatorio/DateRange";

// Funções auxiliares para compartilhamento
const generatePdfAsBlob = async (element) => {
  const { exportRelatorioToPdfAsBlobDOM } = await import("@/utils/pdfUtils");
  return await exportRelatorioToPdfAsBlobDOM(element);
};

const downloadPdfBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
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
    setTimeout(() => setToast(null), 2000);
  };

  const [loading, setLoading] = useState(false); // Para PDF
  const [loadingTable, setLoadingTable] = useState(true); // Para listagem
  const [pdfReady, setPdfReady] = useState(false);
  const [filterData, setFilterData] = useState({ search: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [reportData, setReportData] = useState(null);
  const [record, setRecord] = useState();
  const [reportList, setReportList] = useState([]);
  const [dateRangeModalVisible, setDateRangeModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState();
  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
  });

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
      dataIndex: "nome",
      key: "nome",
      render: (text, record) => (
        <button
          className="bg-[var(--primary)] !text-white font-bold py-2 px-4 rounded-full cursor-pointer"
          onClick={() => openDateRangeModal(record)}
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

  const openDateRangeModal = (record) => {
    setSelectedRecord(record);
    setDateRangeModalVisible(true);
  };

  // Confirma as datas e abre o PDF
  const handleDateRangeConfirm = async (startDate, endDate, record) => {
    setSelectedDates({ startDate, endDate });
    setDateRangeModalVisible(false);
    setLoading(true);
    setPdfReady(false);

    try {
      const res = await getRelatorioData(record.secoes, startDate, endDate);
      setReportData(res);
      setRecord(selectedRecord);
      setPdfReady(true);
    } catch (err) {
      console.error(err);
      message.error("Erro ao gerar relatório com as datas selecionadas");
    } finally {
      setLoading(false);
    }
  };

  // Fecha o modal de datas
  const handleDateRangeCancel = () => {
    setDateRangeModalVisible(false);
    setSelectedRecord(null);
  };

  // Handlers do PDF Modal
  const handleDownload = async () => {
    try {
      if (!componentToPrintRef.current) throw new Error("Ref não encontrado");
      const fileName = record ? `${record.pdfNome}.pdf` : "Relatorio.pdf";
      await exportRelatorioToPdf(componentToPrintRef.current, fileName);
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

      // Gera o PDF como blob (snapshot idêntico ao preview)
      const pdfBlob = await generatePdfAsBlob(componentToPrintRef.current);

      // Preferir compartilhar ARQUIVO via Web Share API
      if (navigator.share && navigator.canShare) {
        try {
          const file = new File([pdfBlob], fileName, {
            type: "application/pdf",
          });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: "Relatório - Imobiliária Bortone",
              text: `Confira o relatório: ${fileName}`,
              files: [file],
            });
            showToast(fileName, "Compartilhamento concluído");
            return;
          }
        } catch (shareErr) {
          console.warn(
            "Falha ao compartilhar arquivo, aplicando fallback:",
            shareErr
          );
        }
      }

      // Fallback definitivo: baixar o arquivo quando não houver suporte a compartilhar arquivos
      downloadPdfBlob(pdfBlob, fileName);
      message.info(
        "Dispositivo não suporta compartilhar arquivos. PDF baixado."
      );
      showToast(fileName, "PDF baixado para compartilhar");
    } catch (error) {
      console.error("Erro ao compartilhar PDF:", error);
      message.error("Falha ao compartilhar o PDF");
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentToPrintRef,
    documentTitle: record ? record.pdfNome : "Relatorio",
    onAfterPrint: () => {
      showToast(
        record ? `${record.pdfNome}.pdf` : "Relatorio.pdf",
        "Impressão concluída!"
      );
    },
  });

  const handleClose = () => setPdfReady(false);

  // Render
  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <CMS.Body title="Relatórios">
          {/* Modal de seleção de datas */}
          <DateRangeModal
            visible={dateRangeModalVisible}
            onCancel={handleDateRangeCancel}
            onConfirm={(start, end) =>
              handleDateRangeConfirm(start, end, selectedRecord)
            }
          />
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
            dateRange={selectedDates}
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
