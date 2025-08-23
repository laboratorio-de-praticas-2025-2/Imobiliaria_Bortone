"use client";
import HomeNavbar from "@/components/HomeNavbar";
import { Flex, Input, Button } from "antd";
import HeaderSlider from "@/components/HeaderSlider";

const { Search } = Input;

const onSearch = (value) => console.log(value);

export default function Home() {
  return (
    <div className="header-home">
      <HomeNavbar />
      <div className="px-16 pt-7 flex flex-col gap-24">
        <Flex vertical style={{ width: "50%" }} gap="60px">
          <Search
            placeholder="Pesquisa"
            onSearch={onSearch}
            className="home-search-bar"
          />
          <Flex vertical gap="large">
            <span className="text-[var(--primary)] text-6xl font-extrabold uppercase">
              Compre, alugue ou anuncie
            </span>
            <span className="text-[var(--primary)] text-xl font-extrabold uppercase">
              Confira Imóveis à partir de
              <p>R$ 250.000,00</p>
            </span>
            <Button
              variant="outlined"
              shape="round"
              className="btn-marcar-visita"
            >
              MARQUE UMA VISITA
            </Button>
          </Flex>
        </Flex>
        <HeaderSlider />
      </div>
    </div>
  );
}
