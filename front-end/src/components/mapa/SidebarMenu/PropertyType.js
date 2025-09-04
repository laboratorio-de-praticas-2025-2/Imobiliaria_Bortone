"use client";
import { PiHouseLineFill } from "react-icons/pi";
import { MdTerrain } from "react-icons/md";
import { Row, Col } from "antd";
import RectangularButton from "./RectangularButton";
import { useFilters } from "@/context/FiltersContext";

export default function PropertyType({ activeType, setActiveType }) {
  const { removeFilters } = useFilters();
  return (
    <div>
      <h2 className="menu-label pb-2">Tipo de Propriedade</h2>
      <Row>
        <Col span={12} align="right" className="md:align-left pr-2">
          <RectangularButton
            label="Casa"
            active={activeType === "Casa"}
            onClick={() => {
              setActiveType("Casa");
              removeFilters();
            }}
          >
            <PiHouseLineFill className="w-11 h-11" />
          </RectangularButton>
        </Col>
        <Col span={12} align="left" className="md:align-right pl-2">
          <RectangularButton
            label="Terreno"
            active={activeType === "Terreno"}
            onClick={() => {
              setActiveType("Terreno");
              removeFilters();
            }}
          >
            <MdTerrain className="w-11 h-11" />
          </RectangularButton>
        </Col>
      </Row>
    </div>
  );
}
