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
  );
}
