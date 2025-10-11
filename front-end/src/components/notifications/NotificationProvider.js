"use client";

import { Toaster } from "react-hot-toast";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationProvider() {
  console.log("🔥 NotificationProvider renderizando...");
  // Hook funciona aqui porque é componente de cliente
  useNotifications();

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 15000,
        style: {
          background: 'transparent !important',
          boxShadow: 'none !important',
          padding: '0 !important',
          border: 'none !important',
          borderRadius: '0 !important',
        },
      }}
    />
  );
}