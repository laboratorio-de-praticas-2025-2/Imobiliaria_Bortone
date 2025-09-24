"use client";
import { Input } from "antd";
import { IoSearchSharp } from "react-icons/io5";
import DropdownFilterPublicidade from "@/components/cms/DropdownFilterPublicidade";
import Link from "next/link";
import PesquisaAvancadaUser from "./pesquisaavancada/PesquisaAvancada";
import PesquisaAvancada from "@/components/cms/form/PesquisaAvancada";
const { Search } = Input;

const optionsOrder = ["Ordem alfabetica", "Data de inclusão"];

export default function TableHeaderPublicidade({
  onSearch,
  href,
  buttonText,
  buttonIcon,
  handleSelectOrder,
  filterData,
  updateFilterData,
  type = undefined,
  newButton = true,
}) {
  return (
    <div
      className={`w-full flex ${
        newButton ? "justify-between" : "justify-end"
      } items-center px-4 py-4 bg-[var(--primary)] rounded-t-4xl gap-2`}
    >
      {newButton && (
        <Link
          href={href}
          className="!bg-white !text-[var(--primary)] !font-bold !border-0 !rounded-full h-[34.4px] !text-lg !px-4 hover:!bg-[var(--primary)] hover:!text-white transition-colors flex gap-2 justify-center items-center"
        >
          <p className="hidden md:flex">{buttonText}</p>
          {buttonIcon && <span className="md:ml-2">{buttonIcon}</span>}
        </Link>
      )}
      <div className="flex md:gap-4 gap-2 items-center">
        {type === "user" && <PesquisaAvancadaUser />}
        {type === "imovel" && <PesquisaAvancada />}
        <Search
          placeholder="Pesquisar"
          onSearch={onSearch}
          allowClear
          className="search-cms !text-[var(--primary)] !h-full"
          prefix={<IoSearchSharp className="text-[var(--primary)]" size={18} />}
        />
        <DropdownFilterPublicidade
          options={optionsOrder}
          placeholder={"Ordenar por"}
          selected={filterData.order || "Ordenar por"}
          handleSelect={handleSelectOrder}
          setSelected={(value) =>
            updateFilterData({ order: value === "Ordenar por" ? null : value })
          }
          classP="hidden md:flex"
          width={"md:w-full w-[20%]"}
        />
      </div>
    </div>
  );
}
