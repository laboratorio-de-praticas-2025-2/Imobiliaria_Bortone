import { Flex } from "antd";
import QuantidadeBotao from "./QuantidadeBotao";

export default function QuantidadeComodos({title, setSelected, selected, quantity}) {
    return (
      <div className="w-full slider-preco-container">
        <Flex vertical gap={16}>
          <p className="text-[var(--primary)] font-bold md:text-end">{title}</p>
          <Flex gap={12} className="md:!justify-end">
            {quantity.map((value, index) => (
              <QuantidadeBotao
                key={index}
                label={value}
                active={selected === value}
                onClick={() => setSelected(selected === value ? null : value)}
              />
            ))}
          </Flex>
        </Flex>
      </div>
    );
};