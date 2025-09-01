import { Slider, ConfigProvider } from "antd";
import { useState } from "react";

export default function SliderSimu() {
        const [values, setValues] = useState([20000, 100000]);

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Slider: {
              railBg: "var(--secondary)", // trilha vazia
              trackBg: "var(--primary)", // preenchida
              trackHoverBg: "var(--primary)",
              handleColor: "var(--primary)",
              handleActiveColor: "var(--secondary)",
              dotSize: 100,
            },
          },
        }}
      >
        <Slider
          range={{ draggableTrack: true }}
          min={20000}
          max={1000000}
          step={10000}
          value={values}
          onChange={setValues}
          pushable={0}
        />
      </ConfigProvider>
      <div className="flex  w-full">
        <p className="flex-none text-gray-400 font-thin text-[10px] pb-3">
          {values[0].toLocaleString("pt-Br", {
            minimumFractionDigits: 2,
          })}{" "}
        </p>
        <div className="grow"></div>
        <p className="flex-none text-gray-400 font-thin text-[10px] pb-3">
          
          {values[1].toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </p>
      </div>

    </div>
  );
}
