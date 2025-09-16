"use client";
import { FaBed, FaBath, FaFileAlt, FaPercent } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import HomeNavbar from "@/components/home/HomeNavbar";

export default function Agendamento() {
  return (
    <>
      <HomeNavbar />
      <main className="min-h-screen bg-white flex flex-col relative ">
        {/* Barra de progresso */}
        <div className="absolute top-0 w-full flex justify-between items-center px-12 py-6 gap-2">
          <div className="flex items-center gap-2 text-[#ffffff]">
            <IoIosCheckmarkCircle color="white" size={16} />
            <span className="font-bold text-white whitespace-nowrap">
              Sua Escolha
            </span>
          </div>
          <div className="w-full h-[2px] shadow bg-white" />
          <div className="flex items-center gap-2 text-[#4C62AE]">
            <IoIosCheckmarkCircle color="#4C62AE" size={16} />
            <span className="font-bold  whitespace-nowrap">Sua Escolha</span>
          </div>
          <div className="w-full h-[2px] shadow bg-white" />
          <div className="flex items-center gap-2 text-[#4C62AE]">
            <IoIosCheckmarkCircle color="#4C62AE" size={16} />
            <span className="font-bold">Finalizar</span>
          </div>
        </div>

        <div className="flex flex-1">
          {/* Lado esquerdo */}
          <div className="w-full md:w-[40%] bg-[#4C62AE] text-white p-8 flex flex-col gap-6">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
              alt="Casa"
              className="rounded-lg w-full h-48 object-cover"
            />

            <div>
              <h1 className="text-2xl font-bold">Casa Jardim das Flores</h1>
              <p className="mt-2 text-sm opacity-90">
                Encante-se com este lindo residência de 3 quartos, 2 banheiros e
                ampla sala de estar, perfeita para famílias que buscam conforto
                e praticidade. A cozinha planejada e a varanda com jardim
                proporcionam momentos únicos de lazer e convivência.
              </p>
              <p className="mt-3 text-sm">
                <span className="font-semibold">Localização:</span> Rua dos
                Acácias, 245
              </p>
              <p className="text-sm">
                <span className="font-semibold">Bairro:</span> Jardim
              </p>
              <p className="text-sm">
                <span className="font-semibold">Cidade:</span> Vale Encantado
              </p>
              <p className="text-sm">
                <span className="font-semibold">Estado:</span> São Florentino
              </p>
            </div>

            <div className="flex gap-6 mt-2 text-sm">
              <div className="flex items-center gap-2">
                <FaBed /> 3 Quartos
              </div>
              <div className="flex items-center gap-2">
                <FaBath /> 2 Banheiros
              </div>
            </div>

            <div className="bg-white text-[#4C62AE] rounded-lg py-4 px-6 mt-4">
              <p className="font-bold text-lg">Preço</p>
              <p className="text-2xl font-bold">R$ 600.000,00</p>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center gap-2">
                <FaFileAlt /> Quantidade de parcelas: valor
              </div>
              <div className="flex items-center gap-2">
                <FaPercent /> Taxa mensal: valor
              </div>
            </div>
          </div>

          {/* Lado direito */}
          <div className="flex-1 bg-white p-12">
            <h2 className="text-2xl font-bold text-[#4C62AE] mb-6">
              Insira seus dados
            </h2>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Nome</label>
                <input
                  type="text"
                  placeholder="Digite aqui"
                  className="border border-gray-300 rounded-lg p-3"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Sobrenome</label>
                <input
                  type="text"
                  placeholder="Digite aqui"
                  className="border border-gray-300 rounded-lg p-3"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Telefone</label>
                <input
                  type="tel"
                  placeholder="+55"
                  className="border border-gray-300 rounded-lg p-3"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">E-mail</label>
                <input
                  type="email"
                  placeholder="Digite aqui"
                  className="border border-gray-300 rounded-lg p-3"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Cidade</label>
                <input
                  type="text"
                  placeholder="Digite aqui"
                  className="border border-gray-300 rounded-lg p-3"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Estado</label>
                <input
                  type="text"
                  placeholder="Digite aqui"
                  className="border border-gray-300 rounded-lg p-3"
                />
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
