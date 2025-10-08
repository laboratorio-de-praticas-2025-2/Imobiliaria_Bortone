"use client";
import Sidebar from "@/components/cms/Sidebar";
import Form from "@/components/cms/form";
import FormButton from "@/components/cms/form/fields/Button";
import DropdownField from "@/components/cms/form/fields/Dropdown";
import NumberField from "@/components/cms/form/fields/NumberField";
import RadioFieldImovel from "@/components/cms/form/fields/RadioFieldImovel";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import TextField from "@/components/cms/form/fields/TextField";
import UploadImovel from "@/components/cms/form/fields/UploadImovel";
import { Form as FormAntd } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";
import { LuHousePlus } from "react-icons/lu";
import axios from "axios";
import { useRouter } from "next/navigation";
import { uploadImovelImage } from "@/services/netlifyUploadService";
import { useFormSubmit } from "@/hooks/useAsyncOperation";

const MapPick = dynamic(() => import("@/components/cms/form/fields/MapPick"), {
  ssr: false,
});

export default function CriarImovelPage() {
  const [form] = FormAntd.useForm();
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const imovelData = {
        usuario_id: 1,
        tipo: tipoSelecionado,
        status: statusSelecionado.toLowerCase(),
        cidade: citiesSelecionado,
        estado: selectedState,
        endereco: values.endereco,
        mostrar_preco: values.mostrar_preco === "sim" ? true : false,
        area: values.area,
        preco: values.preco,
        descricao: values.descricao,
        possui_muro: values.possui_muro === "sim" ? true : false,
        latitude: values.latitude,
        longitude: values.longitude,
      };

      console.log(tipoSelecionado)

      let specificData = {};

      if (tipoSelecionado === "Casa") {
        specificData = {
          quartos: selectedBedrooms === "Quantidade" ? 0 : parseInt(selectedBedrooms),
          banheiros: selectedBathrooms === "Quantidade" ? 0 : parseInt(selectedBathrooms),
          vagas: selectedParking === "Quantidade" ? 0 : parseInt(selectedParking),
          possui_piscina: values.possui_piscina === "sim" ? true : false,
          possui_jardim: values.possui_jardim === "sim" ? true : false,
        };
      }

      const response = await apiClient.post('/imoveis', {
        ...imovelData,
        ...(tipoSelecionado === "Casa" ? specificData : {}),
        ...(tipoSelecionado === "Terreno" ? specificData : {}),
      });
      

      if (response.status === 201) {
        const imovelId = response.data.id;

        console.log("Arquivos selecionados:", fileList);

        for (const file of fileList) {
          try {
            // Upload via Netlify
            const imageUrl = await uploadImovelImage(
              file.originFileObj,
              imovelId,
              values.descricao || "Imagem do imóvel"
            );

            // Salvar referência da imagem no backend
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/imagemimovel`,
              {
                imovel_id: imovelId,
                url_imagem: imageUrl,
                descricao: values.descricao || "Imagem do imóvel"
              },
              { headers: { "Content-Type": "application/json" } }
            );
          } catch (uploadError) {
            console.error("Erro no upload da imagem:", uploadError);
            throw uploadError; // Re-throw para ser capturado no catch principal
          }
        }
        
        alert("Imóvel cadastrado com sucesso!");
        router.push("/admin/cms-imoveis");
      }
    } catch (error) {
      console.error("Erro ao cadastrar imóvel:", error);
      alert("Erro ao cadastrar imóvel. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  // adicione próximo aos useState (no topo do componente)
  const handleTipoSelect = (option) => {
    setTipoSelecionado(option);
    if (option && option === "Terreno") {
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

  const [tipoSelecionado, setTipoSelecionado] = useState("Tipo");
  const [statusSelecionado, setstatusSelecionado] =
    useState("Status");
  const [citiesSelecionado, setCitiesSelecionado] =
    useState("Cidade");
  const [selectedState, setSelectedState] = useState("Estado");
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

  // Verificação de segurança para evitar warning do useForm
  if (!form) return <div>Inicializando formulário...</div>;

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
                    className={`custom-form-item  required !w-full`}
                    labelCol={{ span: 24 }}
                  >
                    {/* substitua o DropdownField de "Tipo" pelo handler novo */}
                    <DropdownField
                      placeholder="Tipo"
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
                    className={`custom-form-item  required !w-full`}
                    labelCol={{ span: 24 }}
                  >
                    <DropdownField
                      placeholder="Status"
                      options={status}
                      selected={statusSelecionado}
                      setSelected={setstatusSelecionado}
                      handleSelect={(option) => setstatusSelecionado(option)}
                      width={"w-full"}
                      classname="bg-white hover:bg-[#EEF0F9] w-fit "
                    />
                  </FormAntd.Item>

                  <FormAntd.Item
                    name="mostrar_preco"
                    label={"Mostrar Preço?"}
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
                </div>
                <UploadImovel
                  className={"!w-full"}
                  fileList={fileList}
                  setFileList={setFileList}
                  multiple={true}
                />

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
                      placeholder="Cidade"
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
                      placeholder="Estado"
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

                  {tipoSelecionado && tipoSelecionado !== "Terreno" && (
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
                {tipoSelecionado && tipoSelecionado !== "Terreno" && (
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
                          handleSelect={(option) => setSelectedParking(option)}
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
                {tipoSelecionado && tipoSelecionado === "Terreno" && (
                  <>
                    <div className=" flex flex-row gap-2 !w-full">
                      <TextField
                        name="latitude"
                        label="Latitude"
                        placeholder="Latitude"
                        className="!w-full"
                      />
                    </div>
                    <div className=" flex flex-row gap-2 !w-full">
                      <TextField
                        name="longitude"
                        label="Longitude"
                        placeholder="Longitude"
                        className="!w-full"
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
                {tipoSelecionado && tipoSelecionado != "Terreno" && (
                  <div className=" flex flex-row gap-2 !w-full">
                    {/* inputs somente leitura; serão preenchidos pelo mapa */}

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
                      className="!w-full !border-b-blue-50"
                    />
                  </div>
                )}
                <div
                  className={`map-cms ${
                    tipoSelecionado === "Terreno" ? "h-[38vh]" : "h-[30vh]"
                  }`}
                >
                  {/* passa a instância do form para o MapPick */}
                  <MapPick form={form} />
                </div>
                <FormButton text="Cadastrar" icon={<LuHousePlus />} loading={isLoading} />
              </div>
            </div>
          </Form.FormBody>
        </Form.Body>
      </div>
    </>
  );
}
