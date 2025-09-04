export default function ConfirmModal({ message, onConfirm, onCancel}){
    return(
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <p className="mb-4">{message}</p>
            </div>
        </div>

    )
}