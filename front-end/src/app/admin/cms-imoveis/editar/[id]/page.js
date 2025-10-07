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

        // Fetch images for the imovel
        const imagesResponse = await axios.get(`${apiUrl}/imagemimovel/imovel/${id}`);
        const imagesData = imagesResponse.data;

        // Process and set the fileList with improved error handling
        console.log('DEBUG EDITAR: imagesData from API:', imagesData);
        console.log('DEBUG EDITAR: apiUrl:', apiUrl);
        
        if (!Array.isArray(imagesData)) {
          console.warn('DEBUG EDITAR: imagesData não é array:', imagesData);
          setFileList([]);
          setOriginalImages([]);
          return;
        }
        
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
              console.log(`DEBUG EDITAR: URL já completa: ${cleanImageUrl}`);
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
            
            // Garantir que a URL relativa esteja correta
            if (!cleanImageUrl.startsWith('/')) {
              cleanImageUrl = `/${cleanImageUrl}`;
            }
            
            const fullUrl = `${cleanApiUrl}${cleanImageUrl}`;
            
            console.log('DEBUG EDITAR: Construindo URL:');
            console.log('  - Image original:', image.url_imagem);
            console.log('  - API URL limpa:', cleanApiUrl);
            console.log('  - Image URL limpa:', cleanImageUrl);
            console.log('  - URL final:', fullUrl);
            
            return {
              uid: `image-${image.id}-${index}`, // Unique identifier mais robusto
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
        }).filter(Boolean); // Remove entradas nulas
        
        console.log('DEBUG EDITAR: formattedImages processadas:', formattedImages);
        setFileList(formattedImages);
        setOriginalImages(imagesData);

        // preencher seleções locais (para os DropdownField customizados)
        setTipoSelecionado(found.tipo ?? "Tipo");
        setStatusSelecionado(found.status ?? "Status");
        setCitiesSelecionado(found.cidade ?? "Cidade");
        setSelectedState(found.estado ?? "Estado");
        setSelectedBedrooms(found.casa.quartos ? String(found.casa.quartos) : "Quantidade");

        setSelectedBathrooms(
          found.casa.banheiros ? String(found.casa.banheiros) : "Quantidade"
        );
        setSelectedParking(found.casa.vagas ? String(found.casa.vagas) : "Quantidade");

        // setar valores do form Antd
        form.setFieldsValue({
          tipo: found.tipo ?? undefined,
          status: found.status ?? undefined,
          cidade: found.cidade ?? undefined,
          estado: found.estado ?? undefined,
          descricao: found.descricao ?? undefined,
          mostrar_preco: found.mostrar_preco ? "sim" : "nao",
          area: found.area ?? undefined,
          preco: found.preco ?? undefined,
          endereco: found.endereco ?? undefined,
          quartos: found.casa.quartos ?? undefined,
          banheiros: found.casa.banheiros ?? undefined,
          vagas: found.casa.vagas ?? undefined,
          possui_muro: found.murado ? "sim" : "nao",
          possui_piscina: found.casa.possui_piscina ? "sim" : "nao",
          possui_jardim: found.casa.possui_jardim ? "sim" : "nao",
          latitude: found.latitude ?? undefined,
          longitude: found.longitude ?? undefined,
          // imagens: found.imagens ?? [], // se UploadImovel aceitar
          // latitude, longitude nulos no mock
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
      // Obter IDs das imagens originais
      const originalImageIds = originalImages.map(img => img.id);
      
      // Obter IDs das imagens atuais (apenas as originais que ainda estão presentes)
      const currentOriginalIds = fileList
        .filter(file => file.isOriginal)
        .map(file => file.originalId);
      
      // Encontrar imagens que foram removidas
      const imagesToDelete = originalImageIds.filter(id => !currentOriginalIds.includes(id));
      
      // Encontrar imagens que foram adicionadas (não são originais)
      const newImages = fileList.filter(file => !file.isOriginal && file.originFileObj);
      
      // Deletar imagens removidas
      for (const imageId of imagesToDelete) {
        try {
          await axios.delete(`${apiUrl}/imagemimovel/${imageId}`);
          console.log(`Imagem ${imageId} deletada com sucesso`);
        } catch (error) {
          console.error(`Erro ao deletar imagem ${imageId}:`, error);
        }
      }
      
      // Fazer upload de novas imagens
      for (const newImage of newImages) {
        try {
        // Upload via Netlify
        const imageUrl = await uploadImovelImage(
          newImage.originFileObj,
          id,
          newImage.name || 'Imagem do imóvel'
        );

        // Salvar referência da imagem no backend
        const response = await axios.post(`${apiUrl}/imagemimovel`, {
          imovel_id: id,
          url_imagem: imageUrl,
          descricao: newImage.name || 'Imagem do imóvel'
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });          // The API should return the filename (not full URL) for database storage
          console.log(`Imagem ${newImage.name} enviada com sucesso. Filename: ${response.data.url_imagem}`);
        } catch (error) {
          console.error(`Erro ao fazer upload da imagem ${newImage.name}:`, error);
        }
      }
      
      console.log('Gerenciamento de imagens concluído');
    } catch (error) {
      console.error('Erro no gerenciamento de imagens:', error);
    }
  };

  const onConfirm = async () => {
    try {
      // Atualizar dados do imóvel
      const updateData = {
        ...formValues,
        tipo: tipoSelecionado !== "Tipo" ? tipoSelecionado : undefined,
        status: statusSelecionado !== "Status" ? statusSelecionado : undefined,
        cidade: citiesSelecionado !== "Cidade" ? citiesSelecionado : undefined,
        estado: selectedState !== "Estado" ? selectedState : undefined,
        quartos: selectedBedrooms !== "Quantidade" ? parseInt(selectedBedrooms) : undefined,
        banheiros: selectedBathrooms !== "Quantidade" ? parseInt(selectedBathrooms) : undefined,
        vagas: selectedParking !== "Quantidade" ? parseInt(selectedParking) : undefined,
        murado: formValues.possui_muro === "sim",
        possui_piscina: formValues.possui_piscina === "sim",
        possui_jardim: formValues.possui_jardim === "sim",
        // Manter o usuario_id original do imóvel
        usuario_id: imovel.usuario_id,
      };

      console.log('Dados sendo enviados para atualização:', updateData);
      console.log('usuario_id do imóvel original:', imovel.usuario_id);
      
      await axios.put(`${apiUrl}/imoveis/${id}`, updateData);
      
      // Gerenciar imagens
      await handleImageChanges();
      
      console.log("Imóvel atualizado com sucesso!");
      setIsConfirmModalVisible(false);
      window.location.href = "/admin/cms-imoveis";
    } catch (error) {
      console.error("Erro ao atualizar imóvel:", error);
      // Aqui você pode adicionar uma notificação de erro para o usuário
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (imovel === null) return <div>Imóvel não encontrado.</div>;
  if (!form) return <div>Inicializando formulário...</div>;

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

                {/* Se o UploadImovel suportar inicialização por prop, poderia receber imovel.imagens.
                    Aqui apenas renderiza o componente; ajuste conforme sua implementação do UploadImovel. */}
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
                <FormButton text="Salvar Alterações" />
              </div>
            </div>
          </Form.FormBody>
        </Form.Body>
      </div>
    </>
  );
}
