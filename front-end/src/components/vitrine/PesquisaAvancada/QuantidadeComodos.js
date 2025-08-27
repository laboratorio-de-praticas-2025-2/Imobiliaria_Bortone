import { Flex } from "antd";
import QuantidadeBotao from "./QuantidadeBotao";

export default function QuantidadeComodos({title, setSelected, selected}) {
    return (
      <div className="w-full slider-preco-container">
        <Flex vertical gap={16}>
          <p className="text-[var(--primary)] font-bold text-end">{title}</p>
          <Flex gap={12} justify="end">
            {["1", "2", "3", "4+"].map((value, index) => (
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