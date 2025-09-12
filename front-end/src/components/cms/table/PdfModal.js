import { Spin } from "antd";
import { IoShareSocialSharp } from "react-icons/io5";
import { BsFillPrinterFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

export default function PdfModal({
  loading,
  pdfReady,
  onClose,
  onDownload,
  onShare,
  onPrint,
  toast,
}) {
  return (
    (loading || pdfReady) && (
      <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center">
        <div className="md:w-[80vw] w-[90vw] h-[90vh] rounded-4xl bg-white flex flex-col md:flex-row overflow-hidden">
          {/* Coluna esquerda - Preview do PDF */}
          <div className="flex flex-1 justify-center items-center">
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
                  <p className="md:text-2xl text-lg font-bold">Relatorio-Exemplo.pdf</p>
                  <div className="flex gap-6">
                    <span className="md:text-xl">2 MB</span>
                    <span className="md:text-xl">2 Páginas</span>
                  </div>
                  <div className="flex gap-3 mt-7 justify-between">
                    <button className="bg-white !text-[var(--primary)] !font-bold md:px-10 px-3 rounded-full" onClick={onDownload}>
                      Baixar PDF
                    </button>
                    <button
                      className="border-2 border-white rounded-full p-3 !text-white"
                      onClick={onShare}
                    >
                      <IoShareSocialSharp size={20} />
                    </button>
                    <button
                      className="border-2 border-white rounded-full p-3 !text-white"
                      onClick={onPrint}
                    >
                      <BsFillPrinterFill size={20} />
                    </button>
                    <button
                      className="border-2 border-white rounded-full p-3 !text-white"
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
