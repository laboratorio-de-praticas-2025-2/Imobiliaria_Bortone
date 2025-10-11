"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import socketService from "@/services/socketService";
import CustomNotification from "@/components/notifications/customNotification";

console.log('📁 useNotifications.js sendo carregado!');

// ======= CÓDIGO ANTIGO COMENTADO =======
/*
export const useNotifications = () => {
    const router = useRouter();

    useEffect(() => {
        console.log("🎯 useNotifications INICIADO");
        console.log("🎯 socketService:", socketService);

        const handleNovaRecomendacao = (data) => {
            const eventData = Array.isArray(data) ? data[0] : data;
            console.log('🎯 Nova recomendação recebida:', eventData);
            showCustomNotification(eventData, 'recomendacao');
        };

        const handleImovelPopular = (data) => {
            const eventData = Array.isArray(data) ? data[0] : data;
            console.log('🔥 Imóvel popular recebido:', eventData);
            showCustomNotification(eventData, 'popular');
        };

        const setupListeners = async () => {
            await socketService.connect();
            // Aguarda o evento connect para garantir que o socket está pronto
            socketService.socket.on('connect', () => {
                console.log('🔌 Socket conectado, registrando listeners...');
                socketService.socket.on("nova_recomendacao", handleNovaRecomendacao);
                socketService.socket.on("imovel_popular", handleImovelPopular);
                console.log("✅ Listeners registrados com sucesso!");
                setTimeout(() => {
                    console.log('🔍 Listeners ativos:', socketService.socket._callbacks);
                }, 1000);
            });
        };

        setupListeners();

        return () => {
            socketService.socket?.off("nova_recomendacao", handleNovaRecomendacao);
            socketService.socket?.off("imovel_popular", handleImovelPopular);
        };
    }, []);

    const showCustomNotification = (imovelData, tipo) => {
        console.log('🎯 showCustomNotification CHAMADO:', { imovelData, tipo });
        try {
            console.log('🎨 Criando CustomNotification...');
            toast.custom((t) => (
                <CustomNotification
                    toast={t}
                    imovel={imovelData}
                    tipo={tipo}
                    onViewNow={() => handleViewNow(imovelData.id, t.id)}
                    onViewLater={() => handleViewLater(t.id)}
                    onClose={() => toast.dismiss(t.id)}
                />
            ), {
                duration: 15000,
                position: 'top-right',
            });

            console.log('✅ toast.custom executado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao exibir notificação personalizada:', error);
        }
    }

    const handleViewNow = (imovelId, toastId) => {
        toast.dismiss(toastId);
        router.push(`/imoveis/${imovelId}`);
    };

    const handleViewLater = (toastId) => {
        toast.dismiss(toastId);
    };

    return {
        isConnected: socketService.isConnected,
    };
};
*/
// ======= NOVA IMPLEMENTAÇÃO onAny =======

export const useNotifications = () => {
    console.log('🚀 useNotifications FUNÇÃO EXECUTADA!');
    const router = useRouter();

    useEffect(() => {
        console.log('🎯 useNotifications useEffect INICIADO');
        socketService.connect().then(() => {
            // Remove listeners duplicados para evitar múltiplas notificações
            socketService.socket.offAny();
            socketService.socket.onAny((event, ...args) => {
                if (event === "imovel_popular") {
                    const data = Array.isArray(args[0]) ? args[0][0] : args[0];
                    console.log('🔥 useNotifications - Dados brutos recebidos:', args);
                    console.log('🔥 useNotifications - Dados processados:', data);
                    console.log('🔥 useNotifications - data.property:', data?.property);

                    toast.custom((t) => (
                        <CustomNotification
                            toast={t}
                            imovel={data}
                            tipo="popular"
                            onViewNow={(imovelId) => {
                                toast.dismiss(t.id);
                                router.push(`/imoveis/${imovelId || data.property?.id}`);
                            }}
                            onClose={() => toast.dismiss(t.id)}
                        />
                    ), {
                        duration: 15000,
                        position: 'top-right',
                    });
                }
            });
        });
    }, [router]);

    return { isConnected: socketService.isConnected };
};