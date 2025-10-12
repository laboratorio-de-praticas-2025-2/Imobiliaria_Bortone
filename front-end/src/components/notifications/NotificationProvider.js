"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { Toaster } from "react-hot-toast";

export default function NotificationProvider() {
  // Hook funciona aqui porque é componente de cliente
  try {
    useNotifications();
  } catch (err) {
    // Evita que erros sincronizados no hook quebrem a renderização do layout
    console.error("Erro no useNotifications():", err);
  }

  return (
    <Toaster
      position="center"
      toastOptions={{
        duration: 15000,
        style: {
          background: "transparent !important",
          boxShadow: "none !important",
          padding: "0 !important",
          border: "none !important",
          borderRadius: "0 !important",
        },
      }}
    />
  );
}
