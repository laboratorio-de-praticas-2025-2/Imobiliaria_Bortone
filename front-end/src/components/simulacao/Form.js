"use client";
import Slider from "./SliderSimu";
import { Button, ConfigProvider } from "antd";

export default function Form() {
  return (
    <div className=" justify-self-center lg:pb-10">
      <div className=" md:w-110 lg:h-85 bg-white p-7 md:p-10 rounded-3xl  relative z-20 text-center">
        <h3 className="text-[var(--primary)] form !font-bold text-[24px] mb-2">
          Chegou a hora de você
          <p>
            <span className="pr-1">comprar o seu</span>
            <span className="bg-[var(--primary)] text-white decoration-2 p-1 uppercase">
              IMÓVEL
            </span>
          </p>
        </h3>

        <p className="text-[var(--primary)] text-[16px] mb-4">
          Escolha o valor desejado:
        </p>

        <div className="mb-4 pt-2">
          <input
            type="text"
            placeholder="R$"
            className="w-[35%] border border-gray-200 rounded px-3 py-2 focus:outline-none text-ledt"
          />
        </div>

        <div className="mb-4">
          <Slider />
        </div>

        <Button className="w-full !bg-[var(--secondary)] !text-white !h-10 rounded-lg ">
           <span className=" font-bold">Simular Agora</span>
        </Button>
      </div>
    </div>
  );
}
