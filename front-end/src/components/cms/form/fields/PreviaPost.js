import Image from "next/image";

export default function PreviaPost({ fileList, title, content }) { 
  // Pega a data de hoje no formato DD/MM/AAAA
  const today = new Date();
  const formattedDate = today.toLocaleDateString("pt-BR");

  return (
    <div className=" w-full sm:min-h-[200px] min-h-[500px] flex items-center justify-center border border-gray-300 rounded-2xl bg-white relative">
      <p className="absolute top-[-18px] left-10 font-bold text-lg bg-white">
        Prévia
      </p>
      <div className="flex flex-col justify-between w-full py-9 px-7 gap-6 overflow-auto max-h-[55vh]">
        <p className="text-3xl font-bold break-words">
          {title || "Lorem Ipsum Dolor Sit Amem"}
        </p>
        <div>
          <div className="w-full justify-between flex gap-3.5 mb-2">
            <p className="text-gray-500 text-lg">por Administrador</p>
            <p className="text-gray-500 text-lg">{formattedDate}</p>
          </div>
          {fileList.length > 0 ? (
            <Image
              src={URL.createObjectURL(fileList[0].originFileObj)}
              alt="Preview"
              width={120}
              height={320}
              className="h-80 w-full object-cover "
            />
          ) : (
            <div className=" h-80 w-full bg-gray-200" />
          )}
        </div>
        <p className="text-lg">
          {content ||
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
        </p>
      </div>
    </div>
  );
}
