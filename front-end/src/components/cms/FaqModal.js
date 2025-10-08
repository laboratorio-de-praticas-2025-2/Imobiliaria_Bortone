"use client";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import TextField from "@/components/cms/form/fields/TextField";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { Form } from "antd";

export default function FaqModal({ isEdit = false, data, onClose, onSave }) {
  const [form] = Form.useForm();

  // Atualiza os valores iniciais quando o dado muda
  useEffect(() => {
    form.setFieldsValue({
      pergunta: data?.pergunta || "",
      resposta: data?.resposta || "",
    });
  }, [data, form]);

  const handleSubmit = (values) => {
    const updated = {
      ...data,
      ...values,
      ultima_atualizacao: new Date().toISOString().split("T")[0],
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#00000066]  z-50">
      <div className="bg-white rounded-2xl shadow-lg md:w-[80%] w-[90%] overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--primary)] text-white flex items-center gap-3 p-4">
          <button
            onClick={onClose}
            className="text-white hover:opacity-80 transition"
          >
            <IoArrowBack size={22} />
          </button>
          <p className="text-lg !font-semibold">
            {isEdit ? "Editar FAQ" : "Adicionar FAQ"}
          </p>
        </div>
        <div className="py-6 md:px-43 px-6 flex flex-col gap-4">
          <Form
            form={form}
            name="faqForm"
            layout="vertical"
            autoComplete="off"
            onFinish={handleSubmit}
          >
            <TextField
              name="pergunta"
              label="Pergunta"
              placeholder="Digite a pergunta"
              className="!w-full"
              rules={[
                { required: true, message: "Por favor, insira a pergunta." },
              ]}
            />

            <TextAreaField
              name="resposta"
              label="Resposta"
              placeholder="Digite a resposta"
              rows={6}
              className="!w-full"
              rules={[
                { required: true, message: "Por favor, insira a resposta." },
              ]}
            />

            <div className="flex justify-center mt-4">
              <button
                onClick={handleSubmit}
                className="bg-[#2C3E99] px-6 py-2 rounded-full hover:bg-[#223173] transition font-medium shadow-md"
              >
                <p className="text-white">
                  {isEdit ? "Salvar alterações" : "Cadastrar pergunta"}
                </p>
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
