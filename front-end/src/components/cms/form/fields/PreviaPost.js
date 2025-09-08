import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function PreviaPost({ fileList, title, content }) { 
  return (
    <div className=" w-full sm:min-h-[200px] min-h-[500px] flex items-center justify-center border border-gray-300 rounded-2xl bg-white relative">
      <p className="absolute top-[-18px] left-10 font-bold text-lg bg-white">
        Prévia
      </p>
      <div className="flex flex-col justify-between w-full">
        <p>{title || "Lorem Ipsum Dolor Sit Amem"}</p>
        <div className="lg:w-15 sm:w-3 h-80 w-5 bg-gray-200 rounded-r-3xl" />
      </div>
    </div>
  );
}
