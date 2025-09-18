import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
export default function PreviaImovel({ fileList, onRemove }) {
  return (
    <div className="flex h-full gap-2 pl-2">
      {fileList.map((file) => (
        <div key={file.uid} className="relative">
          <Image
            src={URL.createObjectURL(fileList[0].originFileObj)}
            alt="Prévia do banner"
            width={100}
            height={100}
            className="h-full   object-cover rounded-2xl"
          />
          <button
            type="button"
            className="absolute top-1 -left-1 bg-white rounded-full shadow p-1"
            onClick={() => onRemove(file)}
          >
            <AiOutlineClose className="!text-[var(--primary)] !border-[var(--primary)] !w-4 !h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
