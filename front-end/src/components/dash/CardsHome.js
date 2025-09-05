import { Row, Col } from "antd";
import SellCard from "./SellCard";
import PropertyNumber from "./PropertyNumber";
import RentCard from "./RentCard";
export default function Infos() {
  return (
    <Row gutter={{ xs: 8, sm: 16 }}>
      <Col className="gutter-row" md={8} xs={24}>
        <SellCard />
      </Col>
      <Col className="gutter-row" md={8} xs={24}>
        <RentCard />
      </Col>
      <Col className="gutter-row" md={8} xs={24}>
        <PropertyNumber />
      </Col>
    </Row>
  );
}
