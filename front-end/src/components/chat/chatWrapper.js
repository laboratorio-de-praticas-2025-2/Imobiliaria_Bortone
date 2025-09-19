"use client";
import { usePathname } from "next/navigation";
import ChatLauncherClient from "@/components/chat/chatLauncherClient";

export default function ChatWrapper() {
  const pathname = usePathname();

  // Rotas onde o chat NÃO deve aparecer
  const hiddenRoutes = ["/bem-vindo", "/login", "/cadastro"];

  if (hiddenRoutes.includes(pathname)) {
    return null; // não renderiza o chat nessas páginas
  }

  return <ChatLauncherClient />;
}
