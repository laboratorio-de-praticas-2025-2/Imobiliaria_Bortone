"use client";
import { PiHouseLineFill } from "react-icons/pi";
import { MdTerrain } from "react-icons/md";
import { Row, Col } from "antd";
import RectangularButton from "./RectangularButton";

export default function PropertyType({ activeType, setActiveType }) {
  return (
    <div>
      <h2 className="menu-label pb-3">Tipo de Propriedade</h2>
      <Row>
        <Col span={12} align="left">
          <RectangularButton
            label="Casa"
            active={activeType === "Casa"}
            onClick={() => setActiveType("Casa")}
            children={<PiHouseLineFill className="w-11 h-11" />}
          />
        </Col>
        <Col span={12} align="right">
          <RectangularButton
            icon="/icons/terreno.svg"
            label="Terreno"
            active={activeType === "Terreno"}
            onClick={() => setActiveType("Terreno")}
            children={<MdTerrain className="w-11 h-11" />}
          />
        </Col>
      </Row>
    </div>
  );
}
