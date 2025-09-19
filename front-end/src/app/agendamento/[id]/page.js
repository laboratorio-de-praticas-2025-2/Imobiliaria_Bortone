"use client";
import { FaBed, FaBath, FaFileAlt, FaPercent } from "react-icons/fa";
import HomeNavbar from "@/components/home/HomeNavbar";
import { Form } from "antd";
import Image from "next/image";
import { BsDoorOpenFill } from "react-icons/bs";
import { MdBathtub } from "react-icons/md";
import TextField from "@/components/cms/form/fields/TextField";
import PhoneField from "@/components/cms/form/fields/PhoneField";
import FormButton from "@/components/cms/form/fields/Button";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import { mockImoveis } from "@/mock/imoveis";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Simulação de chamada de API para buscar imóvel
const fetchImovel = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const found = mockImoveis.find((b) => String(b.id) === String(id));
      resolve(found);
    }, 1000); // 1 segundo de delay
  });
};

// Simulação de chamada de API para enviar dados do formulário
const enviarAgendamento = async (dados) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Dados enviados para API:", dados);
      resolve({ sucesso: true });
    }, 1000);
  });
};

export default function Agendamento() {
  const params = useParams();
  const id = params?.id;
  const [imovel, setImovel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchImovel(id).then((found) => {
      setImovel(found);
      setLoading(false);
    });
  }, [id]);

  const onFinish = async (values) => {
    await enviarAgendamento(values);
    alert("Agendamento enviado com sucesso!");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  if (loading) return <div>Carregando...</div>;
  if (!imovel) return <div>Imóvel não encontrado.</div>;

  return (
    <>
      <HomeNavbar />
      <main className="sidebar-desk bg-white flex flex-col relative ">
        <div className="flex flex-1">
          {/* Lado esquerdo */}
          <div className="w-full md:w-[30%] bg-gradient-to-b md:from-[#2E3F7C] md:to-[#0C1121] text-white px-11 pt-28 flex flex-col gap-5">
            <Image
              src={imovel.imagens[0].url_imagem}
              alt={`Imóvel`}
              width={407}
              height={195}
              className="object-cover w-full rounded-lg aspect-[6/3]"
            />

            <div className="flex flex-col gap-2">
              <h1 className="!text-3xl !font-bold">
                {imovel.tipo} {imovel.bairro}
              </h1>
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
                  <BsDoorOpenFill /> {imovel.quartos} Quartos
                </div>
                <div className="flex items-center gap-2 text-lg font-bold">
                  <MdBathtub /> {imovel.banheiros} Banheiros
                </div>
              </div>
            </div>

            <div className="bg-white text-[#000] rounded-lg flex justify-between py-4 px-10 mt-4">
              <p className="font-bold text-lg">Preço</p>
              <p className="text-lg font-bold">
                R$ {imovel.preco.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Lado direito */}
          <div className="flex-1 bg-white px-24 flex flex-col justify-center pt-15 items-center">
            <div className="w-full">
              <h2 className="text-3xl !font-bold text-[#4C62AE] mb-6">
                Insira seus dados
              </h2>

              <Form
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                requiredMark={true}
                layout="vertical"
              >
                <div className="flex flex-col gap-13">
                  <TextField
                    name="nome"
                    label="Nome completo"
                    placeholder="Digite aqui"
                    className="!w-[100%]"
                    required={false}
                  />
                  <div className="flex gap-13">
                    <PhoneField name="telefone" label="Telefone" />
                    <TextField
                      name="email"
                      label="E-mail"
                      placeholder="Digite aqui"
                      className="!w-[100%]"
                      required={false}
                    />
                  </div>
                  <TextField
                    name="cidade_estado"
                    label="Cidade/Estado"
                    placeholder="Digite aqui"
                    className="!w-[100%]"
                    required={false}
                  />
                  <TextAreaField
                    name="comentario"
                    label="Comentário"
                    placeholder="Digite aqui"
                    rows={4}
                    className="!w-full !h-full"
                    required={false}
                  />
                  <div className="flex justify-end">
                    <FormButton
                      text="Agendar Visita"
                      className="!flex !sm:hidden"
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
