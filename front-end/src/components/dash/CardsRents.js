import { Row, Col } from "antd";
import ApartmentRentCard from "./rent/ApartmentRentCard";
import PropertyNumber from "./PropertyNumber";
import RentCard from "./RentCard";
import PropertyRentCard from "./rent/PropertyRentCard";
export default function Locacoes() {
  return (
    <Row gutter={{ xs: 8, sm: 16 }}>
      <Col className="gutter-row" md={8} xs={24}>
        <RentCard />
      </Col>
      <Col className="gutter-row" md={8} xs={24}>
        <ApartmentRentCard />
      </Col>
      <Col className="gutter-row" md={8} xs={24}>
        <PropertyRentCard />
      </Col>
    </Row>
  );
}
