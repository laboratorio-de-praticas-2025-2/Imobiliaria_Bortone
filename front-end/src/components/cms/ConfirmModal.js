import { PiWarningCircle } from "react-icons/pi";
export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-2xl w-96">
        <PiWarningCircle className="text-[var(--secondary)]" size={60} />
        <p className="mb-4">{message}</p>
      </div>
    </div>
  );
}
