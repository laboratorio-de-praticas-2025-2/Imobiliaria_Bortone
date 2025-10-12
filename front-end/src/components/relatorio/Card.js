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
            rounded-xl px-6 md:px-6 xl:px-7 py-4 !border-0 !bg-[#EEF0F9] shadow-none                          
            transition-colors cursor-default"
    >
      <div className="grid grid-col  content-evenly  w-full h-full">
        <span
          className={`w-full leading-tight text-md lg:text-xl  text-[var(--primary)] font-semibold ${className} `}
        >
          {label}
        </span>

        <div className="flex items-start justify-between w-full mt-4">
          <span
            className={`text-4xl md:text-3xl lg:text-5xl font-bold text-[var(--primary)] leading-none mb-2 ${classNameNumber} pl-1 `}
          >
            {value}
          </span>
          <div className="mt-2 md:mt-4 lg:mt-10">{icon}</div>
        </div>
      </div>
    </div>
  );
}
