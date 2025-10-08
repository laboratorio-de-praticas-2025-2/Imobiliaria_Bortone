"use client";

import { Flex, Input, Button } from 'antd';
import { useState } from 'react';

const { Search } = Input;

export default function InputPesquisa({ onSearch }) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value) => {
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div >
      <div className="md:px-16 md:py-5 px-4 py-4 flex flex-col gap-24">
        <Flex vertical className="md:w-[59%]" gap="3vh">
          <Search
            placeholder="Busque por palavras-chave"
            onSearch={handleSearch}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="blog-search-bar"
            size="large"
            enterButton
          />
        </Flex>
      </div>
      <hr className="border-2 border-t border-[#D7D7D7]" />
    </div>
  )
}