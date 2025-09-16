"use client";
import { Input, Form as FormAntd } from "antd";

export default function NumberField({
  name,
  label,
  className,
  readOnly = false,
  value,
  onChange,
  placeholder,
  style,
  min,
  max,
  defaultValue,
  step = 1,
}) {
  return (
    <FormAntd.Item
      label={label}
      name={name}
      rules={
        readOnly
          ? []
          : [{ required: true, message: "Este campo é obrigatório!" }]
      }
      className={`custom-form-item ${className}`}
      labelCol={{ span: 24 }}
    >
      <Input
        min={min}
        max={max}
        defaultValue={defaultValue}
        step={step}
        style={style}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type="number"
        controls
        className="custom-input"
        readOnly={readOnly}
      />
    </FormAntd.Item>
  );
}
