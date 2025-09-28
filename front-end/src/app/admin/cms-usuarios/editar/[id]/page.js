"use client";
import ConfirmModal from "@/components/cms/ConfirmModal";
import Form from "@/components/cms/form";
import FormButton from "@/components/cms/form/fields/Button";
import TextField from "@/components/cms/form/fields/TextField";
import Sidebar from "@/components/cms/Sidebar";
import axios from "axios";
import RadioField from "@/components/cms/form/fields/RadioField";
import { useEffect, useState } from "react";

export default function EditarUserPage({ params }) {
  const id = params?.id;
  const [user, setUser] = useState(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [formValues, setFormValues] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${apiUrl}/user/user/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        setUser(null);
      }
    }
    if (id) fetchUser();
  }, [id]);

  const onFinish = (values) => {
    setFormValues(values);
    setIsConfirmModalVisible(true);
  };

  const onConfirm = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const payload = {
        ...formValues,
        nivel: formValues.nivel === "administrador" ? 0 : 1,
        ativo: 1 
      };
      await axios.put(`${apiUrl}/user/${id}`, payload);
      setIsConfirmModalVisible(false);
      window.location.href = "/admin/cms-usuarios";
    } catch (err) {
      console.error("Erro ao editar usuário:", err);
    }
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
              nivel: user.nivel === 0 ? "administrador" : "usuario",
              celular: user.celular,
            }}
          >
            <div className="flex flex-col sm:flex-row w-full justify-center">
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
                  initialValue={user.nivel === 0 ? "administrador" : "usuario"}
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
