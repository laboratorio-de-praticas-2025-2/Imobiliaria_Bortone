import { Divider } from "antd";
import HomeNavbar from "@/components/home/HomeNavbar";
import HomeFooter from "@/components/home/HomeFooter";
import FaqContent from "@/components/faq/FaqContent";

export default function FaqPage() {
    return (
      <>
        <HomeNavbar className="md:!bg-[#050d2de3]" />
        <div className="banner-faq flex flex-col md:gap-4 justify-center md:ps-52 ps-10">
          <p className="md:text-7xl text-2xl font-bold text-white">
            Perguntas<p>frequentes</p>
          </p>
          <p className="md:text-4xl text-sm text-white">
            Ficou com alguma dúvida? <p>Nós temos as repostas!</p>
          </p>
        </div>
        <FaqContent />
        <Divider size="large" />
        <HomeFooter />
      </>
    );
}