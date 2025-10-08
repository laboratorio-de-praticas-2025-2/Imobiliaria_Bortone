"use client";

import { useEffect, useState } from "react";

export default function DebugAuth() {
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const checkStorage = () => {
      const authToken = localStorage.getItem("authToken");
      const userInfoString = localStorage.getItem("userInfo");
      
      let userInfo = null;
      try {
        userInfo = userInfoString ? JSON.parse(userInfoString) : null;
      } catch (e) {
        console.error("Erro ao parsear userInfo:", e);
      }

      setDebugInfo({
        hasToken: !!authToken,
        userInfoString,
        userInfo,
        userLevel: userInfo ? parseInt(userInfo.nivel ?? 1) : null,
        userLevelOriginal: userInfo?.nivel,
        userLevelType: typeof userInfo?.nivel
      });
    };

    checkStorage();
    
    // Verificar mudanças no localStorage
    const interval = setInterval(checkStorage, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!debugInfo) return <div>Carregando debug...</div>;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>🔍 DEBUG AUTH</h4>
      <p><strong>Token:</strong> {debugInfo.hasToken ? '✅' : '❌'}</p>
      <p><strong>UserInfo String:</strong> {debugInfo.userInfoString?.substring(0, 50)}...</p>
      <p><strong>User:</strong> {debugInfo.userInfo?.nome || 'N/A'}</p>
      <p><strong>Nível Original:</strong> {debugInfo.userLevelOriginal} ({debugInfo.userLevelType})</p>
      <p><strong>Nível Processado:</strong> {debugInfo.userLevel}</p>
    </div>
  );
}