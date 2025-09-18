"use client";
import { Input, Form as FormAntd } from "antd";

export default function TextField({
  name,
  label,
  placeholder,
  className,
  classInput,
  readOnly = false,
  required = true,
  value,
  onChange,
}) {
  return (
    <FormAntd.Item
      label={label}
      name={name}
      rules={
        readOnly || !required
          ? []
          : [{ required: true, message: "Este campo é obrigatório!" }]
      }
      className={`custom-form-item ${required ? "required" : ""} ${className}`}
      labelCol={{ span: 24 }}
    >
      <Input
        placeholder={placeholder}
        className={`custom-input ${classInput ?? ""}`}
        readOnly={readOnly}
        value={value}
        onChange={onChange}
      />
    </FormAntd.Item>
  );
}
