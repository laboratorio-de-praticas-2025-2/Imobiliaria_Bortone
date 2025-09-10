"use client";
import Form from "@/components/cms/form";
import { useState } from "react";
import RadioFieldImovel from "@/components/cms/form/fields/RadioFieldImovel";
import TextField from "@/components/cms/form/fields/TextField";
import FormButton from "@/components/cms/form/fields/Button";
import { MdPersonAdd } from "react-icons/md";
import Sidebar from "@/components/cms/Sidebar";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import DropdownField from "@/components/cms/form/fields/Dropdown";
import { Form as FormAntd } from "antd";
import UploadField from "@/components/cms/form/fields/UploadField";
import dynamic from "next/dynamic";

const MapPick = dynamic(() => import("@/components/cms/form/fields/MapPick"), {
  ssr: false,
});
export default function CriarImovelPage() {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
  const [fileList, setFileList] = useState([]);
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
          <Form.FormBody onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <div className="flex flex-col sm:flex-row w-full gap-6">
              {/* Coluna do Formulário */}
              <div className="sm:w-[50%] flex flex-col gap-6 items-start ">
                <div className=" flex flex-row gap-2 !w-full">
                  <FormAntd.Item
                    label={"Tipo"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
                    ]}
                    className={`custom-form-item !w-full`}
                    labelCol={{ span: 24 }}
                  >
                    <DropdownField
                      placeholder="Selecione o Tipo"
                      label="Tipo"
                      options={options}
                      selected={tipoSelecionado}
                      setSelected={setTipoSelecionado}
                      handleSelect={(option) => setTipoSelecionado(option)}
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
                      classname="bg-white hover:bg-[#EEF0F9] w-full "
                    />
                  </FormAntd.Item>
                </div>
                <UploadField
                  name="imagem"
                  label="Imagens"
                  multiple={false}
                  className="!w-fit"
                  fileList={fileList}
                  setFileList={setFileList}
                />
                <TextAreaField
                  name="descricao"
                  label="Descrição"
                  placeholder="Corpo da descrição"
                  rows={12}
                  className="!w-full !h-full"
                />
              </div>
              <div className="sm:w-[50%] flex flex-col gap-6 items-start ">
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
                      label="Cidade"
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
                <div className=" flex flex-row gap-2 !w-full">
                  <FormAntd.Item
                    label={"Imóvel Murado?"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
                    ]}
                    className={`custom-form-item !w-full`}
                    labelCol={{ span: 24 }}
                  >
                    <RadioFieldImovel
                      name="murado"
                      options={[
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" },
                      ]}
                      className="!w-fit"
                      classNameR="!custom-radio-group !p-3 border-1 rounded-full"
                      style={{
                        borderColor: "#374a8c",
                        color: "#374a8c",
                        fontWeight: "bold",
                      }}
                    />
                  </FormAntd.Item>

                  <FormAntd.Item
                    label={"Possui Piscina?"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
                    ]}
                    className={`custom-form-item !w-full`}
                    labelCol={{ span: 24 }}
                  >
                    <RadioFieldImovel
                      name="piscina"
                      options={[
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" },
                      ]}
                      className="!w-fit"
                      classNameR="!custom-radio-group !p-3  border-1 rounded-full"
                      style={{
                        borderColor: "#374a8c",
                        color: "#374a8c",
                        fontWeight: "bold",
                      }}
                    />
                  </FormAntd.Item>
                </div>
                <div className=" flex flex-row gap-2 !w-full">
                  <FormAntd.Item
                    label={"Possui Jardim?"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
                    ]}
                    className={`custom-form-item !w-full`}
                    labelCol={{ span: 24 }}
                  >
                    <RadioFieldImovel
                      name="jardim"
                      options={[
                        { label: "Sim", value: "sim" },
                        { label: "Não", value: "nao" },
                      ]}
                    />
                  </FormAntd.Item>

                  <FormAntd.Item
                    label={"Quartos"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
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
                      handleSelect={(option) => setSelectedBedrooms(option)}
                      width={"w-full"}
                      classname="bg-white hover:bg-[#EEF0F9]  w-full"
                    />
                  </FormAntd.Item>
                </div>
                <div className=" flex flex-row gap-2 !w-full">
                  <FormAntd.Item
                    label={"Vagas"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
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
                      handleSelect={(option) => setSelectedParking(option)}
                      width={"w-!full"}
                      classname="bg-white hover:bg-[#EEF0F9]  !w-full"
                    />
                  </FormAntd.Item>

                  <FormAntd.Item
                    label={"Banheiros"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
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
                      handleSelect={(option) => setSelectedBathrooms(option)}
                      width={"w-full"}
                      classname="bg-white hover:bg-[#EEF0F9] w-full "
                    />
                  </FormAntd.Item>
                </div>
                <div className=" flex flex-row gap-2 !w-full">
                  <TextField
                    name="area"
                    label="Área"
                    placeholder="Insira a área"
                    className="!w-full"
                  />
                  <TextField
                    name="preco"
                    label="Preço"
                    placeholder="Insira o preço"
                    className="!w-full"
                  />
                </div>
              </div>
              <div className="sm:w-[50%] flex flex-col gap-6 items-end ">
                <TextField
                  name="endereco"
                  label="Endereço"
                  placeholder="Digite o Endereço"
                  className="!w-full"
                />
                <div className=" flex flex-row gap-2 !w-full">
                  <TextField
                    name="latitude"
                    label="Latitude"
                    placeholder="Latitude"
                    className="!w-full"
                  />
                  <TextField
                    name="longitude"
                    label="Longitude"
                    placeholder="Longitude"
                    className="!w-full"
                  />
                </div>
                <div className=" h-[30vh] map-cms">
                  <MapPick
                  />
                </div>
                <FormButton text="Cadastrar" icon={<MdPersonAdd />} />
              </div>
            </div>
          </Form.FormBody>
        </Form.Body>
      </div>
    </>
  );
}
