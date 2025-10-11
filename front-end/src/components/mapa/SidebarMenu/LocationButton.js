import React from 'react';
import { Button, Flex } from "antd";

export default function LocationButton({ label, onClick, active }) {
  return (
    <Button
      onClick={onClick}
      className={`
        !w-full !h-10 md:!h-12 !rounded-xl !flex !flex-col !items-center !justify-center !shadow-md transition 
        ${
          active
            ? "!bg-white !text-[var(--unselected)] !border-none" // Estilo quando ativo
            : "!bg-[var(--unselected)] !text-white hover:!opacity-80 !border-none" // Estilo quando inativo, com hover
        }
      `}
      type="text"
    >
      <Flex vertical justify="center" align="center">
        <span className="font-semibold !text-[12px] text-center px-1 leading-tight">
          {label}
        </span>
      </Flex>
    </Button>
  );
}
