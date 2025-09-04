"use client";
import ConfirmModal from "@/components/cms/ConfirmModal";
import Form from "@/components/cms/form";
import FormButton from "@/components/cms/form/fields/Button";
import TextField from "@/components/cms/form/fields/TextField";
import Sidebar from "@/components/cms/Sidebar";
import { usersMock } from "@/mock/users";
import RadioField from "@/components/cms/form/fields/RadioField";
import { useEffect, useState } from "react";

export default function EditarUserPage({ params }) {
  const id = params?.id;
  const [user, setUser] = useState(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [formValues, setFormValues] = useState(null);

  useEffect(() => {
    const found = usersMock.find((b) => String(b.id) === String(id));
    setUser(found);
  }, [id]);

  const onFinish = (values) => {
    setFormValues(values);
    setIsConfirmModalVisible(true);
  };

  const onConfirm = () => {
    console.log("Edit Success:", formValues);
    setIsConfirmModalVisible(false);
    window.location.href = "/admin/cms-usuarios";
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Edit Failed:", errorInfo);
  };

  if (!user) return <div>Carregando...</div>;

  return (
    <>
      {isConfirmModalVisible && (
        <ConfirmModal
          message="Você tem certeza que deseja alterar o registro definitivamente?"
          onConfirm={onConfirm}
          onCancel={() => setIsConfirmModalVisible(false)}
        />
      )}
      <Sidebar />
      <div className="md:ml-20">
        <Form.Body title="Usuários | Edição">
          <Form.FormHeader href="/admin/cms-usuarios" />
          <Form.FormBody
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
              nome: user.nome,
              email: user.email,
              nivel: user.nivel,
              celular: user.celular,
            }}
          >
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
                  initialValue={user.nivel}
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
                <FormButton text="Salvar Alterações" />
              </div>
            </div>
          </Form.FormBody>
        </Form.Body>
      </div>
    </>
  );
}
