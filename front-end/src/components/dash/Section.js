import { Row, Col, Input, Button, Card } from "antd";
import Link from "next/link";
import { PiCoinsFill, PiHouseBold } from "react-icons/pi";
import { MdOutlineBedroomParent } from "react-icons/md";
import { FaUserLarge, FaHouse } from "react-icons/fa6";
export default function Section() {
  return (
    <Row gutter={{ xs: 8, sm: 16 }}>
      <Col className="gutter-row" md={6} xs={12}>
        <Link href="/dashboard/vendas">
          <Button
            type="default"
            className="group !h-[13vh] !w-full flex !gap-x-9 md:!gap-x-12 items-center rounded-xl px-10 !border-0 !bg-white !shadow-md
            hover:!bg-[var(--primary)] focus:!bg-[var(--primary)] active:!bg-[var(--primary)]
            hover:!border-0 focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-md
            transition-colors cursor-pointer"
          >
            <span className="text-2xl md:text-3xl font-bold text-[var(--primary)] group-hover:text-white transition-colors">
              Vendas
            </span>
            <PiCoinsFill className="text-[var(--primary)] text-5xl group-hover:text-white transition-colors" />
          </Button>
        </Link>
      </Col>
      <Col className="gutter-row" md={6} xs={12}>
        <Button
          type="default"
          className="group !h-[13vh] !w-full flex !gap-x-9 md:!gap-x-12 items-center rounded-xl px-10 !border-0 !bg-white !shadow-md
            hover:!bg-[var(--primary)] focus:!bg-[var(--primary)] active:!bg-[var(--primary)]
            hover:!border-0 focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-md
            transition-colors cursor-pointer"
        >
          <span className="text-2xl md:text-3xl font-bold text-[var(--primary)] group-hover:text-white transition-colors">
            Locações
          </span>
          <MdOutlineBedroomParent className="text-[var(--primary)] text-5xl group-hover:text-white transition-colors" />
        </Button>
      </Col>
      <Col className="gutter-row" md={6} xs={12}>
        <Button
          type="default"
          className="group !h-[13vh] !w-full flex !gap-x-9 md:!gap-x-12 items-center rounded-xl px-10 !border-0 !bg-white !shadow-md
            hover:!bg-[var(--primary)] focus:!bg-[var(--primary)] active:!bg-[var(--primary)]
            hover:!border-0 focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-md
            transition-colors cursor-pointer"
        >
          <span className="text-2xl md:text-3xl font-bold text-[var(--primary)] group-hover:text-white transition-colors">
            Usuários
          </span>
          <FaUserLarge className="text-[var(--primary)] text-3xl group-hover:text-white transition-colors" />
        </Button>
      </Col>
      <Col className="gutter-row" md={6} xs={12}>
        <Button
          type="default"
          className="group !h-[13vh] !w-full flex !gap-x-9 md:!gap-x-12 items-center rounded-xl px-10 !border-0 !bg-white !shadow-md
            hover:!bg-[var(--primary)] focus:!bg-[var(--primary)] active:!bg-[var(--primary)]
            hover:!border-0 focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-md
            transition-colors cursor-pointer"
        >
          <span className="text-2xl md:text-3xl font-bold text-[var(--primary)] group-hover:text-white transition-colors">
            Imóveis
          </span>
          <PiHouseBold className="text-[var(--primary)] text-5xl group-hover:text-white transition-colors" />
        </Button>
      </Col>
    </Row>
  );
}
