import { Row, Col, Input, Button, Card } from "antd";
import { PiCoinsFill, PiHouseBold } from "react-icons/pi";
import { MdOutlineBedroomParent } from "react-icons/md";
import { FaUserLarge, FaHouse } from "react-icons/fa6";
export default function Infos() {
  return (
    <Row gutter={{ xs: 8, sm: 16 }}>
      <Col className="gutter-row" md={8} xs={24}>
        <div
          className="group h-[100px] md:!h-[150px] !w-full flex  items-center    rounded-xl px-10 md:px-3 xl:px-10 !border-0 !bg-[#EEF0F9] !shadow-md
            hover:!bg-[var(--primary)] focus:!bg-[var(--primary)] active:!bg-[var(--primary)]
            hover:!border-0 focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-md
            transition-colors cursor-pointer"
        >
          <div className="grid grid-col  content-evenly  w-full h-full">
            <span className="w-full lg:text-center text-md lg:text-lg text-[var(--primary)] group-hover:text-white transition-colors">
              Número total de vendas
            </span>

            <div className="flex items-center justify-between w-full ">
              <span className="text-4xl md:text-3xl lg:text-5xl font-bold text-[var(--primary)] group-hover:text-white transition-colors">
                50
              </span>
              <PiCoinsFill className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </Col>
      <Col className="gutter-row" md={8} xs={24}>
        <div
          className="group h-[100px] md:!h-[150px] !w-full flex  items-center    rounded-xl px-10 md:px-3 xl:px-10 !border-0 !bg-[#EEF0F9] !shadow-md
            hover:!bg-[var(--primary)] focus:!bg-[var(--primary)] active:!bg-[var(--primary)]
            hover:!border-0 focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-md
            transition-colors cursor-pointer"
        >
          <div className="grid grid-col  content-evenly  w-full h-full">
            <span className="w-full lg:text-center text-md lg:text-lg text-[var(--primary)] group-hover:text-white transition-colors">
              Número total de Locações
            </span>

            <div className="flex items-center justify-between w-full ">
              <span className="text-4xl md:text-3xl lg:text-5xl font-bold text-[var(--primary)] group-hover:text-white transition-colors">
                50
              </span>
              <MdOutlineBedroomParent className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </Col>
      <Col className="gutter-row" md={8} xs={24}>
        <div
          className="group h-[100px] md:!h-[150px] !w-full flex  items-center    rounded-xl px-10 md:px-3 xl:px-10 !border-0 !bg-[#EEF0F9] !shadow-md
            hover:!bg-[var(--primary)] focus:!bg-[var(--primary)] active:!bg-[var(--primary)]
            hover:!border-0 focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-md
            transition-colors cursor-pointer"
        >
          <div className="grid grid-col  content-evenly  w-full h-full">
            <span className="w-full lg:text-center text-md lg:text-lg text-[var(--primary)] group-hover:text-white transition-colors">
              Número total de imóveis
            </span>

            <div className="flex items-center justify-between w-full ">
              <span className="text-4xl md:text-3xl lg:text-5xl font-bold text-[var(--primary)] group-hover:text-white transition-colors">
                50
              </span>
              <PiHouseBold className="text-[var(--primary)] text-5xl md:text-3xl lg:text-5xl group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}
