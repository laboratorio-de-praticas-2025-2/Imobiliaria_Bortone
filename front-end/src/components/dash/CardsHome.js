import { Row, Col } from "antd";
import Card from "@/components/dash/Card";
import { MdOutlineBedroomParent } from "react-icons/md";

export default function Infos() {
  return (
    <Row gutter={{ xs: 8, sm: 16 }}>
      <Col className="gutter-row" md={8} xs={24}>
      </Col>
      <Col className="gutter-row" md={8} xs={24}>
        <Card 
          name={"vendas"}
          label={"Número total de locações"}
          value={50}
          icon={<MdOutlineBedroomParent className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />}
        />
      </Col>
      <Col className="gutter-row" md={8} xs={24}>
      </Col>
    </Row>
  );
}
