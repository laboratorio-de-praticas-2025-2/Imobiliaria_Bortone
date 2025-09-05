import { PiBuildingApartmentBold } from "react-icons/pi";
export default function ApartmentRentCard() {
  return (
    <div
      className="group h-[100px] md:!h-[150px] !w-full flex  items-center    rounded-xl px-10 md:px-3 xl:px-8 2xl:px-10 !border-0 !bg-[#EEF0F9] !shadow-md
            hover:!bg-[var(--primary)] focus:!bg-[var(--primary)] active:!bg-[var(--primary)]
            hover:!border-0 focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-md
            transition-colors cursor-pointer"
    >
      <div className="grid grid-col  content-evenly  w-full h-full">
        <span className="w-full leading-tight text-md xl:text-lg text-[var(--primary)] group-hover:text-white transition-colors">
          Número total apartamentos alugados
        </span>

        <div className="flex items-center justify-between w-full ">
          <span className="text-4xl md:text-3xl lg:text-5xl font-bold text-[var(--primary)] group-hover:text-white transition-colors">
            50
          </span>
          <PiBuildingApartmentBold className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
}
