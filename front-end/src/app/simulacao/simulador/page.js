"use client";
import { useState } from "react";
import { Card, Button, Input, Slider, Row, Col } from "antd";
import RequestForm from "@/components/simulacao/RequestForm";
import Filter from "@/components/simulacao/Filter";
import HomeNavbar from "@/components/home/HomeNavbar";
export default function SimulacaoCompra() {
  return (
    <div className="">
      <HomeNavbar />
      <div className="image-bg absolute  " />
      <Row className="!h-[80vh]">
        <Col xs={24} lg={15} className="flex content-end">
          <Filter />
        </Col>
        <Col xs={24} lg={9} className="flex items-center md:pt-[10vh] pt-[40vh] pb-10 ">
          <RequestForm />
        </Col>
      </Row>
    </div>
  );
}
