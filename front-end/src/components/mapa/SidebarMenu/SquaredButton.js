"use client";

import { Button } from "antd";

export default function SquaredButton({ children, active, onClick }) {
  return (
    <Button           
      onClick={onClick}
      className={`!w-full button-text !h-12 !rounded-md !flex !items-center !justify-center!transition
        ${
          active
            ? "!bg-white !text-[var(--unselected)] !border-none"
            : "!bg-[var(--unselected)] !text-white hover:!opacity-80 !border-none"
        }`}
    >
      {children}
    </Button>
  );
}
