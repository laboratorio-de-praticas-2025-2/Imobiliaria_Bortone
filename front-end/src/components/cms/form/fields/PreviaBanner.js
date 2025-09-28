<<<<<<< HEAD
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
<div className="lg:w-100 sm:w-75 w-100 h-80 bg-gray-200 rounded-3xl">
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
              className="preview-fallback h-full w-full flex items-center justify-center text-gray-500"
              style={{ display: "none" }}
>
<p>Erro ao carregar imagem</p>
</div>
</div>
        ) : (
<div className="lg:w-100 sm:w-75 h-80 w-100 bg-gray-200 rounded-3xl flex items-center justify-center">
<p className="text-gray-500">Nenhuma imagem selecionada</p>
</div>
        )}
 
        <div className="lg:w-15 sm:w-3 h-80 w-5 bg-gray-200 rounded-l-3xl" />
</div>
</div>
=======
import Image from "next/image";

export default function PreviaBanner({ fileList, titulo, descricao }) { 
  // Pega a data de hoje no formato DD/MM/AAAA
  const today = new Date();
  const formattedDate = today.toLocaleDateString("pt-BR");

  return (
    <div className="w-full sm:min-h-[200px] min-h-[500px] flex items-center justify-center border border-gray-300 rounded-2xl bg-white relative">
      <p className="absolute top-[-18px] left-10 font-bold text-lg bg-white">Prévia</p>
      <div className="flex flex-col justify-between w-full py-9 px-7 gap-6 overflow-auto max-h-[55vh]">
        {titulo && (
          <p className="text-2xl font-bold break-words">
            {titulo || "Banner sem título"}
          </p>
        )}
        
        <div>
          <div className="w-full justify-between flex gap-3.5 mb-2">
            <p className="text-gray-500 text-lg">por Administrador</p>
            <p className="text-gray-500 text-lg">{formattedDate}</p>
          </div>
          {fileList.length > 0 ? (
            <Image
              src={URL.createObjectURL(fileList[0].originFileObj)}
              alt="Prévia do banner"
              width={600}
              height={320}
              className="h-80 w-full object-cover rounded-lg"
            />
          ) : (
            <div className="h-80 w-full bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Selecione uma imagem para o banner</p>
            </div>
          )}
        </div>
        
        {descricao && (
          <p className="text-lg">
            {descricao || "Descrição do banner aparecerá aqui..."}
          </p>
        )}
      </div>
    </div>
>>>>>>> origin/develop
  );
}