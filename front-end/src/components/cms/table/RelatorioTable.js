import { Table } from "antd";
import { PiWarningCircleBold } from "react-icons/pi";

export default function RelatorioTable({ columns, data, loading, pdfReady }) {
  if (loading && !pdfReady) {
    return (
      <div className="flex justify-center items-center h-40">
        <span>Carregando...</span>
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <div className="w-full flex justify-center bg-white h-[500px] items-center">
        <div className="rounded-2xl shadow-2xl p-10 flex flex-col gap-5">
          <div className="flex flex-row gap-5 items-center">
            <PiWarningCircleBold size={50} className="text-[var(--primary)]" />
            <div className="flex flex-col gap-2">
              <span className="text-4xl font-bold text-[var(--primary)]">
                Atenção
              </span>
              <p className="max-w-[200px]">
                Não foi possível exibir os relatórios devido à falta de
                existência do mesmo.
              </p>
            </div>
          </div>
          <button
            className="bg-[var(--primary)] !text-white font-bold py-2 px-4 rounded !text-xl"
            onClick={() => window.location.reload()}
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }
  return (
    <Table columns={columns} dataSource={data} rowKey="id" pagination={false} />
  );
}
