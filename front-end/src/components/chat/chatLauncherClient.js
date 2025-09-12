"use client";

import { useState } from "react";
import ChatButton from "./chatButton";
import ChatModal from "./chatModal";

export default function ChatLauncherClient() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* passa handler ao botão */}
      <ChatButton onClick={() => setIsChatOpen((s) => !s)} />

      {/* mostra modal quando aberto */}
      {isChatOpen && <ChatModal onClose={() => setIsChatOpen(false)} />}
    </>
  );
}
