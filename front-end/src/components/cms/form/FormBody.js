// components/cms/form/FormBody.jsx
'use client'
import { Form } from "antd";

export default function FormBody({ form, children, onFinish, onFinishFailed, initialValues }) {
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
