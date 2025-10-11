import { Card, Button, Input, Slider, ConfigProvider } from "antd";
import { simularFinanciamento } from "@/services/simulacaoService";
import { useState, useContext } from "react"; 
import { SimulacaoContext } from "./Filter"; 

export default function RequestForm() {
  const [parcelas, setParcelas] = useState(20);
  const [valorEntrada, setValorEntrada] = useState('');
  const [valorImovel, setValorImovel] = useState('');
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const { propertyType, modalidade } = useContext(SimulacaoContext);

  const handleInputChange = (e) => {
    const value = Math.max(1, Math.min(32, Number(e.target.value))); 
    setParcelas(value || 1); 
  };

  const handleSimular = async () => {
    if (!valorImovel || !valorEntrada) {
      alert('Preencha todos os campos!');
      return;
    }

    setCarregando(true);

    const dados = {
      tipo: propertyType, 
      valorImovel: Number(valorImovel),
      entrada: Number(valorEntrada),
      parcelas: Number(parcelas),
      modalidade: modalidade 
    };

    const resultadoApi = await simularFinanciamento(dados);
    setCarregando(false);
    
    if (resultadoApi.sucesso) {
      setResultado(resultadoApi.resultado);
    } else {
      alert('Erro na simulação: ' + resultadoApi.erro);
    }
  };

  return (
    <div className="flex justify-center w-full ">
      <div className="lg:w-sm 2xl:w-md w-[85vw] shadow-xl rounded-b-2xl">
        <div className="bg-[var(--primary)] text-white rounded-t-2xl p-5 text-center">
          <span className="form font-light">Solicite uma</span>
          <p className="form font-semibold">simulação de financiamento</p>
        </div>
        <div className="grid h-fit bg-white grid-rows-1 justify-items-center content-evenly gap-4 sm:gap-4 xxl:gap-12 pt-7 text-center py-4 rounded-b-2xl">
          <div className="w-3xs">
            <label className="text-[14px] font-bold text-[var(--primary)]  ">
              Valor do imóvel: {/* MUDAR DE "parcela" para "imóvel" */}
            </label>
            <Input
              type="number"
              placeholder="Digite aqui o valor"
              step="0.01"
              className="rounded-lg mt-1 h-12 text-center shadow-md"
              value={valorImovel} onChange={(e) => setValorImovel(e.target.value)}
            />
          </div>
          <div className="w-3xs">
            <label className="text-[14px] font-bold text-[var(--primary)] ">
              Valor de entrada:
            </label>
            <Input
              type="number"
              placeholder="Digite aqui o valor"
              className="rounded-lg mt-1 h-12 text-center shadow-md"
              value={valorEntrada} onChange={(e) => setValorEntrada(e.target.value)}
            />
          </div>
          <div className="w-2xs">
            <label className="text-[14px]  font-bold text-[var(--primary)] ">
              Escolha a quantidade de Parcelas:
            </label>
            <Input
              type="number"
              min={1}
              max={32}
              value={parcelas}
              readOnly
              className="rounded-lg mt-1 h-12 text-center shadow-md"
            />
          </div>
          <div className="w-2xs">
            <ConfigProvider
              theme={{
                components: {
                  Slider: {
                    railBg: "var(--secondary)", // trilha vazia
                    trackBg: "var(--primary)", // preenchida
                    trackHoverBg: "var(--primary)",
                    handleColor: "var(--primary)",
                    handleActiveColor: "var(--secondary)",
                    dotSize: 100,
                  },
                },
              }}
            >
              <Slider
                min={1}
                max={32}
                value={parcelas}
                onChange={(value) => setParcelas(value)}
              />
            </ConfigProvider>
          </div>
          <div className="w-3xs">
            <span className="text-[var(--primary)] font-bold">
              Taxa de juros mensal:
              <span className="text-[#919DC8]">valor</span>
            </span>
          </div>
          <div className="w-2xs pb-5">
            <Button 
            onClick={handleSimular}
            loading={carregando}
            className="!bg-[#3b478f] !text-white rounded-lg !h-10 !w-full"
            >
              <span className="font-bold">Simular Agora</span>
            </Button>
          </div>
          {resultado && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-bold text-[var(--primary)] mb-2">Resultado da Simulação:</h3>
              <p><strong>Valor Financiado:</strong> R$ {resultado.valorFinanciado}</p>
              <p><strong>Parcela:</strong> R$ {resultado.parcelaComJuros}</p>
              <p><strong>Total a Pagar:</strong> R$ {resultado.totalComJuros}</p>
            </div>
)}
        </div>
      </div>
    </div>
  );
};