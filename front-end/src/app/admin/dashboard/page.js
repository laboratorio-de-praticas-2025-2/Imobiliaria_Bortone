"use client";

import Card from "@/components/dash/Card";
import Sidebar from "@/components/cms/Sidebar";
import PizzaGraph from "@/components/dash/PizzaGraph";
import CMS from "@/components/cms/table";
import { PiCoinsFill } from "react-icons/pi";
import { BsFillBuildingFill } from "react-icons/bs";
import { MdTerrain, MdOutlineBedroomParent } from "react-icons/md";
import { FaUserPlus, FaUserPen, FaUser, FaHouseChimney } from "react-icons/fa6";
import { FaCheckSquare } from "react-icons/fa";
import LineGraph from "@/components/dash/LineGraph";
export default function Dashboard() {
  const data = {
    labels: ["Apartamentos", "Casas", "Terrenos"],
    datasets: [
      {
        data: [45, 25, 15],
        backgroundColor: [
          "#243B7B",
          "#F39C12",
          "#E74C3C",
          "#B8AEBF",
          "#A6A6A6",
        ], // cores
        borderWidth: 0,
        cutout: "0%", // transforma em donut (se fosse 0%, seria uma pizza cheia)
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: false,
          boxHeight: 18,

          color: "black",
          boxWidth: 18,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <CMS.Body title={"Dashboard"}>
          {/* Aparente em telas grandes: */}
          <div className="hidden xl:block">
            <div className="grid grid-cols-7 p-7 w-full gap-6">
              <div className="grid grid-rows-5 col-span-2 gap-6">
                <div className="row-span-2">
                  <PizzaGraph
                    label={"Venda nos últimos 30 dias"}
                    data={data}
                    options={options}
                  />
                </div>

                <div className="grid grid-rows-3 row-span-3 content-between gap-6 h-full">
                  <Card
                    name={"usuarios_cadastrados"}
                    label={"Total de usuários cadastrados"}
                    value={200}
                    labelCol={{ span: 24 }}
                    icon={
                      <FaUserPlus className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                    }
                  />

                  <Card
                    name={"usuarios_administradores"}
                    label={"Usuários administradores"}
                    value={5}
                    labelCol={{ span: 24 }}
                    icon={
                      <FaUserPen className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                    }
                  />

                  <Card
                    name={"casas_visitantes"}
                    label={"Usuários visitantes"}
                    value={195}
                    labelCol={{ span: 24 }}
                    icon={
                      <FaUser className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                    }
                  />
                </div>
              </div>
              <div className="grid grid-rows-5 col-span-5 gap-6">
                <div className="grid grid-rows-7 row-span-2 gap-6">
                  <div className="grid grid-cols-2 row-span-4  gap-6">
                    <Card
                      name={"vendas"}
                      label={"Total de imóveis disponíveis para venda"}
                      className={"!text-3xl"}
                      value={55}
                      labelCol={{ span: 24 }}
                      icon={
                        <PiCoinsFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                      }
                    />
                    <Card
                      name={"locacoes"}
                      label={"Total de imóveis disponíveis para locações"}
                      className={"!text-3xl"}
                      value={50}
                      labelCol={{ span: 24 }}
                      icon={
                        <MdOutlineBedroomParent className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 row-span-3 gap-6">
                    <div className="">
                      <Card
                        name={"imoveis_disponiveis"}
                        label={"Total de imóveis disponíveis"}
                        value={60}
                        labelCol={{ span: 24 }}
                        className={"!text-lg"}
                        icon={
                          <FaCheckSquare className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                        }
                      />
                    </div>
                    <div className="">
                      <Card
                        name={"apartamentos_disponiveis"}
                        label={"Apartamentos disponíveis"}
                        value={7}
                        labelCol={{ span: 24 }}
                        className={"!text-lg"}
                        icon={
                          <BsFillBuildingFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                        }
                      />
                    </div>
                    <div className="">
                      <Card
                        name={"casas_disponiveis"}
                        label={"Casas disponíveis"}
                        value={12}
                        labelCol={{ span: 24 }}
                        className={"!text-lg"}
                        icon={
                          <FaHouseChimney className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                        }
                      />
                    </div>
                    <div className="">
                      <Card
                        name={"terrenos_disponiveis"}
                        label={"Terrenos disponíveis"}
                        value={12}
                        labelCol={{ span: 24 }}
                        className={"!text-lg"}
                        icon={
                          <MdTerrain className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row-span-3">
                  <LineGraph />
                </div>
              </div>
            </div>
          </div>
          {/* Aparente em telas médias: */}
          <div className="hidden md:block xl:hidden pb-10">
            <div className="grid grid-flow-row h-fit gap-6">
              <div className="grid grid-cols-2 h-fit gap-6">
                <div className="">
                  {" "}
                  <PizzaGraph
                    label={"Venda nos últimos 30 dias"}
                    className={"p-6"}
                    data={data}
                    options={options}
                  />
                </div>
                <div className="grid grid-rows-2 h-[220px] gap-6">
                  <Card
                    name={"vendas"}
                    label={"Total de imóveis disponíveis para venda"}
                    className={"!text-xl"}
                    value={55}
                    labelCol={{ span: 24 }}
                    icon={
                      <PiCoinsFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                    }
                  />
                  <Card
                    name={"locacoes"}
                    label={"Total de imóveis disponíveis para locações"}
                    className={"!text-xl"}
                    value={50}
                    labelCol={{ span: 24 }}
                    icon={
                      <MdOutlineBedroomParent className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 h-[100px] gap-6">
                <div className="col-span-1">
                  {" "}
                  <Card
                    name={"imoveis_disponiveis"}
                    label={"Total de imóveis disponíveis"}
                    value={60}
                    labelCol={{ span: 24 }}
                    className={"!text-lg"}
                    icon={
                      <FaCheckSquare className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                    }
                  />
                </div>
                <div className="col-span-2">
                  {" "}
                  <Card
                    name={"apartamentos_disponiveis"}
                    label={"Apartamentos disponíveis"}
                    value={7}
                    labelCol={{ span: 24 }}
                    className={"!text-xl"}
                    icon={
                      <BsFillBuildingFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 h-[100px] gap-6">
                {" "}
                <Card
                  name={"casas_disponiveis"}
                  label={"Casas disponíveis"}
                  value={12}
                  labelCol={{ span: 24 }}
                  className={"!text-xl"}
                  icon={
                    <FaHouseChimney className="text-[var(--primary)] text-5xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                  }
                />{" "}
                <Card
                  name={"terrenos_disponiveis"}
                  label={"Terrenos disponíveis"}
                  value={12}
                  labelCol={{ span: 24 }}
                  className={"!text-xl"}
                  icon={
                    <MdTerrain className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                  }
                />
              </div>
              <div className="">
                {" "}
                <LineGraph />
              </div>
              <div className="grid grid-cols-2 h-[100px] gap-6">
                {" "}
                <Card
                  name={"usuarios_cadastrados"}
                  label={"Total de usuários cadastrados"}
                  value={200}
                  labelCol={{ span: 24 }}
                  className={"!text-xl"}
                  icon={
                    <FaUserPlus className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                  }
                />
                <Card
                  name={"usuarios_administradores"}
                  label={"Usuários administradores"}
                  value={5}
                  labelCol={{ span: 24 }}
                  className={"!text-xl"}
                  icon={
                    <FaUserPen className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                  }
                />
              </div>
              <div className="h-[100px]">
                {" "}
                <Card
                  name={"casas_visitantes"}
                  label={"Usuários visitantes"}
                  value={195}
                  labelCol={{ span: 24 }}
                  className={"!text-xl"}
                  icon={
                    <FaUser className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                  }
                />
              </div>
            </div>
          </div>
          <div className="block md:hidden  pb-10">
            <div className="grid grid-flow-row h-fit gap-6">
              <div className="">
                <PizzaGraph
                  label={"Venda nos últimos 30 dias"}
                  className={"p-6"}
                  data={data}
                  options={options}
                />
              </div>{" "}
              <Card
                name={"vendas"}
                label={"Número total de vendas"}
                className={"!text-xl"}
                value={55}
                labelCol={{ span: 24 }}
                icon={
                  <PiCoinsFill className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                }
              />
              <Card
                name={"locacoes"}
                label={"Número total de locações"}
                className={"!text-xl"}
                value={50}
                labelCol={{ span: 24 }}
                icon={
                  <MdOutlineBedroomParent className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                }
              />
              <Card
                name={"imoveis_disponiveis"}
                label={"Total de imóveis disponíveis"}
                value={60}
                labelCol={{ span: 24 }}
                className={"!text-lg"}
                icon={
                  <FaCheckSquare className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                }
              />
              <Card
                name={"apartamentos_disponiveis"}
                label={"Apartamentos disponíveis"}
                value={7}
                labelCol={{ span: 24 }}
                className={"!text-xl"}
                icon={
                  <BsFillBuildingFill className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                }
              />{" "}
              <Card
                name={"casas_disponiveis"}
                label={"Casas disponíveis"}
                value={12}
                labelCol={{ span: 24 }}
                className={"!text-xl"}
                icon={
                  <FaHouseChimney className="text-[var(--primary)] text-4xl md:text-3xl lg:text-4xl group-hover:text-white transition-colors" />
                }
              />{" "}
              <Card
                name={"terrenos_disponiveis"}
                label={"Terrenos disponíveis"}
                value={12}
                labelCol={{ span: 24 }}
                className={"!text-xl"}
                icon={
                  <MdTerrain className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                }
              />{" "}
              <LineGraph />
              <Card
                name={"usuarios_cadastrados"}
                label={"Total de usuários cadastrados"}
                value={200}
                labelCol={{ span: 24 }}
                className={"!text-xl"}
                icon={
                  <FaUserPlus className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                }
              />
              <Card
                name={"usuarios_administradores"}
                label={"Usuários administradores"}
                value={5}
                labelCol={{ span: 24 }}
                className={"!text-xl"}
                icon={
                  <FaUserPen className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                }
              />{" "}
              <Card
                name={"casas_visitantes"}
                label={"Usuários visitantes"}
                value={195}
                labelCol={{ span: 24 }}
                className={"!text-xl"}
                icon={
                  <FaUser className="text-[var(--primary)] text-4xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
                }
              />
            </div>
          </div>
        </CMS.Body>
      </div>
    </>
  );
}
