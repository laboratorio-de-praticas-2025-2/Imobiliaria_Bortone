import { Divider } from "antd";
import HomeNavbar from "@/components/home/HomeNavbar";
import HomeFooter from "@/components/home/HomeFooter";

export default function FaqPage() {
    return (
      <>
        <HomeNavbar className="md:!bg-[#050d2de3]" />
        <Divider size="large" />
        <HomeFooter />
      </>
    );
}