import { Flex, Slider, ConfigProvider } from "antd";
import { useState } from "react";
import InputNumerico from "./InputNumerico";

export default function SliderArea() {
  const [minValue, setMinValue] = useState(100);
  const [maxValue, setMaxValue] = useState(10000);

  const onChange = (value) => {
    if (Array.isArray(value)) {
      setMinValue(value[0]);
      setMaxValue(value[1]);
    }
  };

  return (
    <div className="w-full slider-preco-container">
      <Flex vertical gap={16}>
        <p className="text-[var(--primary)] font-bold md:text-end">Área</p>
        <ConfigProvider
          theme={{
            components: {
              Slider: {
                railBg: "var(--secondary)", // trilha vazia
                trackBg: "var(--primary)", // preenchida
                controlSize: 1,
                trackHoverBg: "var(--primary)",
                handleColor: "var(--primary)",
                handleActiveColor: "var(--primary)",
                dotActiveBorderColor: "var(--primary)",
                trackHoverBg: "var(--primary)",
                trackBg: "var(--primary)",
                colorPrimaryBorderHover: "var(--primary)",
                railSize: 2,
                handleSize: 14,
              },
            },
          }}
        >
          <Slider
            range
            value={[minValue, maxValue]}
            min={100}
            max={40000}
            step={10}
            tooltip={{ open: false }}
            onChange={onChange}
          />
        </ConfigProvider>
        <Flex gap={24}>
          <InputNumerico
            label="De:"
            value={minValue}
            onChange={setMinValue}
            type="area"
          />
          <InputNumerico
            label="Até:"
            value={maxValue}
            onChange={setMaxValue}
            type="area"
          />
        </Flex>
      </Flex>
    </div>
  );
}
