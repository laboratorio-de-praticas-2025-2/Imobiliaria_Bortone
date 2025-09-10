import { Radio, Form as FormAntd, ConfigProvider } from "antd";

export default function RadioFieldImovel({
  name,
  label,
  options,
  className,
  initialValue,
}) {
  return (
    <div className="flex items-center w-fit custom-input justify-center !rounded-full px-8 py-2 !text-[var(--primary)] font-medium focus:outline-none cursor-pointer ">
      <ConfigProvider
        theme={{
          components: {
            Radio: {
              colorText: "#374a8c",
              fontSize: 16
            },
          },
        }}
      >
        <Radio.Group
          options={options}
          className="font-bold"
          defaultValue={initialValue}
        />
      </ConfigProvider>
    </div>
  );
}
