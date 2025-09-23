"use client";
import HomeNavbar from "@/components/home/HomeNavbar";
import { Form, message } from "antd";
import { BsDoorOpenFill } from "react-icons/bs";
import { MdBathtub } from "react-icons/md";
import TextField from "@/components/cms/form/fields/TextField";
import PhoneField from "@/components/cms/form/fields/PhoneField";
import FormButton from "@/components/cms/form/fields/Button";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const REGEX_PATTERNS = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  phone: /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/,
  name: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
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
      return "Telefone deve ter 10 ou 11 dígitos";
    }
    return null;
  },
  name: (value) => {
    if (!value) return "Nome é obrigatório";
    if (!REGEX_PATTERNS.name.test(value)) {
      return "Nome deve conter apenas letras e espaços (2-50 caracteres)";
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

function normalizeImageUrl(path) {
  if (!path || typeof path !== "string") return "/imovel1.png";
  path = path.trim();
  if (/^https?:\/\//i.test(path)) return path;
  if (/^(data:|blob:)/i.test(path)) return path;
  if (path.startsWith("/images/")) return path;
  if (path.startsWith("/")) return path;
  return `/images/imoveis/${path}`;
}

const enviarAgendamento = async (appointment) => {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL não configurada");
  const res = await fetch(`${API_URL}/agendamentos/schedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appointment }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Erro ao agendar: ${res.status} ${txt}`);
  }
  return res.json();
};

export default function Agendamento() {
  const params = useParams();
  const id = params?.id;
  const [imovel, setImovel] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const onFinish = async (values) => {
    try {
      const nome = (values?.nome || "").trim();
      const email = (values?.email || "").trim();
      const telefone = (values?.telefone || "").trim();
      const cidadeEstado = (values?.cidade_estado || "").trim();

      const nameError = validateField.name(nome);
      if (nameError) return message.error(nameError);

      const emailError = validateField.email(email);
      if (emailError) return message.error(emailError);

      const phoneError = validateField.phone(telefone);
      if (phoneError) return message.error(phoneError);

      const cityStateError = validateField.cityState(cidadeEstado);
      if (cityStateError) return message.error(cityStateError);

      const cleanPhone = telefone.replace(/\D/g, "");
      const appointment = {
        name: nome,
        email: email.toLowerCase(),
        phone: cleanPhone || null,
        propertyAddress: imovel?.endereco || "",
        propertyId: imovel?.id,
        notes: [cidadeEstado, values?.comentario].filter(Boolean).join(" | "),
      };

      await enviarAgendamento(appointment);
      message.success("Agendamento enviado com sucesso!");
    } catch (e) {
      console.error(e);
      message.error("Falha ao enviar agendamento. Tente novamente.");
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!imovel) return <div>Imóvel não encontrado.</div>;

  const imgRaw = imovel?.imagens?.[0]?.url_imagem || imovel?.imagem_imovel?.[0]?.url_imagem || null;
  const src = normalizeImageUrl(imgRaw);
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
                src={src}
                alt="Imóvel"
                className="object-cover w-full rounded-lg aspect-[6/3]"
                loading="lazy"
              />
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="!text-3xl !font-bold">{imovel.tipo}</h1>
              <p className="mt-2 text-sm opacity-90">{imovel.descricao}</p>

              <div className="flex flex-col gap-1">
                <p className="mt-3 text-sm text-[var(--secondary)]">
                  Localização: {imovel.endereco}
                </p>
                <p className="text-sm text-[var(--secondary)]">Bairro: {imovel.bairro}</p>
                <p className="text-sm text-[var(--secondary)]">Cidade: {imovel.cidade}</p>
                <p className="text-sm text-[var(--secondary)]">Estado: {imovel.estado}</p>
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
              <h2 className="text-3xl !font-bold text-[#4C62AE] mb-6">Insira seus dados</h2>

              <Form
                name="basic"
                onFinish={onFinish}
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
                      name="telefone"
                      label="Telefone"
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

                  <TextField
                    name="cidade_estado"
                    label="Cidade/Estado"
                    placeholder="São Paulo/SP"
                    className="!w-[100%]"
                  />

                  <TextAreaField
                    name="comentario"
                    label="Comentário"
                    placeholder="Digite aqui"
                    rows={4}
                    className="!w-full !h-full"
                  />

                  <div className="flex justify-start">
                    <FormButton text="Agendar Visita" className="!flex !sm:hidden" />
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
