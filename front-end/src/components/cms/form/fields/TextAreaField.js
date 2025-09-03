"use client";
import { Input, Form as FormAntd } from "antd";

const { TextArea } = Input;

export default function TextAreaField({
  name,
  label,
  placeholder,
  rows = 6,
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
      <TextArea
        placeholder={placeholder}
        autoSize={{ minRows: rows }}
        className="custom-input"
      />
    </FormAntd.Item>
  );
}
