import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
 
export default function PreviaBanner({ fileList }) {
  const [previewUrl, setPreviewUrl] = useState(null);
 
  useEffect(() => {
    if (!fileList?.length) {
      setPreviewUrl(null);
      return;
    }
 
    const fileItem = fileList[0];
 
    if (fileItem?.originFileObj instanceof Blob) {
      try {
        const objectUrl = URL.createObjectURL(fileItem.originFileObj);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      } catch (err) {
        console.error("Erro ao criar objectURL:", err);
        setPreviewUrl(null);
      }
      return;
    }
 
    if (typeof fileItem?.url === "string" && fileItem.url.length > 0) {
      setPreviewUrl(fileItem.url);
      return;
    }
 
    setPreviewUrl(null);
  }, [fileList]);
 
  return (
<div className="w-full sm:min-h-[200px] min-h-[500px] flex items-center justify-center border border-gray-300 rounded-2xl bg-white relative">
<p className="absolute top-[-18px] left-10 font-bold text-lg bg-white">
        Prévia
</p>
<div className="flex justify-between w-full">
<div className="lg:w-15 sm:w-3 h-80 w-5 bg-gray-200 rounded-r-3xl" />
 
        {typeof previewUrl === "string" && previewUrl.length > 0 ? (
<div className="lg:w-100 sm:w-75 w-100 h-80 bg-gray-200 rounded-3xl overflow-hidden relative">
<img
              src={previewUrl}
              alt="Prévia do banner"
              className="h-full w-full object-cover rounded-3xl"
              onError={(e) => {
                console.error("Erro ao carregar imagem na prévia:", e);
                e.target.style.display = "none";
                const fallback =
                  e.target.parentNode.querySelector(".preview-fallback");
                if (fallback) fallback.style.display = "flex";
              }}
            />
<div
              className="preview-fallback absolute inset-0 h-full w-full flex items-center justify-center text-gray-500 bg-gray-200 rounded-3xl"
              style={{ display: "none" }}
>
<p>Erro ao carregar imagem</p>
</div>
            {/* Indicador de imagem carregada */}
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
              Imagem carregada
            </div>
</div>
        ) : (
<div className="lg:w-100 sm:w-75 h-80 w-100 bg-gray-200 rounded-3xl flex items-center justify-center">
<div className="text-center">
<p className="text-gray-500 mb-2">Nenhuma imagem selecionada</p>
<p className="text-gray-400 text-sm">A prévia aparecerá aqui</p>
</div>
</div>
        )}
 
        <div className="lg:w-15 sm:w-3 h-80 w-5 bg-gray-200 rounded-l-3xl" />
</div>
</div>
  );
}