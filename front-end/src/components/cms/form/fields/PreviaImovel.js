import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import { useState } from "react";

export default function PreviaImovel({ fileList = [], onRemove }) {
  const [imageErrors, setImageErrors] = useState(new Set());

  const handleImageError = (fileId) => {
    setImageErrors(prev => new Set([...prev, fileId]));
  };

  return (
    <div className="flex h-full gap-2 pl-2">
      {fileList.map((file) => {
        const src =
          file.url || file.thumbUrl || (file.originFileObj && file.url);
        
        const hasError = imageErrors.has(file.uid);
        
        return (
          <div key={file.uid} className="relative">
            {hasError || (src && src.startsWith('http') && !src.includes('localhost')) ? (
              // Use tag img normal para URLs externas ou quando há erro
              <img
                src={src}
                alt={file.name || "Prévia da imagem"}
                className="w-[100px] h-full object-cover rounded-2xl"
                onError={() => handleImageError(file.uid)}
              />
            ) : (
              // Use Next.js Image para URLs locais
              <Image
                src={src}
                alt={file.name || "Prévia da imagem"}
                width={100}
                height={100}
                className="h-full object-cover rounded-2xl"
                onError={() => handleImageError(file.uid)}
              />
            )}
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
