"use client";

import { useState, useEffect } from "react";
import ChatButton from "./chatButton";
import ChatModal from "./chatModal";

export default function ChatLauncherClient({ token }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Verificar se usuário está logado após hidratação
  useEffect(() => {
    setIsHydrated(true);
    const authToken = localStorage.getItem("authToken");
    const userInfo = localStorage.getItem("userInfo");
    setIsUserLoggedIn(!!authToken && !!userInfo);
  }, []);

  const handleChatClick = () => {
    // Agora sempre abre o modal, a verificação de login será feita dentro do modal
    setIsChatOpen((s) => !s);
  };

  // Não renderizar nada até que o componente esteja hidratado
  if (!isHydrated) {
    return null;
  }

  return (
    <>
      {/* sempre mostra o botão de chat */}
      <ChatButton onClick={handleChatClick} />

      {/* mostra modal quando aberto */}
      {isChatOpen && (
        <ChatModal 
          onClose={() => setIsChatOpen(false)} 
          isLoggedIn={isUserLoggedIn}
        />
      )}
    </>
  );
}
