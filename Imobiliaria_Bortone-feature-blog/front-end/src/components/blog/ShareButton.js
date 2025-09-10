import { useState } from 'react';
import { message } from 'antd';
import { MdOutlineShare } from "react-icons/md";

export default function ShareButton() {
  const [isSharing, setIsSharing] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleShare = async () => {
    // Verifica se a Web Share API está disponível
    if (navigator.share) {
      setIsSharing(true);
      try {
        await navigator.share({
          title: document.title,
          text: 'Confira este conteúdo interessante da Imobiliária Bortone!',
          url: window.location.href,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          messageApi.error('Erro ao compartilhar: ' + error.message);
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      // Fallback para copiar para a área de transferência
      try {
        await navigator.clipboard.writeText(window.location.href);
        messageApi.success('Link copiado para a área de transferência!');
      } catch (error) {
        messageApi.error('Falha ao copiar o link');
      }
    }
  };

  return (
    <>
      {contextHolder}
      <div className="!pt-4">
        <div 
          className="flex items-center gap-4 cursor-pointer"
          onClick={handleShare}
          style={{ cursor: isSharing ? 'wait' : 'pointer' }}
        >
          <div className="w-[42px] h-[42px] flex items-center justify-center rounded-full bg-[#F2F2F2]">
            <MdOutlineShare 
              className="text-[24px] text-[var(--primary)]" 
              style={{ opacity: isSharing ? 0.7 : 1 }}
            />
          </div>
          <span className="text-[var(--primary)] text-[16px] font-normal">
            {isSharing ? 'Compartilhando...' : 'Compartilhe'}
          </span>
        </div>
      </div>
    </>
  );
}