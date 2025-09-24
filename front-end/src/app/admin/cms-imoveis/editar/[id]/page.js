"use client";
import ConfirmModal from "@/components/cms/ConfirmModal";
import Form from "@/components/cms/form";
import FormButton from "@/components/cms/form/fields/Button";
import DropdownField from "@/components/cms/form/fields/Dropdown";
import RadioFieldImovel from "@/components/cms/form/fields/RadioFieldImovel";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import TextField from "@/components/cms/form/fields/TextField";
import UploadImovel from "@/components/cms/form/fields/UploadImovel";
import Sidebar from "@/components/cms/Sidebar";
import { mockImoveis } from "@/mock/imoveis";
import { Form as FormAntd } from "antd";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MapPick = dynamic(() => import("@/components/cms/form/fields/MapPick"), {
  ssr: false,
});

export default function EditarImovelPage({ params }) {
  const id = params?.id;
  const [form] = FormAntd.useForm();
  const [imovel, setImovel] = useState(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [formValues, setFormValues] = useState(null);

  // estados / seleções (usados pelos DropdownField do layout)
  const [tipoSelecionado, setTipoSelecionado] = useState("Selecione o Tipo");
  const [statusSelecionado, setStatusSelecionado] =
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
  const status = ["Disponível", "Indisponível", "Vendido", "Alugado"];
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

  useEffect(() => {
    const found = mockImoveis.find((m) => String(m.id) === String(id));
    if (!found) {
      setImovel(null);
      return;
    }
    setImovel(found);

    // preencher seleções locais (para os DropdownField customizados)
    setTipoSelecionado(found.tipo ?? "Selecione o Tipo");
    setStatusSelecionado(found.status ?? "Selecione o status");
    setCitiesSelecionado(found.cidade ?? "Selecione a cidade");
    setSelectedState(found.estado ?? "Selecione o estado");
    setSelectedBedrooms(found.quartos ? String(found.quartos) : "Quantidade");

    setSelectedBathrooms(
      found.banheiros ? String(found.banheiros) : "Quantidade"
    );
    setSelectedParking(found.vagas ? String(found.vagas) : "Quantidade");

    // setar valores do form Antd
    form.setFieldsValue({
      tipo: found.tipo ?? undefined,
      status: found.status ?? undefined,
      cidade: found.cidade ?? undefined,
      estado: found.estado ?? undefined,
      descricao: found.descricao ?? undefined,
      area: found.area ?? undefined,
      preco: found.preco ?? undefined,
      endereco: found.endereco ?? undefined,
      quartos: found.quartos ?? undefined,
      banheiros: found.banheiros ?? undefined,
      vagas: found.vagas ?? undefined,
      possui_muro: found.possui_muro ? "sim" : "nao",
      possui_piscina: found.possui_piscina ? "sim" : "nao",
      possui_jardim: found.possui_jardim ? "sim" : "nao",
      // imagens: found.imagens ?? [], // se UploadImovel aceitar
      // latitude, longitude nulos no mock
    });
  }, [id, form]);

  const onFinish = (values) => {
    setFormValues(values);
    setIsConfirmModalVisible(true);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onConfirm = () => {
    console.log("Edit Imóvel:", { id, ...formValues });
    setIsConfirmModalVisible(false);
    window.location.href = "/admin/cms-imoveis";
  };

  if (imovel === null) return <div>Carregando...</div>;

  return (
    <>
      {isConfirmModalVisible && (
        <ConfirmModal
          message="Você tem certeza que deseja alterar o registro definitivamente?"
          onConfirm={onConfirm}
          onCancel={() => setIsConfirmModalVisible(false)}
        />
      )}
      <Sidebar />
      <div className="md:ml-20">
        <Form.Body title="Imóveis | Edição">
          <Form.FormHeader href="/admin/cms-imoveis" />
          <Form.FormBody
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{}} // usamos form.setFieldsValue quando carregado
          >
            <div className=" flex flex-col sm:flex-row w-full gap-6">
              <div className="sm:w-[35%] flex flex-col gap-6 items-start ">
                <div className=" flex flex-row gap-2 !w-full">
                  <FormAntd.Item
                    label={"Tipo"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
                    ]}
                    className={`custom-form-item  required !w-full`}
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
                    className={`custom-form-item  required !w-full`}
                    labelCol={{ span: 24 }}
                  >
                    <DropdownField
                      placeholder="Selecione o status"
                      options={status}
                      selected={statusSelecionado}
                      setSelected={setStatusSelecionado}
                      handleSelect={(option) => setStatusSelecionado(option)}
                      width={"w-full"}
                      classname="bg-white hover:bg-[#EEF0F9] w-fit "
                    />
                  </FormAntd.Item>
                </div>

                {/* Se o UploadImovel suportar inicialização por prop, poderia receber imovel.imagens.
                    Aqui apenas renderiza o componente; ajuste conforme sua implementação do UploadImovel. */}
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
                    className={`custom-form-item  required !w-full`}
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
                    className={`custom-form-item  required !w-full`}
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
                    name="possui_muro"
                    label={"Imóvel Murado?"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
                    ]}
                    className={`custom-form-item  required !w-full`}
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
                        className={`custom-form-item  required !w-full`}
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
                          className={`custom-form-item  required !w-full`}
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
                          className={`custom-form-item  required !w-full`}
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
                          className={`custom-form-item  required !w-full `}
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
                          className={`custom-form-item  required !w-full `}
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
                <div
                  className={`map-cms ${
                    tipoSelecionado?.toLowerCase() === "terreno"
                      ? "h-[38vh]"
                      : "h-[30vh]"
                  }`}
                >
                  {/* passa a instância do form para o MapPick */}
                  <MapPick form={form} />
                </div>
                <FormButton text="Salvar Alterações" />
              </div>
            </div>
          </Form.FormBody>
        </Form.Body>
      </div>
    </>
  );
}
