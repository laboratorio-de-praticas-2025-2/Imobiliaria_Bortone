'use client'
import FaqContent from "@/components/faq/FaqContent";
import HomeFooter from "@/components/home/HomeFooter";
import HomeNavbar from "@/components/home/HomeNavbar";
import { MOCKFAQ } from "@/constants/faq";
import { Divider } from "antd";
import { useEffect, useState } from "react";

export default function FaqPage() {
  const [faqData, setFaqData] = useState([]);

  const fetchFaq = async () => {
    
    // Simulando uma chamada de API com dados mockados
    setFaqData(MOCKFAQ);
  };

  useEffect(() => {
    fetchFaq();
  }, []);

  return (
    <>
      <HomeNavbar className="md:!bg-[#050d2de3]" />
      <div className="banner-faq flex flex-col md:gap-4 justify-center md:ps-52 ps-10">
        <p className="md:text-7xl text-2xl font-bold text-white">
          Perguntas
          <br />
          frequentes
        </p>
        <p className="md:text-4xl text-sm text-white">
          Ficou com alguma dúvida? <br />
          Nós temos as repostas!
        </p>
      </div>
      <FaqContent faqData={faqData} />
      <Divider size="large" />
      <HomeFooter />
    </>
  );
}
