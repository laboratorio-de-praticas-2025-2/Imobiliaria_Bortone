import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function PreviaBanner({ fileList }) {
  return (
    <div className=" w-full sm:min-h-[200px] min-h-[500px] flex items-center justify-center border border-gray-300 rounded-2xl bg-white relative">
      <p className="absolute top-[-18px] left-10 font-bold text-lg">Prévia</p>
      <div className="flex justify-between w-full">
        <button className="custom-prev absolute top-1/2 left-0 -translate-y-1/2 z-20">
          <IoIosArrowBack size={70} color="#374a8c" />
        </button>
        <div className="lg:w-15 sm:w-3 h-80 w-5 bg-gray-200 rounded-r-3xl" />
        {fileList.length > 0 ? (
          <div className="lg:w-100 sm:w-75 w-100 h-80 bg-gray-200 rounded-3xl">
            <Image
              src={URL.createObjectURL(fileList[0].originFileObj)}
              alt="Prévia do banner"
              width={120}
              height={320}
              className="h-full w-full object-cover rounded-3xl"
            />
          </div>
        ) : (
          <div className="lg:w-100 sm:w-75 h-80 w-100 bg-gray-200 rounded-3xl" />
        )}
        <div className="lg:w-15 sm:w-3 h-80 w-5 bg-gray-200 rounded-l-3xl" />
        <button className="custom-next absolute top-1/2 right-0 -translate-y-1/2 z-20">
          <IoIosArrowForward size={70} color="#374a8c" />
        </button>
      </div>
    </div>
  );
}
