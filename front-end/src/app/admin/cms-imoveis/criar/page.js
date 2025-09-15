"use client";
import Form from "@/components/cms/form";
import { useState } from "react";
import RadioFieldImovel from "@/components/cms/form/fields/RadioFieldImovel";
import TextField from "@/components/cms/form/fields/TextField";
import NumberField from "@/components/cms/form/fields/NumberField";
import FormButton from "@/components/cms/form/fields/Button";
import { LuHousePlus } from "react-icons/lu";
import Sidebar from "@/components/cms/Sidebar";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import DropdownField from "@/components/cms/form/fields/Dropdown";
import { Form as FormAntd } from "antd";
import UploadImovel from "@/components/cms/form/fields/UploadImovel";
import dynamic from "next/dynamic";

const MapPick = dynamic(() => import("@/components/cms/form/fields/MapPick"), {
  ssr: false,
});

export default function CriarImovelPage() {
  const [form] = FormAntd.useForm();

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  // adicione próximo aos useState (no topo do componente)
  const handleTipoSelect = (option) => {
    setTipoSelecionado(option);
    if (option && option.toLowerCase() === "terreno") {
      setSelectedBedrooms("Quantidade");
      setSelectedBathrooms("Quantidade");
      setSelectedParking("Quantidade");
      form.setFieldsValue({
        possui_jardim: undefined,
        possui_piscina: undefined,
        latitude: undefined,
        longitude: undefined,
      });
    }
  };

  const [tipoSelecionado, setTipoSelecionado] = useState("Selecione o Tipo");
  const [statusSelecionado, setstatusSelecionado] =
    useState("Selecione o status");
  const [citiesSelecionado, setCitiesSelecionado] =
    useState("Selecione a cidade");
  const [selectedState, setSelectedState] = useState("Selecione o estado");
  const [selectedParking, setSelectedParking] = useState("Quantidade");
  const [selectedBedrooms, setSelectedBedrooms] = useState("Quantidade");
  const [selectedBathrooms, setSelectedBathrooms] = useState("Quantidade");
  const states = [
    "Acre",
    "Alagoas",
    "Amapá",
    "Amazonas",
    "Bahia",
    "Ceará",
    "Distrito Federal",
    "Espírito Santo",
    "Goiás",
    "Maranhão",
    "Mato Grosso",
    "Mato Grosso do Sul",
    "Minas Gerais",
    "Pará",
    "Paraíba",
    "Paraná",
    "Pernambuco",
    "Piauí",
    "Rio de Janeiro",
    "Rio Grande do Norte",
    "Rio Grande do Sul",
    "Rondônia",
    "Roraima",
    "Santa Catarina",
    "São Paulo",
    "Sergipe",
    "Tocantins",
  ];
  const options = ["Casa", "Terreno"];
  const status = ["Disponivel", "Indisponivel", "Vendido", "Alugado"];
  const cities = [
    "Apiaí",
    "Barra do Chapéu",
    "Barra do Turvo",
    "Cajati",
    "Cananéia",
    "Capão Bonito",
    "Eldorado",
    "Guapiara",
    "Ibiúna",
    "Iporanga",
    "Itapeva",
    "Itariri",
    "Jacupiranga",
    "Juquiá",
    "Juquitiba",
    "Miracatu",
    "Pariquera-Açu",
    "Pedro de Toledo",
    "Registro",
    "Ribeira",
    "Ribeirão Branco",
    "Ribeirão Grande",
    "Sete Barras",
    "Tapiraí",
  ];
  const parkingSpots = ["1", "2", "3", "4", "5+"];
  const bedrooms = ["1", "2", "3", "4", "5+"];
  const bathrooms = ["1", "2", "3", "4", "5+"];

  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <Form.Body title="Imóveis | Cadastro">
          <Form.FormHeader href="/admin/cms-imoveis" />
          {/* passa a instância do form para o FormBody */}
          <Form.FormBody
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className=" flex flex-col sm:flex-row w-full gap-6">
              {/* Coluna do Formulário */}
              <div className="sm:w-[35%] flex flex-col gap-6 items-start ">
                <div className=" flex flex-row gap-2 !w-full">
                  <FormAntd.Item
                    label={"Tipo"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
                    ]}
                    className={`custom-form-item !w-full`}
                    labelCol={{ span: 24 }}
                  >
                    {/* substitua o DropdownField de "Tipo" pelo handler novo */}
                    <DropdownField
                      placeholder="Selecione o Tipo"
                      label="Tipo"
                      options={options}
                      selected={tipoSelecionado}
                      setSelected={setTipoSelecionado}
                      handleSelect={handleTipoSelect}
                      width={"w-full"}
                      classname="bg-white hover:bg-[#EEF0F9] w-full "
                    />
                  </FormAntd.Item>

                  <FormAntd.Item
                    label={"Status"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
                    ]}
                    className={`custom-form-item !w-full`}
                    labelCol={{ span: 24 }}
                  >
                    <DropdownField
                      placeholder="Selecione o status"
                      options={status}
                      selected={statusSelecionado}
                      setSelected={setstatusSelecionado}
                      handleSelect={(option) => setstatusSelecionado(option)}
                      width={"w-full"}
                      classname="bg-white hover:bg-[#EEF0F9] w-fit "
                    />
                  </FormAntd.Item>
                </div>
                <UploadImovel className={"!w-full"} />
                <TextAreaField
                  name="descricao"
                  label="Descrição"
                  placeholder="Corpo da descrição"
                  rows={7}
                  className="!w-full !h-full"
                />
              </div>
              <div className="sm:w-[30%] flex flex-col gap-6 items-start ">
                <div className=" flex flex-row gap-2 !w-full">
                  <FormAntd.Item
                    label={"Cidade"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
                    ]}
                    className={`custom-form-item !w-full`}
                    labelCol={{ span: 24 }}
                  >
                    <DropdownField
                      placeholder="Selecione a Cidade"
                      options={cities}
                      selected={citiesSelecionado}
                      setSelected={setCitiesSelecionado}
                      handleSelect={(option) => setCitiesSelecionado(option)}
                      width={"w-full"}
                      classname="bg-white hover:bg-[#EEF0F9] w-full "
                    />
                  </FormAntd.Item>

                  <FormAntd.Item
                    label={"Estado"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
                    ]}
                    className={`custom-form-item !w-full`}
                    labelCol={{ span: 24 }}
                  >
                    <DropdownField
                      placeholder="Selecione o Estado"
                      label="Estado"
                      options={states}
                      selected={selectedState}
                      setSelected={setSelectedState}
                      handleSelect={(option) => setSelectedState(option)}
                      width={"w-full"}
                      classname="bg-white hover:bg-[#EEF0F9] w-full "
                    />
                  </FormAntd.Item>
                </div>
                {/* linha com Muro (sempre visível) e Piscina (condicional) */}
                <div className=" flex flex-row gap-2 !w-full">
                  <FormAntd.Item
                    name="possui_muro"
                    label={"Imóvel Murado?"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
                    ]}
                    className={`custom-form-item !w-full`}
                    labelCol={{ span: 24 }}
                  >
                    <RadioFieldImovel
                      options={[
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" },
                      ]}
                    />
                  </FormAntd.Item>

                  {tipoSelecionado &&
                    tipoSelecionado.toLowerCase() !== "terreno" && (
                      <FormAntd.Item
                        label={"Possui Piscina?"}
                        name="possui_piscina"
                        rules={[
                          {
                            required: true,
                            message: "Este campo é obrigatório!",
                          },
                        ]}
                        className={`custom-form-item !w-full`}
                        labelCol={{ span: 24 }}
                      >
                        <RadioFieldImovel
                          options={[
                            { label: "Sim", value: "sim" },
                            { label: "Não", value: "nao" },
                          ]}
                        />
                      </FormAntd.Item>
                    )}
                </div>
                {tipoSelecionado &&
                  tipoSelecionado.toLowerCase() !== "terreno" && (
                    <>
                      <div className=" flex flex-row gap-2 !w-full">
                        <FormAntd.Item
                          label={"Possui Jardim?"}
                          name="possui_jardim"
                          rules={[
                            {
                              required: true,
                              message: "Este campo é obrigatório!",
                            },
                          ]}
                          className={`custom-form-item !w-full`}
                          labelCol={{ span: 24 }}
                        >
                          <RadioFieldImovel
                            options={[
                              { label: "Sim", value: "sim" },
                              { label: "Não", value: "nao" },
                            ]}
                          />
                        </FormAntd.Item>

                        <FormAntd.Item
                          label={"Quartos"}
                          rules={[
                            {
                              required: true,
                              message: "Este campo é obrigatório!",
                            },
                          ]}
                          className={`custom-form-item !w-full`}
                          labelCol={{ span: 24 }}
                        >
                          <DropdownField
                            placeholder="Quantidade"
                            label="Quartos"
                            options={bedrooms}
                            selected={selectedBedrooms}
                            setSelected={setSelectedBedrooms}
                            handleSelect={(option) =>
                              setSelectedBedrooms(option)
                            }
                            width={"w-full"}
                            classname="bg-white hover:bg-[#EEF0F9]  w-full"
                          />
                        </FormAntd.Item>
                      </div>

                      <div className=" flex flex-row gap-2 !w-full">
                        <FormAntd.Item
                          label={"Vagas"}
                          rules={[
                            {
                              required: true,
                              message: "Este campo é obrigatório!",
                            },
                          ]}
                          className={`custom-form-item !w-full `}
                          labelCol={{ span: 24 }}
                        >
                          <DropdownField
                            placeholder="Quantidade"
                            label="Vagas"
                            options={parkingSpots}
                            selected={selectedParking}
                            setSelected={setSelectedParking}
                            handleSelect={(option) =>
                              setSelectedParking(option)
                            }
                            width={"w-!full"}
                            classname="bg-white hover:bg-[#EEF0F9]  !w-full"
                          />
                        </FormAntd.Item>
                        <FormAntd.Item
                          label={"Banheiros"}
                          rules={[
                            {
                              required: true,
                              message: "Este campo é obrigatório!",
                            },
                          ]}
                          className={`custom-form-item !w-full `}
                          labelCol={{ span: 24 }}
                        >
                          <DropdownField
                            placeholder="Quantidade"
                            label="Banheiros"
                            options={bathrooms}
                            selected={selectedBathrooms}
                            setSelected={setSelectedBathrooms}
                            handleSelect={(option) =>
                              setSelectedBathrooms(option)
                            }
                            width={"w-full"}
                            classname="bg-white hover:bg-[#EEF0F9] w-full "
                          />
                        </FormAntd.Item>
                      </div>
                    </>
                  )}{" "}
                <div className=" flex flex-row gap-2 !w-full">
                  <NumberField
                    name="area"
                    label="Área"
                    placeholder="Insira a área"
                    className="!w-full"
                  />
                  <NumberField
                    name="preco"
                    label="Preço"
                    placeholder="Insira o preço"
                    className="!w-full"
                  />
                </div>
                {/* MOVA latitude/longitude para cá quando for Terreno */}
                {tipoSelecionado &&
                  tipoSelecionado.toLowerCase() === "terreno" && (
                    <>
                      <div className=" flex flex-row gap-2 !w-full">
                        <TextField
                          name="latitude"
                          label="Latitude"
                          placeholder="Latitude"
                          className="!w-full"
                          classInput="!bg-[#EEEEEE]"
                          readOnly
                        />
                      </div>
                      <div className=" flex flex-row gap-2 !w-full">
                        <TextField
                          name="longitude"
                          label="Longitude"
                          placeholder="Longitude"
                          className="!w-full"
                          classInput="!bg-[#EEEEEE]"
                          readOnly
                        />
                      </div>
                    </>
                  )}
              </div>
              <div className="sm:w-[35%] flex flex-col gap-6 items-end ">
                <TextField
                  name="endereco"
                  label="Endereço"
                  placeholder="Digite o Endereço"
                  className="!w-full"
                />
                {tipoSelecionado &&
                  tipoSelecionado.toLowerCase() != "terreno" && (
                    <div className=" flex flex-row gap-2 !w-full">
                      {/* inputs somente leitura; serão preenchidos pelo mapa */}

                      <TextField
                        name="latitude"
                        label="Latitude"
                        placeholder="Latitude"
                        className="!w-full"
                        classInput="!bg-[#EEEEEE]"
                        readOnly
                      />
                      <TextField
                        name="longitude"
                        label="Longitude"
                        classInput="!bg-[#EEEEEE]"
                        placeholder="Longitude"
                        className="!w-full !border-b-blue-50"
                        readOnly
                      />
                    </div>
                  )}
                <div className={`map-cms ${tipoSelecionado?.toLowerCase() === "terreno" ? "h-[38vh]" : "h-[30vh]"}`}>
                  {/* passa a instância do form para o MapPick */}
                  <MapPick form={form} />
                </div>
                <FormButton text="Cadastrar" icon={<LuHousePlus />} />
              </div>
            </div>
          </Form.FormBody>
        </Form.Body>
      </div>
    </>
  );
}
