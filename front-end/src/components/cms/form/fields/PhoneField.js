"use client";
import { Input, Form as FormAntd } from "antd";

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

export default function PhoneField({
  name,
  label,
  placeholder = "(11) 99999-9999",
  mask,
  rules = [],
}) {
  const handleChange = (e) => {
    const { value } = e.target;
    const formattedPhone = formatPhone(value);
    e.target.value = formattedPhone;
  };

  return (
    <FormAntd.Item
      label={label}
      name={name}
      rules={rules}
      className={`custom-form-item !w-[100%]`}
      labelCol={{ span: 24 }}
    >
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
          onChange={handleChange}
        />
      </div>
    </FormAntd.Item>
  );
}