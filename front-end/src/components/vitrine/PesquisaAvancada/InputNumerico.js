"use client";
import { InputNumber } from "antd";

export default function InputNumerico({ label, value, onChange, type }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[var(--primary)]">{label}</p>
      <InputNumber
        style={{ width: "100%" }}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          const allowedKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "Tab",
          ];
          // Bloqueia qualquer tecla que não seja número ou controle
          if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
            e.preventDefault();
          }
        }}
        formatter={(val) => {
          if (!val && val !== 0) return "";
          const onlyNumbers = String(val).replace(/\D/g, "");
          const formatted = onlyNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          return type === "area" ? `${formatted} m²` : `R$ ${formatted}`;
        }}
        parser={(val) => (val ? val.replace(/\D/g, "") : "")}
        className="!bg-transparent !border-[var(--primary)] !border-2 !text-[var(--primary)]"
      />
    </div>
  );
}