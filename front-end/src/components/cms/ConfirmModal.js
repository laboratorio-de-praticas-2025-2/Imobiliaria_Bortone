import { Button } from "antd";
import { PiWarningCircle } from "react-icons/pi";
export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-2xl w-96 flex flex-col gap-4">
        <div>
          <PiWarningCircle className="text-[var(--secondary)]" size={60} />
          <p className="text-2xl font-bold !mb-2">Confirmação</p>
          <p className="mb-4">{message}</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            className="!rounded-full !bg-[var(--primary)] !text-white !font-bold !px-4 !py-5 !border-transparent 
          hover:!bg-[#293769]
          "
            onClick={onConfirm}
          >
            Confirmar
          </Button>
          <Button
            className="!rounded-full !font-bold !px-4 !py-5
          !bg-white !text-[var(--primary)] !border-[var(--primary)] hover:!bg-[#f0f0f0]
          "
            onClick={onCancel}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
