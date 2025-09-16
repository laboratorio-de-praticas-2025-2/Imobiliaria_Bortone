"use client";

import { Flex, Input, Button } from 'antd';

const { Search } = Input;
const onSearch = (value) => console.log(value);


export default function InputPesquisa() {
  return (
    <div >
      <div className="md:px-16 md:py-5 px-4 py-4 flex flex-col gap-24">
        <Flex vertical className="md:w-[59%]" gap="3vh">
          <Search
            placeholder="Busque por palavras-chave"
            onSearch={onSearch}
            className="blog-search-bar"
          />
        </Flex>
      </div>
      <hr className="border-2 border-t border-[#D7D7D7]" />
    </div>
  )
}