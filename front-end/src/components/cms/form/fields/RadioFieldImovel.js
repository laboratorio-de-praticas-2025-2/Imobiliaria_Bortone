import { Radio, Form as FormAntd, ConfigProvider } from "antd";

export default function RadioFieldImovel({
  options,
  initialValue,
}) {
  return (
    <div className="flex items-center  custom-input justify-center !rounded-full  py-2 !text-[var(--primary)] font-medium focus:outline-none cursor-pointer w-[100%] ">
      <ConfigProvider
        theme={{
          components: {
            Radio: {
              colorText: "#374a8c",
              fontSize: 16,
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
