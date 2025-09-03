'use client'
import { Form } from "antd";

export default function FormBody({ children, onFinish, onFinishFailed }) {
  return (
    <div className="bg-[#FBFBFB] shadow-md p-7 w-full">
      <Form
        name="basic"
        initialValues={{ remember: true }}
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
