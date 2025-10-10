// components/cms/form/FormBody.jsx
'use client'
import { Form } from "antd";

export default function FormBody({ form, children, onFinish, onFinishFailed, initialValues }) {
  // Se form não foi fornecido, ainda funciona mas sem controle avançado
  if (!form) {
    // Para páginas de criação que não precisam de controle avançado
    return (
      <div className="bg-[#FBFBFB] shadow-md p-7 w-full">
        <Form
          name="basic"
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          requiredMark={true}
          layout="vertical"
        >
          {children}
        </Form>
      </div>
    );
  }

  // Para páginas de edição que precisam de controle avançado com useForm
  return (
    <div className="bg-[#FBFBFB] shadow-md p-7 w-full">
      <Form
        form={form}                     // <-- repassa a instância aqui
        name="basic"
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        requiredMark={true}
        layout="vertical"
      >
        {children}
      </Form>
    </div>
  );
}
