import { MdOutlineBedroomParent } from "react-icons/md";
export default function Card({name, label, value, className, icon, classNameNumber}) {
  return (
    <div
      className="group h-[full] md:!h-full !w-full flex  items-center    
            rounded-xl px-10 md:px-3 xl:px-7 !border-0 !bg-[#EEF0F9] !shadow-md
            hover:!bg-[var(--primary)] focus:!bg-[var(--primary)] active:!bg-[var(--primary)]
            hover:!border-0 focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-md
            transition-colors cursor-pointer"
    >
      <div className="grid grid-col  content-evenly  w-full h-full">
      <span className={`w-full leading-tight text-md lg:text-xl  text-[var(--primary)] group-hover:text-white transition-colors ${className} `}>
          {label}
        </span>

        <div className="flex items-center justify-between w-full ">
          <span className={`text-4xl md:text-3xl lg:text-5xl font-bold text-[var(--primary)] group-hover:text-white transition-colors ${classNameNumber} `}>
            {value}
          </span>
            {icon}
        </div>
      </div>
    </div>
  );
}
