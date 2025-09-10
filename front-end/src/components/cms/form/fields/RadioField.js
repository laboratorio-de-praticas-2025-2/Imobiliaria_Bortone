import { Radio, Form as FormAntd, ConfigProvider } from "antd";

export default function RadioField({ name, label, options, className, initialValue }) {
  return (
    <FormAntd.Item
      label={label}
      name={name}
      rules={[{ required: true, message: "Este campo é obrigatório!" }]}
      className={`custom-form-item ${className}`}
      labelCol={{ span: 24 }}
    >
      <Radio.Group
        options={options}
        className="custom-radio-group"
        defaultValue={initialValue}
      />
    </FormAntd.Item>
  );
}
