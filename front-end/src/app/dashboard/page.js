"use client";

import Section from "@/components/dash/Section";
import Card from "@/components/dash/Card";
import { MdOutlineBedroomParent } from "react-icons/md";
import Sidebar from "@/components/cms/Sidebar";
import CMS from "@/components/cms/table";
import { bannersMock } from "@/mock/banner";
import { useEffect, useState } from "react";
import { Row, Col, Input, Button } from "antd";
import { IoOptions } from "react-icons/io5";
import CardsHome from "@/components/dash/CardsHome";
import RentalByRegion from "@/components/dash/rent/RentalByRegion";
import PropertySold from "@/components/dash/PropertySold";
import UsersPerMonth from "@/components/dash/UsersPerMonth";
export default function Dashboard() {
  const style = { background: "#0092ff", padding: "8px 0" };

  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <CMS.Body title={"Dashboard"}>
          <div className="w-[90vw]">
            <div className=" flex flex-col sm:flex-row w-full gap-6">
              {/* Coluna do Formulário */}
              <div className="sm:w-[35%] flex flex-col gap-6 items-start ">
                <Card
                  name={"vendas"}
                  label={"Número total de locações"}
                  value={50}
                  icon={
                    <MdOutlineBedroomParent className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                  }
                />
              </div>
            </div>
          </div>
        </CMS.Body>
      </div>
    </>
  );
}
