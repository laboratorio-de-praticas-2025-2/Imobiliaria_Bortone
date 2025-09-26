import { MdOutlineBedroomParent } from "react-icons/md";
export default function Card({
  name,
  label,
  value,
  className,
  icon,
  classNameNumber,
}) {
  return (
    <div
      className="group h-[full] !w-full flex  items-center    
            rounded-xl px-10 md:px-3 xl:px-7 py-10 md:py-8 xl:py-7  !border-0 !bg-[#EEF0F9] !shadow-md
             focus:!bg-[var(--primary)] active:!bg-[var(--primary)]
             focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-md
            transition-colors cursor-default"
    >
      <div className="grid grid-col  content-evenly  w-full h-full">
        <span
          className={`w-full leading-tight text-md lg:text-xl  text-[var(--primary)] ${className} `}
        >
          {label}
        </span>

        <div className="flex items-center justify-between w-full ">
          <span
            className={`text-4xl md:text-3xl lg:text-5xl font-bold text-[var(--primary)] ${classNameNumber} `}
          >
            {value}
          </span>
          {icon}
        </div>
      </div>
    </div>
  );
}
