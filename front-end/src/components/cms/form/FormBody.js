'use client'
import { Form } from "antd";

export default function FormBody({ children, onFinish, onFinishFailed, initialValues }) {
  return (
    <div className="bg-[#FBFBFB] shadow-md p-7 w-full">
      <Form
        name="basic"
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        requiredMark={true}
      >
        {children}
      </Form>
    </div>
  );
}
