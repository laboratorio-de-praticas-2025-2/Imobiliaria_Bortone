"use client";
import { useNotifications } from "@/hooks/useNotifications";
import { Toaster } from "react-hot-toast";

export default function NotificationProvider({ children }) {
    console.log("🔥 NotificationProvider renderizando...");
    
    const { isConnected } = useNotifications();
    
    return (
        <>
            {children}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 20000,
                    style: {
                        background: 'transparent',
                        boxShadow: 'none',
                        padding: 0,
                        margin: 0,
                        width: '420px',
                        maxWidth: '80vw',
                    },
                    success: {
                        style: {
                            background: 'transparent',
                        }
                    },
                    error: {
                        style: {
                            background: 'transparent',
                        }
                    }
                }}
                containerStyle={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    position: 'fixed',
                    zIndex: 9999,
                }}
            />
        </>
    );
}