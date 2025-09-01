"use client";
import Header from "@/components/simulacao/Header";
import Form from "@/components/simulacao/Form";
import HomeNavbar from "@/components/home/HomeNavbar";
import { Col, Row } from "antd";

export default function Simulacao() {
  return (
    <div className="min-h-screen flex fundo flex-col bg-simulacao ">
      <HomeNavbar />
      <div className="hidden lg:block">
        <Row className="absolute h-[70%] w-full z-100">
          <Col span={14} className="md:px-25 py-15 lg:px-30">
            <Header />
          </Col>
          <Col span={8} className="self-end px-20">
            <Form />
          </Col>
        </Row>
      </div>
      <div className=" block lg:hidden h-full w-full">
        <div className="h-[50%] absolute">
          <div className="h-full w-screen place-items-center pt-10">
            <Header />
          </div>
          <div className="w-screen">
            <Form />
          </div>
        </div>
      </div>

      <div className="md:flex-1 fundo flex items-end  ">
        <div className="image-header  w-full"></div>
      </div>
    </div>
  );
}
