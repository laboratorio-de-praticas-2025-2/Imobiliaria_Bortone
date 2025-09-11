"use client";
import { InputNumber } from "antd";

export default function InputNumerico ({ label, value, onChange, type }){
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[var(--primary)]">{label}</p>
      <InputNumber
        style={{ width: "100%" }}
        value={value}
        onChange={onChange}
        formatter={(value) =>
          type === "area"
            ? `${value} m²`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            : `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
        parser={(value) =>
          type === "area"
            ? value.replace(/[^\d]/g, "")
            : value.replace(/\D/g, "")
        }
        className="!bg-transparent !border-[var(--primary)] !border-2 !text-[var(--primary)]"
      />
    </div>
  );
};