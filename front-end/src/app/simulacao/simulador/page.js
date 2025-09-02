"use client";
import { useState } from "react";
import {  Button, Row, Col } from "antd";
import { IoIosArrowRoundBack } from "react-icons/io";
import RequestForm from "@/components/simulacao/RequestForm";
import Filter from "@/components/simulacao/Filter";
import HomeNavbar from "@/components/home/HomeNavbar";
export default function SimulacaoCompra() {
    const handleClick = () => {
    window.location.href = '/simulacao'; // Ou URL completa
  };
  return (
    <div className="">
              <HomeNavbar />
      <div className="absolute top-23 left-5 z-20 block sm:hidden">
        <Button className="!bg-transparent !border-0" type="text" onClick={handleClick} ><IoIosArrowRoundBack className="text-white text-[40px]"/></Button>
      </div>
      <div className="image-bg absolute  " />
      <Row className="!h-[80vh]">
        <Col xs={24} lg={15} className="flex content-end">
          <Filter />
        </Col>
        <Col
          xs={24}
          lg={9}
          className="flex items-center md:pt-[10vh] pt-[40vh] pb-10 "
        >
          <RequestForm />
        </Col>
      </Row>
    </div>
  );
}
