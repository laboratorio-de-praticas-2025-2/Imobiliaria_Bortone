"use client";

import CustomNotification from "@/components/notifications/customNotification";
import socketService from "@/services/socketService";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

console.log("📁 useNotifications.js sendo carregado!");

export const useNotifications = () => {
  console.log("🚀 useNotifications FUNÇÃO EXECUTADA!");
  const router = useRouter();

  useEffect(() => {
    console.log("🎯 useNotifications useEffect INICIADO");
    socketService.connect().then(() => {
      // Remove listeners duplicados para evitar múltiplas notificações
      if (
        socketService.socket &&
        typeof socketService.socket.offAny === "function"
      ) {
        socketService.socket.offAny();
      }
      if (
        socketService.socket &&
        typeof socketService.socket.onAny === "function"
      ) {
        socketService.socket.onAny((event, ...args) => {
          if (event === "imovel_popular") {
            const data = Array.isArray(args[0]) ? args[0][0] : args[0];
            console.log("🔥 useNotifications - Dados brutos recebidos:", args);
            console.log("🔥 useNotifications - Dados processados:", data);
            console.log("🔥 useNotifications - data.property:", data?.property);

            try {
              toast.custom(
                (t) => (
                  <CustomNotification
                    toast={t}
                    imovel={data}
                    tipo="popular"
                    onViewNow={(imovelId) => {
                        router.push(`/imoveis/${imovelId || data.property?.id}`);
                        // toast.dismiss(t.id);
                    }}
                    onClose={() => toast.dismiss(t.id)}
                  />
                ),
                {
                  duration: 15000,
                  position: "center",
                }
              );
            } catch (err) {
              console.error("Erro ao exibir toast.custom:", err);
            }
          }
        });
      }
    });
  }, [router]);

  return { isConnected: socketService.isConnected };
};
