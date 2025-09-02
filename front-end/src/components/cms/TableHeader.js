'use client';
import { Button, Input } from "antd";
import { IoSearchSharp } from "react-icons/io5";
import DropdownFilter from "../vitrine/DropdownFilter";

const { Search } = Input;

const optionsOrder = ["Ordem alfabetica", "Data de inclusão"];

export default function TableHeader({onSearch, onClickNew, buttonText, buttonIcon, handleSelectOrder, filterData, updateFilterData}) {
    return (
      <div className="w-full flex justify-between items-center px-4 py-4 bg-[var(--primary)] rounded-t-4xl">
        <Button
          type="primary"
          onClick={onClickNew}
          className="!bg-white !text-[var(--primary)] !font-bold !border-0 !rounded-full h-12 !text-lg !px-4 hover:!bg-[var(--primary)] hover:!text-white transition-colors"
        >
          {buttonText}
          {buttonIcon && <span className="ml-2">{buttonIcon}</span>}
        </Button>
        <div className="flex gap-4 items-center">
          <Search
            placeholder="Pesquisar"
            onSearch={onSearch}
            allowClear
            className="search-cms !text-[var(--primary)]"
            prefix={
              <IoSearchSharp className="text-[var(--primary)]" size={18} />
            }
          />
          <DropdownFilter
            options={optionsOrder}
            placeholder={"Ordenar por"}
            selected={filterData.order || "Ordenar por"}
            handleSelect={handleSelectOrder}
            setSelected={(value) =>
              updateFilterData({ order: value === "Ordenar por" ? null : value })
            }
          />
        </div>
      </div>
    );
}