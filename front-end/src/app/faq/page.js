'use client'
import ChatButton from "@/components/chat/chatButton";
import ChatModal from "@/components/chat/chatModal";
import FaqContent from "@/components/faq/FaqContent";
import HomeFooter from "@/components/home/HomeFooter";
import HomeNavbar from "@/components/home/HomeNavbar";
import { MOCKFAQ } from "@/constants/faq";
import { Divider } from "antd";
import { useEffect, useState } from "react";

export default function FaqPage() {
  const [faqData, setFaqData] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const fetchFaq = async () => {
    // Simulando uma chamada de API com dados mockados
    setFaqData(MOCKFAQ);
  };

  useEffect(() => {
    setFaqData(MOCKFAQ);
  }, []);

  return (
    <>
      <HomeNavbar className="md:!bg-[#050d2de3]" />

      {/* Banner com título e botão */}
      <div className="banner-faq flex flex-col md:flex-row md:items-center md:gap-4 justify-start md:ps-52 ps-10">
        <h1 className="md:text-7xl text-2xl font-bold text-white">
          Perguntas
          <br />
          frequentes
        </h1>


      </div>

      <FaqContent faqData={faqData} />
      <Divider size="large" />
      <HomeFooter />
          

      {/* Modal */}
      {isChatOpen && <ChatModal onClose={() => setIsChatOpen(false)} />}
    </>
  );
}
