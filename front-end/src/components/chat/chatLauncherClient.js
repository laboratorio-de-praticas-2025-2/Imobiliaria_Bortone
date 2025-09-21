"use client";

import { useState, useEffect } from "react";
import ChatButton from "./chatButton";
import ChatModal from "./chatModal";

export default function ChatLauncherClient({ token }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // Verificar se usuário está logado
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userInfo = localStorage.getItem("userInfo");
    setIsUserLoggedIn(!!authToken && !!userInfo);
  }, []);

  const handleChatClick = () => {
    if (!isUserLoggedIn) {
      alert("Você precisa fazer login para usar o chat de suporte.");
      return;
    }
    setIsChatOpen((s) => !s);
  };

  // Só renderizar o botão se o usuário estiver logado
  if (!isUserLoggedIn) {
    return null;
  }

  return (
    <>
      {/* passa handler ao botão */}
      <ChatButton onClick={handleChatClick} />

      {/* mostra modal quando aberto */}
      {isChatOpen && <ChatModal onClose={() => setIsChatOpen(false)} />}
    </>
  );
}
