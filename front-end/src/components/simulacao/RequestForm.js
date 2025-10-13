import { Card, Button, Input, Slider, ConfigProvider } from "antd";
import { simularFinanciamento } from "@/services/simulacaoService";
import { useState, useContext, useEffect, Suspense } from "react"; 
import { SimulacaoContext } from "./Filter"; 
import { useSearchParams } from "next/navigation";

function RequestFormContent() {
  const searchParams = useSearchParams();
  const [parcelas, setParcelas] = useState(60);
  const [valorEntrada, setValorEntrada] = useState('');
  const [valorImovel, setValorImovel] = useState('');
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const { propertyType, modalidade } = useContext(SimulacaoContext);
  
  // Define o range máximo de parcelas baseado no tipo de imóvel
  const maxParcelas = 420;
  // Função para formatar valor em moeda brasileira
  const formatCurrency = (valor) => {
    if (!valor) return '';
    const numero = typeof valor === 'string' ? parseFloat(valor.replace(/[^\d]/g, '')) : valor;
    if (isNaN(numero)) return '';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numero);
  };

  // Função para formatar valor sem símbolo de moeda (apenas com pontos e vírgulas)
  const formatNumber = (valor) => {
    if (!valor) return '';
    const numero = typeof valor === 'string' ? parseFloat(valor.replace(/[^\d]/g, '')) : valor;
    if (isNaN(numero)) return '';
    
    return new Intl.NumberFormat('pt-BR').format(numero);
  };

  // Função para remover formatação e retornar apenas números
  const unformatCurrency = (valorFormatado) => {
    if (!valorFormatado) return '';
    return valorFormatado.replace(/[^\d]/g, '');
  };

  // Função para lidar com mudança no valor do imóvel
  const handleValorImovelChange = (e) => {
    const valor = unformatCurrency(e.target.value);
    setValorImovel(valor);
  };

  // Função para lidar com mudança no valor de entrada
  const handleValorEntradaChange = (e) => {
    const valor = unformatCurrency(e.target.value);
    setValorEntrada(valor);
  };

  // Captura o valor do query parameter quando o componente monta
  useEffect(() => {
    const valorFromURL = searchParams.get('valor');
    
    if (valorFromURL) {
      const valorNumerico = parseFloat(valorFromURL.replace(/[^\d]/g, ''));
      
      if (!isNaN(valorNumerico) && valorNumerico > 0) {
        setValorImovel(valorNumerico.toString());
        // Define automaticamente 20% do valor como entrada sugerida
        const entradaSugerida = Math.round(valorNumerico * 0.2);
        setValorEntrada(entradaSugerida.toString());
      }
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const value = Math.max(1, Math.min(maxParcelas, Number(e.target.value))); 
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
              Valor do imóvel:
            </label>
            <Input
                type="text"
              placeholder="Digite aqui o valor"
              className="rounded-lg mt-1 h-12 text-center shadow-md"
                value={formatCurrency(valorImovel)} 
                onChange={handleValorImovelChange}
            />
          </div>
          <div className="w-3xs">
            <label className="text-[14px] font-bold text-[var(--primary)] ">
              Valor de entrada:
            </label>
            <Input
                type="text"
              placeholder="Digite aqui o valor"
              className="rounded-lg mt-1 h-12 text-center shadow-md"
                value={formatCurrency(valorEntrada)} 
                onChange={handleValorEntradaChange}
            />
          </div>
          <div className="w-2xs">
            <label className="text-[14px]  font-bold text-[var(--primary)] ">
              Escolha a quantidade de Parcelas:
            </label>
            <Input
              type="number"
              min={1}
              max={maxParcelas}
              value={parcelas}
              onChange={handleInputChange}
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
                max={maxParcelas}
                step={1}
                value={parcelas}
                onChange={(value) => setParcelas(value)}
              />
            </ConfigProvider>
          </div>
          <div className="w-3xs">
            <span className="text-[var(--primary)] font-bold">
              Taxa de juros mensal:
                <span className="text-[#919DC8] ml-2">
                  {propertyType === 'terreno' || propertyType === 'TERRENO' ? '1,00%' : '0,94%'}
                </span>
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
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border w-3xs">
              <h3 className="font-bold text-[var(--primary)] mb-3 text-center">Resultado da Simulação:</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Valor Financiado:</strong> 
                    <span className="text-[var(--primary)] font-bold ml-2">
                      {formatCurrency(resultado.valorFinanciado)}
                    </span>
                  </p>
                  {modalidade === 'sac' ? (
                    <>
                      <p className="text-sm">
                        <strong>Primeira Parcela:</strong> 
                        <span className="text-[var(--primary)] font-bold ml-2">
                          {formatCurrency(resultado.primeiraParcela)}
                        </span>
                      </p>
                      <p className="text-sm">
                        <strong>Última Parcela:</strong> 
                        <span className="text-[var(--primary)] font-bold ml-2">
                          {formatCurrency(resultado.ultimaParcela)}
                        </span>
                      </p>
                      <p className="text-sm">
                        <strong>Total a Pagar:</strong> 
                        <span className="text-[var(--primary)] font-bold ml-2">
                          {formatCurrency(resultado.totalPago)}
                        </span>
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm">
                        <strong>Valor da Parcela:</strong> 
                        <span className="text-[var(--primary)] font-bold ml-2">
                          {formatCurrency(resultado.parcelaComJuros)}
                        </span>
                      </p>
                      <p className="text-sm">
                        <strong>Total a Pagar:</strong> 
                        <span className="text-[var(--primary)] font-bold ml-2">
                          {formatCurrency(resultado.totalComJuros)}
                        </span>
                      </p>
                    </>
                  )}
                </div>
            </div>
)}
        </div>
      </div>
    </div>
  );
}

export default function RequestForm() {
  return (
    <Suspense fallback={
      <div className="flex justify-center w-full">
        <div className="lg:w-sm 2xl:w-md w-[85vw] shadow-xl rounded-b-2xl">
          <div className="bg-[var(--primary)] text-white rounded-t-2xl p-5 text-center">
            <p className="form font-semibold">Carregando formulário...</p>
          </div>
        </div>
      </div>
    }>
      <RequestFormContent />
    </Suspense>
  );
};