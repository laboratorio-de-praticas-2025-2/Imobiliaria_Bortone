"use client";
import { Input, Form as FormAntd } from "antd";

export default function TextField({ 
  name,
  label,
  placeholder,
  className,
}) {
  return (
    <FormAntd.Item
      label={label}
      name={name}
      rules={[{ required: true, message: "Este campo é obrigatório!" }]}
      className={`custom-form-item ${className}`}
      labelCol={{ span: 24 }}
    >
      <Input placeholder={placeholder} className="custom-input" />
    </FormAntd.Item>
  );
}
