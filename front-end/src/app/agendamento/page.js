"use client";
import { FaBed, FaBath, FaFileAlt, FaPercent } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import HomeNavbar from "@/components/home/HomeNavbar";

export default function Agendamento() {
  return (
    <>
      <HomeNavbar />
      <main className="min-h-screen bg-white flex flex-col relative ">
        {/* Barra de progresso */}
        <div className="absolute top-0 w-full flex justify-between items-center px-12 py-6 gap-2">
          <div className="flex items-center gap-2 text-[#ffffff]">
            <IoIosCheckmarkCircle color="white" size={16} />
            <span className="font-bold text-white whitespace-nowrap">
              Sua Escolha
            </span>
          </div>
          <div className="w-full h-[2px] shadow bg-white" />
          <div className="flex items-center gap-2 text-[#4C62AE]">
            <IoIosCheckmarkCircle color="#4C62AE" size={16} />
            <span className="font-bold  whitespace-nowrap">Sua Escolha</span>
          </div>
          <div className="w-full h-[2px] shadow bg-white" />
          <div className="flex items-center gap-2 text-[#4C62AE]">
            <IoIosCheckmarkCircle color="#4C62AE" size={16} />
            <span className="font-bold">Finalizar</span>
          </div>
        </div>

        
      </main>
    </>
  );
}
