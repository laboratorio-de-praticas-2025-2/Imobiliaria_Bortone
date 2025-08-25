import SidebarMobile from "@/components/SidebarMenu/SidebarMobile";
import MenuToggleButton from "@/components/MenuToggleButton";
import { Drawer, Button,ConfigProvider } from "antd";
import SidebarDesk from "@/components/SidebarMenu/SidebarDesk";
import {  useState } from "react";

export default function SidebarMenu() {
      const [open, setOpen] = useState(false);
    return (
    <div className="">
      {/* --- BOTÃO MOBILE --- */}
      <div className="absolute top-5 left-5 z-[1100] lg:hidden">
        <MenuToggleButton onToggle={setOpen} />
      </div>

      {/* --- SIDEBAR FIXA DESKTOP --- */}
      <div className="hidden lg:block absolute top-0 left-0 z-[1050] h-full">
        <SidebarDesk />
      </div>


      <Drawer
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
        closable={false}
        width="100%"     // largura total
        height="100%"    // altura total
        className="!bg-gradient-to-b from-[#2E3F7C] to-[#0C1121] !p-0 !justify-center"
    >
        <SidebarMobile /> 
      </Drawer>
    </div>
    )   

}
