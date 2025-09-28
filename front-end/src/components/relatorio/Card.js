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
            rounded-xl px-10 md:px-3 xl:px-7 py-4 !border-0 !bg-[#EEF0F9] !shadow-md                          
            transition-colors cursor-default"
    >
      <div className="grid grid-col  content-evenly  w-full h-full">
        <span
          className={`w-full leading-tight text-md lg:text-xl  text-[var(--primary)] font-semibold ${className} `}
        >
          {label}
        </span>

        <div className="flex items-center justify-between w-full mt-4">
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
