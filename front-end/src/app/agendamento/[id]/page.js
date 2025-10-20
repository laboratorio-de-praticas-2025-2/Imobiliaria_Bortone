"use client";
import HomeNavbar from "@/components/home/HomeNavbar";
import { Form, message, Button } from "antd";
import { BsDoorOpenFill } from "react-icons/bs";
import { MdBathtub } from "react-icons/md";
import TextField from "@/components/cms/form/fields/TextField";
import PhoneField from "@/components/cms/form/fields/PhoneField";
import FormButton from "@/components/cms/form/fields/Button";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import CityAutocomplete from "@/components/cms/form/fields/CityAutocomplete";
import { useEffect, useState } from "react";
import { buildImageUrl } from "@/utils/imageUtils";
import { useParams, useRouter } from "next/navigation";
import SplashScreen from "@/components/SplashScreen";
import { useAuth } from "@/hooks/useAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const REGEX_PATTERNS = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  phone: /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/,
  name: /^.{2,50}$/, // Aceita qualquer caractere, apenas limita o tamanho
  cityState: /^[a-zA-ZÀ-ÿ\s\/,-]{2,100}$/
};

const MASKS = { phone: "(99) 99999-9999" };

const validateField = {
  email: (value) => {
    if (!value) return "E-mail é obrigatório";
    if (!REGEX_PATTERNS.email.test(value)) return "E-mail inválido";
    return null;
  },
  phone: (value) => {
    if (!value) return null;
    const cleanPhone = value.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return "celular deve ter 10 ou 11 dígitos";
    }
    return null;
  },
  name: (value) => {
    if (!value) return "Nome é obrigatório";
    if (value.trim().length < 2 || value.trim().length > 50) {
      return "Nome deve ter entre 2 e 50 caracteres";
    }
    return null;
  },
  cityState: (value) => {
    if (!value) return null;
    if (!REGEX_PATTERNS.cityState.test(value)) {
      return "Cidade/Estado inválido";
    }
    return null;
  },
};

const enviarAgendamento = async (appointment) => {
  
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL não configurada");
  
  
  const res = await fetch(`${API_URL}/agendamentos/schedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appointment }),
  });
    
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error('❌ Erro na resposta:', res.status, txt);
    throw new Error(`Erro ao agendar: ${res.status} ${txt}`);
  }
  
  const result = await res.json();
  return result;
};

export default function Agendamento() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [imovel, setImovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  
  // Hook de autenticação
  const { isLoggedIn, user, isLoading: authLoading } = useAuth();

  const fetchImovel = async (imovelId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/imoveis/${imovelId}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        if (response.status === 404) {
          setImovel(null);
          return;
        }
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      const data = await response.json();
      setImovel(data);
    } catch (error) {
      console.error("Erro ao buscar imóvel:", error);
      setImovel(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchImovel(id);
  }, [id]);

  // Verificação de login
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      message.warning('Você precisa estar logado para agendar uma visita.');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
  }, [authLoading, isLoggedIn, router]);

  // Preenchimento automático dos dados do usuário
  useEffect(() => {
    if (user && form) {
      form.setFieldsValue({
        nome: user.nome || '',
        email: user.email || '',
        celular: user.celular || user.celular || '',
      });
    }
  }, [user, form]);

  const onFinish = async (values) => {
    
    if (submitting) return; // Prevenir múltiplos submits
    
    try {
      setSubmitting(true);
      
      const nome = (values?.nome || "").trim();
      const email = (values?.email || "").trim();
      const celular = (values?.celular || "").trim();
      const cidadeEstado = (values?.cidade_estado || "").trim();


      const nameError = validateField.name(nome);
      if (nameError) {
        console.error('❌ Erro no nome:', nameError);
        message.error(nameError);
        setSubmitting(false);
        return;
      }

      const emailError = validateField.email(email);
      if (emailError) {
        console.error('❌ Erro no email:', emailError);
        message.error(emailError);
        setSubmitting(false);
        return;
      }

      const phoneError = validateField.phone(celular);
      if (phoneError) {
        console.error('❌ Erro no celular:', phoneError);
        message.error(phoneError);
        setSubmitting(false);
        return;
      }

      const cityStateError = validateField.cityState(cidadeEstado);
      if (cityStateError) {
        console.error('❌ Erro na cidade/estado:', cityStateError);
        message.error(cityStateError);
        setSubmitting(false);
        return;
      }

      const cleanPhone = celular.replace(/\D/g, "");
      const appointment = {
        name: nome,
        email: email.toLowerCase(),
        phone: cleanPhone || null,
        propertyAddress: imovel?.endereco || "",
        propertyId: imovel?.id,
        notes: [cidadeEstado, values?.comentario].filter(Boolean).join(" | "),
        visitPeriod: "A combinar", // Campo obrigatório para o back-end
      };


      await enviarAgendamento(appointment);
      
      message.success("Agendamento enviado com sucesso!");
      
      // Aguardar um momento para o usuário ver a mensagem
      setTimeout(() => {
        router.push(`/imoveis/${id}`);
      }, 1500);
      
    } catch (e) {
      console.error('💥 Erro no agendamento:', e);
      message.error("Falha ao enviar agendamento. Tente novamente.");
      setSubmitting(false);
    }
  };

  if (loading || authLoading) return <SplashScreen />;

  // Se não estiver logado, não renderiza nada (redirecionamento já foi feito)
  if (!isLoggedIn) return null;

  // Busca a primeira imagem disponível do imóvel
  const imagemUrl = imovel?.imagens?.[0]?.url_imagem || imovel?.imagem_imovel?.[0]?.url_imagem || imovel?.imagem || null;
  const src = buildImageUrl(imagemUrl, 'imovel', '/imovel1.png');
  const quartos = imovel?.quartos ?? imovel?.casa?.quartos ?? 0;
  const banheiros = imovel?.banheiros ?? imovel?.casa?.banheiros ?? 0;

  return (
    <>
      <HomeNavbar />

      <main className="sidebar-desk bg-[#0C1122] flex flex-col relative">
        <div className="flex flex-col md:flex-row flex-1">
          {/* Lado esquerdo (imóvel) */}
          <div className="w-full md:w-[30%] bg-gradient-to-b from-[#2E3F7C] pb-10 to-[#0C1121] text-white px-6 md:px-11 pt-10 md:pt-28 flex flex-col gap-5">
            <div>
              <img
                src={src || "/404.png"}
                alt="Imóvel"
                className="object-cover w-full rounded-lg aspect-[6/3]"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/404.png";
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="!text-3xl !font-bold">{imovel.tipo}</h1>
              <p className="mt-2 text-sm opacity-90">{imovel.descricao}</p>

              <div className="flex flex-col gap-1">
                <p className="mt-3 text-sm text-[var(--secondary)]">
                  Localização: {imovel.endereco}
                </p>
                <p className="text-sm text-[var(--secondary)]">
                  Bairro: {imovel.bairro}
                </p>
                <p className="text-sm text-[var(--secondary)]">
                  Cidade: {imovel.cidade}
                </p>
                <p className="text-sm text-[var(--secondary)]">
                  Estado: {imovel.estado}
                </p>
              </div>

              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2 text-lg font-bold">
                  <BsDoorOpenFill /> {quartos} Quartos
                </div>
                <div className="flex items-center gap-2 text-lg font-bold">
                  <MdBathtub /> {banheiros} Banheiros
                </div>
              </div>
            </div>

            <div className="bg-white text-[#000] rounded-lg flex justify-between py-4 px-10 mt-4">
              <p className="font-bold text-lg">Preço</p>
              <p className="text-lg font-bold">
                {(() => {
                  const precoNumber = Number(imovel.preco);
                  if (Number.isFinite(precoNumber)) {
                    return `R$ ${precoNumber.toLocaleString("pt-BR")}`;
                  }
                  return `R$ ${imovel.preco}`;
                })()}
              </p>
            </div>
          </div>

          {/* Lado direito (formulário) */}
          <div className="flex-1 bg-white px-6 md:px-24 flex flex-col justify-center pt-10 md:pt-15 items-center rounded-t-3xl md:rounded-none">
            <div className="w-full">
              <h2 className="text-3xl !font-bold text-[#4C62AE] mb-6">
                Insira seus dados
              </h2>

              <Form
                form={form}
                name="basic"
                onFinish={(values) => {
                  onFinish(values);
                }}
                onFinishFailed={(errorInfo) => {
                  console.error("❌ Form onFinishFailed:", errorInfo);
                }}
                autoComplete="off"
                requiredMark={true}
                layout="vertical"
              >
                <div className="flex flex-col gap-13">
                  <TextField
                    name="nome"
                    label="Nome completo"
                    placeholder="Digite seu nome completo"
                    className="!w-[100%]"
                    required={true}
                  />

                  <div className="flex flex-col md:flex-row gap-13">
                    <PhoneField
                      name="celular"
                      label="Celular"
                      placeholder="(11) 99999-9999"
                      mask={MASKS.phone}
                    />

                    <TextField
                      name="email"
                      label="E-mail"
                      placeholder="seu@email.com"
                      className="!w-[100%]"
                      required={true}
                    />
                  </div>

                  <Form.Item
                    name="cidade_estado"
                    label="Cidade/Estado"
                    className="!w-full custom-form-item"
                  >
                    <CityAutocomplete
                      placeholder=""
                      onSelect={(value, option) => {
                        console.log("Cidade selecionada:", value, option);
                        form.setFieldsValue({ cidade_estado: value });
                      }}
                    />
                  </Form.Item>

                  <TextAreaField
                    name="comentario"
                    label="Comentário"
                    placeholder="Digite aqui"
                    rows={4}
                    className="!w-full !h-full"
                  />

                  <div className="flex justify-start">
                    <FormButton
                      text={submitting ? "Agendando..." : "Agendar Visita"}
                      className="!flex"
                      htmlType="submit"
                      loading={submitting}
                      disabled={submitting}
                      onClick={() => {
                        if (!submitting) {
                          form.submit();
                        }
                      }}
                    />
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
