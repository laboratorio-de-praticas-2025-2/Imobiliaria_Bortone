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
import SplashScreen from "@/components/SplashScreen";
import { Form as FormAntd } from "antd";
import dynamic from "next/dynamic";
import { useEffect, useState, use } from "react";
import axios from "axios";
import { uploadImovelImage, deleteFromNetlify } from "@/services/netlifyUploadService";

const MapPick = dynamic(() => import("@/components/cms/form/fields/MapPick"), {
  ssr: false,
});

export default function EditarImovelPage({ params }) {
  const { id } = use(params);
  const [form] = FormAntd.useForm();
  const [formReady, setFormReady] = useState(false);
  const [imovel, setImovel] = useState(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [originalImages, setOriginalImages] = useState([]);

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
  const status = ["Disponível", "Indisponível", "Vendido", "Locado"];
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
    const fetchImovel = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/imoveis/${id}`);
        const found = response.data;

        if (!found) {
          setImovel(null);
          setLoading(false);
          return;
        }
        setImovel(found);


        try {
          const imagesResponse = await axios.get(`${apiUrl}/imagemimovel/imovel/${id}`);
          const imagesData = imagesResponse.data;

          
          
          if (!Array.isArray(imagesData)) {
            console.warn('DEBUG EDITAR: imagesData não é array:', imagesData);
            setFileList([]);
            setOriginalImages([]);
          } else {
            
            const formattedImages = imagesData.map((image, index) => {
              try {
                // Validação básica do objeto imagem
                if (!image || !image.url_imagem) {
                  console.warn(`DEBUG EDITAR: Imagem inválida no índice ${index}:`, image);
                  return null;
                }
                
                // Construir URL completa da imagem
                const cleanApiUrl = apiUrl?.replace(/\/+$/, '') || '';
                let cleanImageUrl = image.url_imagem;
                
                // Se já é uma URL completa, use como está
                if (cleanImageUrl.startsWith('http://') || cleanImageUrl.startsWith('https://')) {
                  
                  return {
                    uid: `image-${image.id}-${index}`,
                    name: cleanImageUrl.split('/').pop() || `image-${image.id}`,
                    status: 'done',
                    url: cleanImageUrl,
                    originalId: image.id,
                    isOriginal: true,
                    filename: image.url_imagem
                  };
                }
                
                if (!cleanImageUrl.startsWith('/')) {
                  cleanImageUrl = `/${cleanImageUrl}`;
                }
                
                const fullUrl = `${cleanApiUrl}${cleanImageUrl}`;
                
                
                return {
                  uid: `image-${image.id}-${index}`,
                  name: image.url_imagem.split('/').pop() || `image-${image.id}`,
                  status: 'done',
                  url: fullUrl,
                  originalId: image.id,
                  isOriginal: true,
                  filename: image.url_imagem
                };
              } catch (error) {
                console.error(`DEBUG EDITAR: Erro ao processar imagem ${index}:`, error, image);
                return null;
              }
            }).filter(Boolean); 
            
            // console.log('DEBUG EDITAR: formattedImages processadas:', formattedImages);
            setFileList(formattedImages);
            setOriginalImages(imagesData);
          }
        } catch (imageError) {
          console.warn('DEBUG EDITAR: Erro ao buscar imagens (pode ser normal se não houver imagens):', imageError);
          setFileList([]);
          setOriginalImages([]);
        }

        setTipoSelecionado(found.tipo ?? "Selecione o Tipo");
        setStatusSelecionado(found.status ?? "Selecione o status");
        setCitiesSelecionado(found.cidade ?? "Selecione a cidade");
        setSelectedState(found.estado ?? "Selecione o estado");
        
        if (found.casa && found.tipo && found.tipo.toLowerCase() !== "terreno") {
          const formatValue = (value) => {
            if (value >= 5) return "5+";
            return String(value);
          };
          
          setSelectedBedrooms(found.casa.quartos ? formatValue(found.casa.quartos) : "Quantidade");
          setSelectedBathrooms(
            found.casa.banheiros ? formatValue(found.casa.banheiros) : "Quantidade"
          );
          setSelectedParking(found.casa.vagas ? formatValue(found.casa.vagas) : "Quantidade");
        } else {
          
          setSelectedBedrooms("Quantidade");
          setSelectedBathrooms("Quantidade");
          setSelectedParking("Quantidade");
        }

        
        form.setFieldsValue({
          tipo: found.tipo ?? undefined,
          status: found.status ?? undefined,
          cidade: found.cidade ?? undefined, 
          estado: found.estado ?? undefined,
          descricao: found.descricao ?? undefined,
          mostrar_preco: found.visibilidade_preco ? "sim" : "nao",
          area: found.area ?? undefined,
          preco: found.preco ?? undefined,
          endereco: found.endereco ?? undefined,
          quartos: found.casa?.quartos ?? undefined,
          banheiros: found.casa?.banheiros ?? undefined,
          vagas: found.casa?.vagas ?? undefined,
          possui_muro: found.murado ? "sim" : "nao",
          possui_piscina: found.casa?.possui_piscina ? "sim" : "nao",
          possui_jardim: found.casa?.possui_jardim ? "sim" : "nao",
          latitude: found.latitude ?? undefined,
          longitude: found.longitude ?? undefined,
          
        });
      } catch (error) {
        console.error("Erro ao carregar imóvel:", error);
        setImovel(null);
      } finally {
        setLoading(false);
      }
    };
    fetchImovel();
  }, [id, form, apiUrl]);

  const onFinish = (values) => {
    setFormValues(values);
    setIsConfirmModalVisible(true);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleImageChanges = async () => {
    try {
      const originalImageIds = Array.isArray(originalImages) ? originalImages.map(img => img.id) : [];
      
      const currentOriginalIds = fileList
        .filter(file => file.isOriginal)
        .map(file => file.originalId);
      
      const imagesToDelete = originalImageIds.filter(id => !currentOriginalIds.includes(id));
      
      const newImages = fileList.filter(file => !file.isOriginal && file.originFileObj);
      
      for (const imageId of imagesToDelete) {
        try {
          await axios.delete(`${apiUrl}/imagemimovel/${imageId}`);
          // console.log(`Imagem ${imageId} deletada com sucesso`);
        } catch (error) {
          // console.error(`Erro ao deletar imagem ${imageId}:`, error);
        }
      }
      
      for (const newImage of newImages) {
        try {
        const imageUrl = await uploadImovelImage(
          newImage.originFileObj,
          id,
          newImage.name || 'Imagem do imóvel'
        );

        const response = await axios.post(`${apiUrl}/imagemimovel`, {
          imovel_id: id,
          url_imagem: imageUrl,
          descricao: newImage.name || 'Imagem do imóvel'
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });          
          // console.log(`Imagem ${newImage.name} enviada com sucesso. Filename: ${response.data.url_imagem}`);
        } catch (error) {
          console.error(`Erro ao fazer upload da imagem ${newImage.name}:`, error);
        }
      }
      
    } catch (error) {
      console.error('Erro no gerenciamento de imagens:', error);
    }
  };

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const onConfirm = async () => {
    try {

    const normalizedStatus = statusSelecionado !== "Selecione o status" 
      ? normalizeText(statusSelecionado)
      : undefined;

      const updateData = {
        ...formValues,
        
        tipo: tipoSelecionado !== "Selecione o Tipo" ? tipoSelecionado : undefined,
        status: normalizedStatus,
        cidade: citiesSelecionado !== "Selecione a cidade" ? citiesSelecionado : undefined,
        estado: selectedState !== "Selecione o estado" ? selectedState : undefined,

        quartos: selectedBedrooms !== "Quantidade" ? parseInt(selectedBedrooms) : undefined,
        visibilidade_preco: formValues.mostrar_preco === "sim" ? 1 : 0,
        banheiros: selectedBathrooms !== "Quantidade" ? parseInt(selectedBathrooms) : undefined,
        vagas: selectedParking !== "Quantidade" ? parseInt(selectedParking) : undefined,
        murado: formValues.possui_muro === "sim",
        possui_piscina: formValues.possui_piscina === "sim",
        possui_jardim: formValues.possui_jardim === "sim",
        usuario_id: imovel.usuario_id,
      };

      
      
      setLoading(true);
      await axios.put(`${apiUrl}/imoveis/${id}`, updateData);
      
      await handleImageChanges();
      
      // console.log("Imóvel atualizado com sucesso!");
      setIsConfirmModalVisible(false);
      window.location.href = "/admin/cms-imoveis";
    } catch (error) {
      console.error("Erro ao atualizar imóvel:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !form) return <SplashScreen /> ;

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
            initialValues={{}} 
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
                      placeholder="Tipo"
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
                      placeholder="Status"
                      options={status}
                      selected={statusSelecionado}
                      setSelected={setStatusSelecionado}
                      handleSelect={(option) => setStatusSelecionado(option)}
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

                
                <UploadImovel className={"!w-full"} fileList={fileList} setFileList={setFileList} />

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
                {tipoSelecionado &&
                  tipoSelecionado.toLowerCase() != "terreno" && (
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
                    tipoSelecionado?.toLowerCase() === "terreno"
                      ? "h-[38vh]"
                      : "h-[30vh]"
                  }`}
                >
                  {/* passa a instância do form para o MapPick */}
                  <MapPick form={form} />
                </div>
                <FormButton text="Salvar Alterações" disabled={loading || isConfirmModalVisible} />
              </div>
            </div>
          </Form.FormBody>
        </Form.Body>
      </div>
    </>
  );
}
