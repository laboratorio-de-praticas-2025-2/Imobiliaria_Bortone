"use client";

import CustomNotification from "@/components/notifications/customNotification";
import socketService from "@/services/socketService";
import { useRouter } from "next/navigation";
import { useEffect } from "react"; // Removido 'useRef', pois não era usado
import toast from "react-hot-toast";

// 1. Importe o seu hook useAuth (ajuste o caminho se necessário)
import { useAuth } from "@/hooks/useAuth"; // Ajuste este caminho!

export const useNotifications = () => {
  const router = useRouter();
  const shownNotifications = socketService.shownNotifications;
  
  // 2. Use o hook de autenticação
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    // Não faça nada até o useAuth terminar de carregar o status
    if (isLoading) {
      return;
    }

    // --- Funções de Handler (sem mudanças) ---
    const showNotification = (data, tipo) => {
      if (!data) return;
      const property = data.property || data.imovel || data;
      const notificationId = property?.id;

      if (shownNotifications.has(notificationId)) {
        console.log(`⚠️ Notificação duplicada ignorada (${notificationId})`);
        return;
      }
      shownNotifications.add(notificationId);

      toast.custom(
        (t) => (
          <CustomNotification
            toast={t}
            imovel={data.property}
            tipo={tipo}
            onViewNow={() => {
              router.push(`/imoveis/${property?.id}`);
              toast.dismiss(t.id);
            }}
            onClose={() => toast.dismiss(t.id)}
          />
        ),
        { duration: 15000, position: "top-right" }
      );
    };

    const handleImovelPopular = (data) => {
      console.log("🔥 EVENTO RECEBIDO: imovel_popular", data);
      showNotification(data, "popular");
    };

    const handleNovaRecomendacao = (data) => {
      console.log("✅ EVENTO RECEBIDO: nova_recomendacao", data);
      showNotification(data, "recomendacao");
    };
    // --- Fim das Funções de Handler ---


    const setupListeners = () => {
      if (!socketService.socket) return;

      // Limpa listeners antigos (boa prática)
      socketService.socket.off("imovel_popular", handleImovelPopular);
      socketService.socket.off("nova_recomendacao", handleNovaRecomendacao);

      // 3. *** A LÓGICA CONDICIONAL ESTÁ AQUI ***
      // Usando 'isLoggedIn' do seu hook useAuth
      if (isLoggedIn) {
        // Usuário LOGADO: Ouve apenas recomendações
        console.log("Configurando listener para usuário LOGADO: 'nova_recomendacao'");
        socketService.on("nova_recomendacao", handleNovaRecomendacao);
      } else {
        // Usuário DESLOGADO: Ouve apenas imóveis populares
        console.log("Configurando listener para usuário DESLOGADO: 'imovel_popular'");
        socketService.on("imovel_popular", handleImovelPopular);
      }
    };

    socketService.connect().then(setupListeners);

    // 4. FUNÇÃO DE LIMPEZA
    return () => {
      if (socketService.socket) {
        console.log("Limpando listeners...");
        socketService.socket.off("imovel_popular", handleImovelPopular);
        socketService.socket.off("nova_recomendacao", handleNovaRecomendacao);
      }
    };
    
  // 5. ADICIONE `isLoggedIn` E `isLoading` AO ARRAY DE DEPENDÊNCIAS
  }, [router, isLoggedIn, isLoading, shownNotifications]); 

  return { isConnected: socketService.isConnected };
};




// "use client";

// import CustomNotification from "@/components/notifications/customNotification";
// import socketService from "@/services/socketService";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef } from "react";
// import toast from "react-hot-toast";

// export const useNotifications = () => {
//   const router = useRouter();
//   const shownNotifications = socketService.shownNotifications; // evita notificações duplicadas

//   useEffect(() => {
//     const setupListeners = () => {
//       if (!socketService.socket) return;

//       const showNotification = (data, tipo) => {
//         if (!data) return;

//         const property = data.property || data.imovel || data;
//         const notificationId = property?.id;

//         // Evita mostrar a mesma notificação mais de uma vez
//         if (shownNotifications.has(notificationId)) {
//           console.log(`⚠️ Notificação duplicada ignorada (${notificationId})`);
//           return;
//         }

//         shownNotifications.add(notificationId);

//         toast.custom(
//           (t) => (
//             <CustomNotification
//               toast={t}
//               imovel={data.property}
//               tipo={tipo}
//               onViewNow={() => {
//                 router.push(`/imoveis/${property?.id}`);
//                 toast.dismiss(t.id);
//               }}
//               onClose={() => toast.dismiss(t.id)}
//             />
//           ),
//           { duration: 15000, position: "top-right" }
//         );
//       };

//       const handleImovelPopular = (data) => {
//         console.log("🔥 EVENTO RECEBIDO: imovel_popular", data);
//         showNotification(data, "popular");
//       };

//       const handleNovaRecomendacao = (data) => {
//         console.log("✅ EVENTO RECEBIDO: nova_recomendacao", data);
//         showNotification(data, "recomendacao");
//       };

//       if (socketService.socket) {
//   socketService.socket.off("imovel_popular");
//   socketService.socket.off("nova_recomendacao");
// }


//       // socketService.on("imovel_popular", handleImovelPopular);
//       socketService.on("nova_recomendacao", handleNovaRecomendacao);
//     };

//     socketService.connect().then(setupListeners);

//     return () => {
//       if (socketService.socket) {
//         socketService.socket.off("imovel_popular");
//         socketService.socket.off("nova_recomendacao");
//       }
//     };
//   }, [router]);

//   return { isConnected: socketService.isConnected };
// };


