import Section from "@/components/dash/Section";
import { Row, Col, Input, Button } from "antd";
import { IoOptions } from "react-icons/io5";
import Infos from "@/components/dash/Infos";
import RentalByRegion from "@/components/dash/RentalByRegion";
import PropertySold from "@/components/dash/PropertySold";
export default function Dashboard() {
  const style = { background: "#0092ff", padding: "8px 0" };

  return (
    <div className="">
      <div className="w-[90vw]">
        <div className="h-[200px] bg-[var(--secondary)]">
          <div className="">
            <Row>
              <Col className="gutter-row" md={7} xs={24}>
                <div style={style}>
                  <span className="text-white text-[40px] font-[700] ">
                    Titulo
                  </span>
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
            </Row>{" "}
          </div>
        </div>

        <div className="w-[90vw] justify-self-center">
          <Section />
        </div>
      </div>

      <div className="w-[90vw]">
        <Row gutter={{ xs: 8, sm: 16 }}>
          <Col lg={14} xs={24}>
            <Infos />
            <Row>
              <Col className="gutter-row" span={24}>
                <div style={style}>a-6</div>
              </Col>
            </Row>
          </Col>

          <Col lg={10} xs={24}>
            <Row gutter={{ xs: 8, sm: 16}}>
              <Col className="gutter-row" span={24}>
                <RentalByRegion />
              </Col>
            </Row>
            <Row className="py-4">
              <Col className="gutter-row" span={24}>
                <PropertySold />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}
