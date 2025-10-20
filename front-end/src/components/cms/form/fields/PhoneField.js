"use client";
import { Input, Form as FormAntd } from "antd";
import { useState, useEffect } from "react";

const formatPhone = (value) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
  }
  if (phoneNumberLength < 11) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6, 10)}`;
  }
  return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
};

// Componente interno que funciona como um input controlado
const PhoneInput = ({ value, onChange, placeholder }) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value) {
      setDisplayValue(formatPhone(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatPhone(rawValue);
    setDisplayValue(formattedValue);
    
    // Propaga o valor formatado para o Form
    if (onChange) {
      onChange(formattedValue);
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value="+55"
        readOnly
        className="custom-input text-center bg-gray-50 border-gray-200 flex-[0_0_20%] max-w-[80px]"
      />
      <Input 
        className={`custom-input flex-1`}
        placeholder={placeholder}
        maxLength={15}
        value={displayValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default function PhoneField({
  name,
  label,
  placeholder = "(11) 99999-9999",
  mask,
  rules = [],
}) {
  return (
    <FormAntd.Item
      label={label}
      name={name}
      rules={rules}
      className={`custom-form-item !w-[100%]`}
      labelCol={{ span: 24 }}
    >
      <PhoneInput placeholder={placeholder} />
    </FormAntd.Item>
  );
}