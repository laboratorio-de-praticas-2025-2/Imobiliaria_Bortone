import { Row, Col } from "antd";
import SellCard from "./sold/AllSales";
import PropertySoldCard from "./sold/PropertySoldCard";
import ApartmentSoldCard from "./sold/ApartmentSoldCard";
import LotSoldCard from "./sold/LotSoldCard";
export default function Infos() {
  return (
    <Row gutter={{ xs: 8, sm: 16 }}>
      <Col className="gutter-row" lg={6} xs={24}>
        <SellCard />
      </Col>
      <Col className="gutter-row" lg={6} xs={24}>
        <ApartmentSoldCard />
      </Col>
      <Col className="gutter-row" lg={6} xs={24}>
        <PropertySoldCard />
      </Col>
      <Col className="gutter-row" lg={6} xs={24}>
        <LotSoldCard />
      </Col>
    </Row>
  );
}
