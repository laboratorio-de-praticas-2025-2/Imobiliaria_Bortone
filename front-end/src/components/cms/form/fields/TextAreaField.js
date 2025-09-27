"use client";
import { Input, Form as FormAntd } from "antd";

const { TextArea } = Input;

export default function TextAreaField({
  name, 
  label,
  placeholder,
  rows = 6,
  className,
  value,
  required = true,
  onChange
}) {
  return (
    <FormAntd.Item
      label={label}
      name={name}
      rules={
        !required
          ? []
          : [{ required: true, message: "Este campo é obrigatório!" }]
      }
      className={`custom-form-item ${required ? "required" : ""} ${className}`}
      labelCol={{ span: 24 }}
    >
      <TextArea
        placeholder={placeholder}
        autoSize={{ minRows: rows }}
        className="custom-input"
        value={value}
        onChange={onChange}
      />
    </FormAntd.Item>
  );
}
