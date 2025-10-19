"use client";
import { Slider, ConfigProvider, Button, Input } from "antd";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function FormContent() {
  const searchParams = useSearchParams();
  const [value, setValue] = useState(100000);
  const [valueInput, setValueInput] = useState(String(100000));
  const [valueFocused, setValueFocused] = useState(false);

  // Captura o valor do query parameter quando o componente monta
  useEffect(() => {
    const valorFromURL = searchParams.get('valor');
    
    if (valorFromURL) {
      const valorNumerico = parseInt(valorFromURL, 10);
      
      if (!isNaN(valorNumerico) && valorNumerico >= 20000 && valorNumerico <= 1000000) {
        setValue(valorNumerico);
      } else if (!isNaN(valorNumerico)) {
        // Se o valor estiver fora do range, ajustar para o mais próximo
        const valorAjustado = Math.min(Math.max(valorNumerico, 20000), 1000000);
        setValue(valorAjustado);
      }
    }
  }, [searchParams]);

  const handleClick = () => {
    // Passa o valor atual e o imovelId (se existir) para a próxima página
    const imovelId = searchParams.get('imovelId');
    const query = new URLSearchParams();
    query.set('valor', String(value));
    if (imovelId) {
      query.set('imovelId', imovelId);
    }
    window.location.href = `/simulacao/simulador?${query.toString()}`;
  };

  // Função para formatar o valor como moeda brasileira
  const formatCurrency = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  
  // Função que permite digitar no input
  const handleValueInputChange = (e) => {
    const raw = String(e.target.value).replace(/[^0-9]/g, '');
    setValueInput(raw);
  };

  const handleValueInputBlur = () => {
    const raw = (valueInput || '').toString().trim();
    if (raw === '') {
      setValue(20000);
      setValueInput(String(20000));
    } else {
      const num = Number(raw);
      const clamped = Math.min(Math.max(isNaN(num) ? 20000 : Math.round(num), 20000), 1000000);
      setValue(clamped);
      setValueInput(String(clamped));
    }
    setValueFocused(false);
  };

  return (
    <div className=" justify-self-center lg:pb-10">
      <div className=" md:w-110 lg:h-85 bg-white p-7 md:p-10 rounded-3xl  relative z-20 text-center">
        <h3 className="text-[var(--primary)] form !font-bold text-[24px] mb-2">
          Chegou a hora de você
          <p>
            <span className="pr-1">financiar o seu</span>
            <span className="bg-[var(--primary)] text-white decoration-2 p-1 uppercase">
              IMÓVEL
            </span>
          </p>
        </h3>

        <p className="text-[var(--primary)] text-[16px] mb-4">
          Escolha o valor desejado:
        </p>

        <div className="mb-4 pt-2 w-3xs justify-self-center">
          <Input
            type="text"
            value={valueFocused ? valueInput : formatCurrency(Number(valueInput))}
            onChange={handleValueInputChange}
            onFocus={() => setValueFocused(true)}
            onBlur={handleValueInputBlur}
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-[35%] border border-gray-200 rounded px-3 py-2 focus:outline-none text-left h-12"
          />
        </div>

        <div className="mb-4">
          <ConfigProvider
            theme={{
              components: {
                Slider: {
                  railBg: "var(--secondary)",
                  trackBg: "var(--primary)",
                  trackHoverBg: "var(--primary)",
                  handleColor: "var(--primary)",
                  handleActiveColor: "var(--secondary)",
                  dotSize: 100,
                },
              },
            }}
          >
            <Slider
              min={20000}
              max={1000000}
              step={1}
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
                setValueInput(String(newValue));
              }}
            />
          </ConfigProvider>
          <div className="flex  w-full">
            <p className="flex-none text-gray-400 font-thin text-[10px] pb-3">
              {formatCurrency(20000)}
            </p>
            <div className="grow"></div>
            <p className="flex-none text-gray-400 font-thin text-[10px] pb-3">
              {formatCurrency(1000000)}
            </p>
          </div>
        </div>
        <Button
          className="w-full !bg-[var(--secondary)] !text-white !h-10 rounded-lg "
          onClick={handleClick}
        >
          <span className=" font-bold">Simular Agora</span>
        </Button>
      </div>
    </div>
  );
}

export default function Form() {
  return (
    <Suspense fallback={
      <div className="justify-self-center lg:pb-10">
        <div className="md:w-110 lg:h-85 bg-white p-7 md:p-10 rounded-3xl relative z-20 text-center">
          <p className="text-[var(--primary)]">Carregando...</p>
        </div>
      </div>
    }>
      <FormContent />
    </Suspense>
  );
}