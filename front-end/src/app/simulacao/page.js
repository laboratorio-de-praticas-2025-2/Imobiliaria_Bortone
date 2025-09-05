"use client";
import Header from "@/components/simulacao/Header";
import Form from "@/components/simulacao/Form";
import HomeNavbar from "@/components/home/HomeNavbar";
import { Col, Row } from "antd";

export default function Simulacao() {
  return (
    <div className="fundo">
      <HomeNavbar />
      <div className="image-bg-bottom absolute  " />
      <Row className="!h-[80vh]">
        <Col
          xs={24}
          lg={15}
          className="flex items-center md:items-start md:self-start md:pl-20 pt-[5vh] md:pt-10"
        >
          <Header />
        </Col>
        <Col
          xs={24}
          lg={9}
          className="flex md:pt-[20vh] items-center pt-[25vh] pb-10 "
        >
          <Form />
        </Col>
      </Row>
    </div>
  );
}
