import { Flex } from "antd";
import ToggleCompraAluguel from "./ToggleCompraAluguel";
import SliderPreco from "./SliderPreco";

export default function PesquisaAvancadaModal() {
  return (
    <div className="absolute mt-2 right-0 z-50 bg-[#DEE1F0] rounded-[10px] border-1 border-[#304383] py-7 px-16 min-w-[494px]">
      <Flex vertical align="center" justify="center" className="!gap-13">
        <Flex vertical align="end" className="!gap-8 w-[100%]">
          <ToggleCompraAluguel />
          <SliderPreco/>
        </Flex>
      </Flex>
    </div>
  );
}