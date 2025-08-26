import HomeNavbar from "@/components/home/HomeNavbar";
import Filtros from "@/components/vitrine/Filtros";
import { Divider } from "antd";

export default function ImoveisPage() {
    return (
      <>
        <HomeNavbar />
        <Filtros/>
        <Divider size="large" style={{margin: 0}} />
      </>
    );
}