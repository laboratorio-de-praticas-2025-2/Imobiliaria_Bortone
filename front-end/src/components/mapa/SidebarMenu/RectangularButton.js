"use client";

import React from "react";
import { Button, Flex } from "antd";

export default function RectangularButton({ children, label, onClick, active }) {
  return (
    <Button
      onClick={onClick}
      className={`
       lg:!w-32 lg:!h-20 md:!w-32 md:!h-18 !w-20 !h-18 
        !rounded-xl !flex !flex-col !items-center !justify-center 
        !shadow-md transition
        ${
          active
            ? "!bg-white !text-[var(--unselected)] !border-none"
            : "!bg-[var(--unselected)] !text-white hover:!opacity-80 !border-none"
        }
      `}
      type="text"
    >
      <Flex vertical justify="center" align="center">
        {children}
        <span className="font-semibold button-text">
          {label}
        </span>
      </Flex>
    </Button>
  );
}
