import { Spin } from "antd";
import { IoShareSocialSharp } from "react-icons/io5";
import { BsFillPrinterFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import Relatorio from "@/components/relatorio/Relatorio.js";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { exportRelatorioToPdfV2 } from "@/utils/pdfUtilsV2";
import dayjs from "dayjs";

export default function PdfModal({
  loading,
  pdfReady,
  onClose,
  onDownload,
  onShare,
  onPrint,
  toast,
  reportData,  
  record,
  componentToPrintRef,
  dateRange
}) {
  return (
    (loading || pdfReady) && (
      <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center">
        <div className="md:w-[80vw] w-[90vw] h-[90vh] rounded-4xl bg-white flex flex-col md:flex-row overflow-hidden">
          {/* Coluna esquerda - Preview do PDF */}
          <div className="flex flex-1 justify-center items-center overflow-auto">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-xl font-bold">Gerando relatório em PDF...</p>
                <Spin size="large" />
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center overflow-hidden">
                <div
                  className="scale-40 sm:scale-35 md:scale-40 lg:scale-45 xl:scale-50
                h-[297mm] w-[210mm] shadow-lg 
                [&_.page]:m-0 [&_.page]:p-[15mm] [&_.page]:box-border
                [&_.page:first-child]:h-full                
                [&_.page:not(:first-child)]:invisible"
                >
                  <div ref={componentToPrintRef}>
                    <Relatorio data={reportData} reportCapaTitle={record.nome} secoes={record.secoes} dateRange={dateRange} />
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Coluna direita - Informações e ações */}
          {!loading && (
            <div
              className="md:flex-1 p-10"
              style={{
                background: "linear-gradient(180deg, #304383 0%, #0B0F1D 100%)",
              }}
            >
              <div className="flex justify-center items-center h-full md:px-5">
                <div className="!text-white flex flex-col gap-4">
                  <p className="md:text-4xl text-xl font-bold">
                    PDF Gerado com sucesso
                  </p>
                  <p className="md:text-2xl text-lg font-bold">
                    {record?.pdfNome || 'Relatorio'}.pdf
                  </p>
                  <div className="flex gap-6">
                    {dateRange && (
                      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <strong>Período: </strong>
                        {dayjs(dateRange.startDate).format('DD/MM/YYYY')} - {dayjs(dateRange.endDate).format('DD/MM/YYYY')}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-7 justify-between">
                    <button
                      className="bg-white !text-[var(--primary)] !font-bold md:px-10 px-3 rounded-full cursor-pointer"
                      onClick={onDownload}
                    >
                      Baixar PDF
                    </button>
                    {/* <button
                      className="border-2 border-white rounded-full p-3 !text-white cursor-pointer"
                      onClick={onShare}
                    >
                      <IoShareSocialSharp size={20} />
                    </button> */}
                    <button
                      className="border-2 border-white rounded-full p-3 !text-white cursor-pointer"
                      onClick={onPrint}
                    >
                      <BsFillPrinterFill size={20} />
                    </button>
                    <button
                      className="border-2 border-white rounded-full p-3 !text-white cursor-pointer"
                      onClick={onClose}
                    >
                      <IoClose size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
}
