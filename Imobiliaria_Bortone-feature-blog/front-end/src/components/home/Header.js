import HomeNavbar from "./HomeNavbar";
import HeaderSlider from "./HeaderSlider";
import { Flex, Input, Button } from "antd";

const { Search } = Input;

const onSearch = (value) => console.log(value);

export default function Header() {
  return (
    <div className="header-home">
      <HomeNavbar />
      <div className="md:px-16 md:py-9 px-10 py-14 flex flex-col gap-24">
        <Flex vertical className="md:w-[50%]" gap="60px">
          <Search
            placeholder="Pesquisa"
            onSearch={onSearch}
            className="home-search-bar"
          />
          <Flex vertical gap="large">
            <span className="md:text-[var(--primary)] text-white md:text-6xl text-3xl uppercase lemon-milk">
              Compre, alugue ou anuncie
            </span>
            <span className="md:text-[var(--primary)] text-white md:text-xl text-lg uppercase lemon-milk">
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
