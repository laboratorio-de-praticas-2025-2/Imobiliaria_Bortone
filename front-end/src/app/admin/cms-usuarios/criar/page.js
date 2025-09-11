"use client";
import Form from "@/components/cms/form";
import RadioField from "@/components/cms/form/fields/RadioField";
import TextField from "@/components/cms/form/fields/TextField";
import FormButton from "@/components/cms/form/fields/Button";
import { MdPersonAdd } from "react-icons/md";
import Sidebar from "@/components/cms/Sidebar";

export default function CriarUserPage() {

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <Form.Body title="Usuários | Cadastro">
          <Form.FormHeader href="/admin/cms-usuarios" />
          <Form.FormBody onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <div className="flex flex-col sm:flex-row w-full">
              {/* Coluna do Formulário */}
              <div className="sm:w-[50%] flex flex-col gap-6 items-end">
                <TextField
                  name="nome"
                  label="Nome"
                  placeholder="Nome do Usuário"
                  className="!w-[100%]"
                />

                <TextField
                  name="email"
                  label="Email"
                  placeholder="Email do Usuário"
                  className="!w-[100%]"
                />

                <RadioField
                  name="nivel"
                  label="Nível"
                  options={[
                    { label: "Administrador", value: "administrador" },
                    { label: "Usuário Padrão", value: "usuario" },
                  ]}
                  className="!w-[100%]"
                />

                <TextField
                  name="celular"
                  label="Celular"
                  placeholder="Celular do Usuário"
                  className="!w-[100%]"
                />

                <TextField
                  name="senha"
                  label="Senha"
                  placeholder="Senha do Usuário"
                  className="!w-[100%]"
                />
                <FormButton text="Cadastrar" icon={<MdPersonAdd />} />
              </div>
            </div>
          </Form.FormBody>
        </Form.Body>
      </div>
    </>
  );
}
