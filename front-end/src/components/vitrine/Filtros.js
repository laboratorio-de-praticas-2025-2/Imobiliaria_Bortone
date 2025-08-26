import LocationInput from "./LocationInput"
import DropdownFilter from "./DropdownFilter"
import PesquisaAvancada from "./PesquisaAvancada";
import { Flex, Space } from "antd"

const optionsBuy = ["Comprar", "Alugar"];
const optionsRooms = ["1", "2", "3", "+4"];
const optionsBathrooms = ["1", "2", "3", "+4"];

export default function Filtros() {
    return (
        <div className="py-7 px-18">
            <Flex justify="space-between" style={{width: '100%'}}>
                <Space size="large">
                <LocationInput />
                <DropdownFilter options={optionsBuy} />
                <DropdownFilter options={optionsRooms} placeholder={"Quartos"}/>
                <DropdownFilter options={optionsBathrooms} placeholder={"Banheiros"}/>
                </Space>
                <PesquisaAvancada/>
            </Flex>
        </div>
    );
}