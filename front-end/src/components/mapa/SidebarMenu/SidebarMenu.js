import SidebarMobile from "./SidebarMobile";
import MenuToggleButton from "@/components/mapa/MenuToggleButton";
import { Drawer, Input } from "antd";
import SidebarDesk from "./SidebarDesk";
import OrderButton from "@/components/mapa/OrderButton";
import { useState } from "react";

const { Search } = Input;

const onSearch = (value) => console.log(value);

export default function SidebarMenu() {
      const [open, setOpen] = useState(false);
    return (
      <div className="">
        {/* --- BOTÃO MOBILE --- */}
        <div className="absolute top-5 left-5 z-[1100] lg:hidden flex justify-between w-[90vw] items-center">
          <MenuToggleButton onToggle={setOpen} />
          <Search
            placeholder="Pesquisar"
            onSearch={onSearch}
            style={{ width: "50%" }}
            allowClear
            className="nav-search-map-mobile"
          />
          <OrderButton onToggle={() => console.log("Ordenar")} />
        </div>

        {/* --- SIDEBAR FIXA DESKTOP --- */}
        <div className="hidden lg:block absolute top-0 left-0 z-[1050] h-full">
          <SidebarDesk />
        </div>

        <div className="md:hidden">
          <Drawer
            placement="left"
            onClose={() => setOpen(false)}
            open={open}
            closable={false}
            width="100%" // largura total
            height="100%" // altura total
            className="!bg-gradient-to-b from-[#2E3F7C] to-[#0C1121] !p-0 !justify-center"
          >
            <SidebarMobile />
          </Drawer>
        </div>
      </div>
    );   

}
