import { Flex, Slider, ConfigProvider } from "antd";
import { useState, useEffect } from "react";
import InputNumerico from "./InputNumerico";

export default function SliderPreco({ value, onChange }) {
  const [minValue, setMinValue] = useState(value[0]);
  const [maxValue, setMaxValue] = useState(value[1]);

  useEffect(() => {
    setMinValue(value[0]);
    setMaxValue(value[1]);
  }, [value]);

  const handleSliderChange = (newValue) => {
    if (Array.isArray(newValue)) {
      setMinValue(newValue[0]);
      setMaxValue(newValue[1]);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  const handleMinInputChange = (newMin) => {
    const newMinVal = parseFloat(newMin);
    if (!isNaN(newMinVal) && newMinVal <= maxValue) {
      setMinValue(newMinVal);
      if (onChange) {
        onChange([newMinVal, maxValue]);
      }
    }
  };

  const handleMaxInputChange = (newMax) => {
    const newMaxVal = parseFloat(newMax);
    if (!isNaN(newMaxVal) && newMaxVal >= minValue) {
      setMaxValue(newMaxVal);
      if (onChange) {
        onChange([minValue, newMaxVal]);
      }
    }
  };

  return (
    <div className="w-full slider-preco-container">
      <Flex vertical gap={16}>
        <p className="text-[var(--primary)] font-bold md:text-start">Valor</p>
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
            min={150000}
            max={1500000}
            step={10}
            tooltip={{ open: false }}
            onChange={handleSliderChange}
          />
        </ConfigProvider>
        <Flex gap={24}>
          <InputNumerico label="De:" value={minValue} onChange={handleMinInputChange} />
          <InputNumerico label="Até:" value={maxValue} onChange={handleMaxInputChange} />
        </Flex>
      </Flex>
    </div>
  );
}
