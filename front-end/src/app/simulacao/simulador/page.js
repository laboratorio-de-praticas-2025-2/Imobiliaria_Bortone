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
      <div className="image-bg absolute " />
      <Row className="  ">
        <Col span={14} className="content-end  ">
          <Filter className="" />
        </Col>
        <Col span={10}>
          <RequestForm />

        </Col>
      </Row>
    </div>
  );
}
