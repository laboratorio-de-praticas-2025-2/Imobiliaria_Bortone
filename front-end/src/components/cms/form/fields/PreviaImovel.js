import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";

export default function PreviaImovel({ fileList = [], onRemove }) {
  return (
    <div className="flex h-full gap-2 pl-2">
      {fileList.map((file) => {
        const src =
          file.url || file.thumbUrl || (file.originFileObj && file.url);
        return (
          <div key={file.uid} className="relative">
            <Image
              src={src}
              alt={file.name || "Prévia do banner"}
              width={100}
              height={100}
              className="h-full object-cover rounded-2xl"
            />
            <button
              type="button"
              className="absolute top-1 -left-1 bg-white rounded-full shadow p-1"
              onClick={() => onRemove(file)}
            >
              <AiOutlineClose className="!text-[var(--primary)] !border-[var(--primary)] !w-4 !h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
