// components/cms/table/TableHeader.js - VERSÃO CORRIGIDA
"use client";
import { Input } from "antd";
import { IoSearchSharp } from "react-icons/io5";
import DropdownFilter from "@/components/vitrine/DropdownFilter";
import Link from "next/link";
import PesquisaAvancada from "@/components/cms/form/PesquisaAvancada";
const { Search } = Input;

// 🔥 OPÇÕES PADRÃO PARA CASO NÃO SEJAM PASSADAS
const defaultOrderOptions = [
  "Alfabética A-Z",
  "Alfabética Z-A", 
  "Mais recente",
  "Mais antiga"
];

export default function TableHeader({
  onSearch,
  href,
  buttonText,
  buttonIcon,
  handleSelectOrder,
  filterData,
  updateFilterData,
  type = undefined,
  newButton = true,
  onAdvancedFilter,
  orderOptions = defaultOrderOptions // ← USA AS OPÇÕES PADRÃO SE NÃO FOREM PASSADAS
}) {
  
  console.log("🎯 TableHeader - orderOptions:", orderOptions);
  
  return (
    <div className={`w-full flex ${newButton ? "justify-between" : "justify-end"} items-center px-4 py-4 bg-[var(--primary)] rounded-t-4xl gap-2`}>
      {newButton && (
        <Link href={href} className="!bg-white !text-[var(--primary)] !font-bold !border-0 !rounded-full h-[34.4px] !text-lg !px-4 hover:!bg-[var(--primary)] hover:!text-white transition-colors flex gap-2 justify-center items-center">
          <p className="hidden md:flex">{buttonText}</p>
          {buttonIcon && <span className="md:ml-2">{buttonIcon}</span>}
        </Link>
      )}
      <div className="flex md:gap-4 gap-2 items-center">
        {type === "imovel" && <PesquisaAvancada />}
        <Search
          placeholder="Pesquisar"
          onSearch={onSearch}
          allowClear
          className="search-cms !text-[var(--primary)] !h-full"
          prefix={<IoSearchSharp className="text-[var(--primary)]" size={18} />}
        />
        <DropdownFilter
          options={orderOptions} // ← AGORA USA orderOptions
          placeholder={"Ordenar por"}
          selected={filterData?.order || "Ordenar por"}
          handleSelect={(value) => {
            console.log("🎯 Dropdown selecionou:", value);
            if (handleSelectOrder) {
              handleSelectOrder(value);
            }
          }}
          setSelected={(value) => updateFilterData({ order: value === "Ordenar por" ? null : value })}
          classP="hidden md:flex"
          width={"md:w-full w-[20%]"}
        />
      </div>
    </div>
  );
}