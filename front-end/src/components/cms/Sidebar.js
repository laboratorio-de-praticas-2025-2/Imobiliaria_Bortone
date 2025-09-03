import { IoMenu } from "react-icons/io5";
import Image from "next/image";

export default function Sidebar() {
  return (
    <div
      className="fixed top-0 left-0 h-full w-20
                   bg-gradient-to-b from-[#2E3F7C] to-[#0C1121] 
                   pt-12 pb-6 
                   flex flex-col justify-between items-center
                   z-50"
    >
      <button>
        <IoMenu size={40} color="#FFFFFF" />
      </button>
      <Image
        src="/images/logo.svg"
        alt="Logo Bortone"
        width={70}
        height={70}
        className="object-contain"
      />
    </div>
  );
}