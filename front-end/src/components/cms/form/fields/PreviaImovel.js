import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import { useState } from "react";
import { handleImgError } from "@/utils/imageFallback";

export default function PreviaImovel({ fileList = [], onRemove }) {
  const [imageErrors, setImageErrors] = useState(new Set());

  const handleImageError = (fileId, src, error) => {
    console.log('ERROR PREVIA: Erro ao carregar imagem:', {
      uid: fileId,
      src: src,
      error: error?.message || error
    });
    setImageErrors(prev => new Set([...prev, fileId]));
  };

  return (
    <div className="flex h-full gap-2 pl-2">
      {fileList.map((file) => {
        const src = file.url || file.thumbUrl || (file.originFileObj && URL.createObjectURL(file.originFileObj));
        
        const hasError = imageErrors.has(file.uid);
        const isHttpUrl = src && (src.startsWith('http://') || src.startsWith('https://'));
        const isBlobUrl = src && src.startsWith('blob:');
        
        console.log('DEBUG PREVIA: File uid:', file.uid);
        console.log('DEBUG PREVIA: File name:', file.name);
        console.log('DEBUG PREVIA: File src:', src);
        console.log('DEBUG PREVIA: isHttpUrl:', isHttpUrl);
        console.log('DEBUG PREVIA: isBlobUrl:', isBlobUrl);
        console.log('DEBUG PREVIA: hasError:', hasError);
        console.log('DEBUG PREVIA: file object:', file);
        
        if (!src) {
          return (
            <div key={file.uid} className="relative">
              <div className="w-[100px] h-full bg-gray-200 rounded-2xl flex items-center justify-center">
                <span className="text-xs text-gray-500">Sem URL</span>
              </div>
              <button
                type="button"
                className="absolute top-1 -left-1 bg-white rounded-full shadow p-1"
                onClick={() => onRemove(file)}
              >
                <AiOutlineClose className="!text-[var(--primary)] !border-[var(--primary)] !w-4 !h-4" />
              </button>
            </div>
          );
        }
        
        return (
          <div key={file.uid} className="relative">
            {/* Sempre use img tag para máxima compatibilidade no modo de edição */}
            <img
              src={src || '/404.png'}
              alt={file.name || "Prévia da imagem"}
              className="w-[100px] h-full object-cover rounded-2xl border border-gray-200"
              onError={(e) => {
                handleImageError(file.uid, src, e);
                handleImgError(e);
              }}
              onLoad={() => {
                console.log('SUCCESS PREVIA: Imagem carregada:', {
                  uid: file.uid,
                  src: src,
                  name: file.name
                });
              }}
              style={{
                backgroundColor: hasError ? '#f3f4f6' : 'transparent'
              }}
            />
            
            {/* Overlay de erro se a imagem falhou */}
            {hasError && (
              <div className="absolute inset-0 bg-gray-200 rounded-2xl flex items-center justify-center">
                <span className="text-xs text-gray-500 text-center px-2">
                  Erro ao carregar
                </span>
              </div>
            )}
            
            <button
              type="button"
              className="absolute top-1 -left-1 bg-white rounded-full shadow p-1 hover:bg-gray-100 transition-colors"
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
