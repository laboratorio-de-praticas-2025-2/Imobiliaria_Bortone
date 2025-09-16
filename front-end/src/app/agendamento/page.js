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

export default function Agendamento() {
    const onFinish = (values) => {
        console.log("Success:", values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };


  return (
    <>
      <HomeNavbar />
      <main className="sidebar-desk bg-white flex flex-col relative ">
        <div className="flex flex-1">
          {/* Lado esquerdo */}
          <div className="w-full md:w-[30%] bg-gradient-to-b md:from-[#2E3F7C] md:to-[#0C1121] text-white px-11 pt-28 flex flex-col gap-5">
            <Image
              src={"/images/casa-isolada-no-campo.jpg"}
              alt={`Imóvel `}
              width={407}
              height={195}
              className="object-cover w-full rounded-lg aspect-[6/3]"
            />

            <div className="flex flex-col gap-2">
              <h1 className="!text-3xl !font-bold">Casa Jardim das Flores</h1>
              <p className="mt-2 text-sm opacity-90">
                Encante-se com este lindo residência de 3 quartos, 2 banheiros e
                ampla sala de estar, perfeita para famílias que buscam conforto
                e praticidade. A cozinha planejada e a varanda com jardim
                proporcionam momentos únicos de lazer e convivência.
              </p>
              <div className="flex flex-col gap-1">
                <p className="mt-3 text-sm text-[var(--secondary)]">
                  Localização: Rua dos Acácias, 245
                </p>
                <p className="text-sm text-[var(--secondary)]">
                  Bairro: Jardim
                </p>
                <p className="text-sm text-[var(--secondary)]">
                  Cidade: Vale Encantado
                </p>
                <p className="text-sm text-[var(--secondary)]">
                  Estado: São Florentino
                </p>
              </div>
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2 text-lg font-bold">
                  <BsDoorOpenFill /> 3 Quartos
                </div>
                <div className="flex items-center gap-2 text-lg font-bold">
                  <MdBathtub /> 2 Banheiros
                </div>
              </div>
            </div>

            <div className="bg-white text-[#000] rounded-lg flex justify-between py-4 px-10 mt-4">
              <p className="font-bold text-lg">Preço</p>
              <p className="text-lg font-bold">R$ 600.000,00</p>
            </div>
          </div>

          {/* Lado direito */}
          <div className="flex-1 bg-white px-24 flex flex-col justify-center items-center">
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
