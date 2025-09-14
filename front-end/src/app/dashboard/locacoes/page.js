import Section from "@/components/dash/Section";
import { Row, Col, Input, Button } from "antd";
import { IoOptions } from "react-icons/io5";
import CardsRents from "@/components/dash/CardsRents";
import PropertyByRegion from "@/components/dash/PizzaGraph";
import PropertySold from "@/components/dash/PropertySold";
import SalesLineGraph from "@/components/dash/sold/LineGraph";
export default function Dashboard() {
  const style = { background: "#0092ff", padding: "8px 0" };

  return (
    <div className="">
      <div className="w-[90vw] pb-4">
        <Row className="">
          <Col className="gutter-row" md={7} xs={24}>
            <div style={style}>
              <span className="text-white text-[40px] font-[700] ">Titulo</span>
            </div>
          </Col>
          <Col className="gutter-row" md={10} xs={24}>
            <div style={style} className="gap-2 flex">
              <Input />
              <Button
                shape="circle"
                icon={<IoOptions />}
                className="!border-0"
              />
            </div>
          </Col>
          <Col className="gutter-row" md={7} xs={24}>
            <div style={style}></div>
          </Col>
        </Row>
        <Section />
      </div>
      <div className="w-[90vw]">
        <Row gutter={{ xs: 8, sm: 16 }}>
          <Col lg={14} xs={24}>
            <CardsRents/>
            <SalesLineGraph />
          </Col>

          <Col lg={10} xs={24}>
            <PropertyByRegion />
            <PropertySold />
          </Col>
        </Row>
      </div>
    </div>
  );
}
