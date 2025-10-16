"use client";

import CustomNotification from "@/components/notifications/customNotification";
import socketService from "@/services/socketService";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";


export const useNotifications = () => {
  const router = useRouter();

 useEffect(() => {
    // Função para configurar os listeners após a conexão
    const setupListeners = () => {
      // Garante que o socket existe antes de adicionar listeners
      if (!socketService.socket) return;

      // --- Listener para IMÓVEL POPULAR (Broadcast) ---
      const handleImovelPopular = (data) => {
        console.log('🔥 EVENTO RECEBIDO: imovel_popular', data);
        toast.custom(
          (t) => (
            <CustomNotification
              toast={t}
              imovel={data.property} // Acesso correto ao objeto do imóvel
              tipo="popular"        // Tipo específico para este evento
              onViewNow={() => {
                router.push(`/imoveis/${data.property?.id}`);
                toast.dismiss(t.id);
              }}
              onClose={() => toast.dismiss(t.id)}
            />
          ),
          { duration: 15000, position: "top-right" }
        );
      };

      // --- Listener para RECOMENDAÇÃO PERSONALIZADA ---
      const handleNovaRecomendacao = (data) => {
        console.log('✅ EVENTO RECEBIDO: nova_recomendacao', data);
        toast.custom(
          (t) => (
            <CustomNotification
              toast={t}
              imovel={data.property} // Acesso correto ao objeto do imóvel
              tipo="recomendacao"   // Tipo específico para este evento
              onViewNow={() => {
                router.push(`/imoveis/${data.property?.id}`);
                toast.dismiss(t.id);
              }}
              onClose={() => toast.dismiss(t.id)}
            />
          ),
          { duration: 15000, position: "top-right" }
        );
      };

      // Registra os dois listeners específicos no socket
      socketService.on("imovel_popular", handleImovelPopular);
      socketService.on("nova_recomendacao", handleNovaRecomendacao);
    };

    // Conecta ao socket e, quando a conexão for estabelecida, configura os listeners
    socketService.connect().then(setupListeners);

    // --- Função de Limpeza Essencial ---
    // Esta função será executada quando o componente for "desmontado"
    return () => {
      // Garante que os listeners sejam removidos para evitar duplicatas e vazamentos de memória
      if (socketService.socket) {
        socketService.socket.off("imovel_popular");
        socketService.socket.off("nova_recomendacao");
      }
    };
  }, []); // O router é uma dependência, então o efeito roda se ele mudar



 

  return { isConnected: socketService.isConnected };
};


