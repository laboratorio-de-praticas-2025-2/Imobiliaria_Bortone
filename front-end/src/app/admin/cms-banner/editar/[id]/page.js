"use client";
import { useParams } from "next/navigation";
import Form from "@/components/cms/form";
import FormButton from "@/components/cms/form/fields/Button";
import PreviaBanner from "@/components/cms/form/fields/PreviaBanner";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import TextField from "@/components/cms/form/fields/TextField";
import UploadField from "@/components/cms/form/fields/UploadField";
import Sidebar from "@/components/cms/Sidebar";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function EditarBannerPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [fileList, setFileList] = useState([]);
  const [banner, setBanner] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imageError, setImageError] = useState(false);

  // Função para gerar URL da imagem com fallback
  const getImageUrl = () => {
    if (imageError || !banner?.url_imagem) {
      return "/404.png";
    }
    
    let imageUrl = banner.url_imagem;
    if (!imageUrl.startsWith("/")) {
      imageUrl = `/images/bannerImages/${imageUrl}`;
    }
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV !== "production" ? "http://localhost:4000" : "");
    const apiUrl = rawApiUrl.replace(/\/api\/?$/, "");
    if (imageUrl.startsWith("/images/") && apiUrl) {
      return `${apiUrl}${imageUrl}`;
    }
    return imageUrl;
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV !== "production" ? "http://localhost:4000" : "");
        const apiUrl = rawApiUrl.replace(/\/api\/?$/, "");
        const response = await axios.get(`${apiUrl}/banner/${id}`);
        setBanner(response.data);
        setTitulo(response.data?.titulo || "");
        setDescricao(response.data?.descricao || "");
      } catch (error) {
        console.error("Erro ao carregar banner:", error);
      }
    };
    if (id) fetchBanner();
  }, [id]);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      if (values.titulo) formData.append("titulo", values.titulo);
      if (values.descricao) formData.append("descricao", values.descricao);
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("imagem", fileList[0].originFileObj);
      }

      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV !== "production" ? "http://localhost:4000" : "");
      const apiUrl = rawApiUrl.replace(/\/api\/?$/, "");

      const response = await axios.put(`${apiUrl}/banner/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        alert("Banner atualizado com sucesso!");
        router.push("/admin/cms-banner");
      }
    } catch (error) {
      console.error("Erro ao atualizar banner:", error);
      alert("Não foi possível atualizar o banner.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Edit Failed:", errorInfo);
  };

  if (!banner) return <div>Carregando...</div>;

  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <Form.Body title="Banners | Edição">
          <Form.FormHeader href="/admin/cms-banner" />
          <Form.FormBody
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
              titulo: banner.titulo,
              descricao: banner.descricao,
            }}
          >
            <div className="flex flex-col sm:flex-row w-full gap-6">
              {/* Coluna do Formulário */}
              <div className="sm:w-[60%] flex flex-col gap-3 items-end">
                <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-3">
                  <TextField
                    name="titulo"
                    label="Título do banner (opcional)"
                    placeholder="Título do banner"
                    className="!w-[100%]"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                  />
                  <UploadField
                    name="imagem"
                    label="Imagem do Banner"
                    multiple={false}
                    className="!w-fit"
                    fileList={fileList}
                    setFileList={setFileList}
                  />

                  {fileList.length > 0 ? (
                    <div className="sm:hidden w-[100%] h-80 bg-gray-200 rounded-3xl my-3.5">
                      <Image
                        src={URL.createObjectURL(fileList[0].originFileObj)}
                        alt="Prévia do banner"
                        width={400}
                        height={320}
                        className="h-full w-full object-cover rounded-3xl"
                      />
                    </div>
                  ) : (
                    <div className="sm:hidden w-[100%] h-80 bg-gray-200 rounded-3xl my-3.5">
                      <Image
                        src={getImageUrl()}
                        alt="Imagem atual"
                        width={400}
                        height={320}
                        className="h-full w-full object-cover rounded-3xl"
                        onError={() => {
                          setImageError(true);
                        }}
                      />
                    </div>
                  )}
                </div>
                <TextAreaField
                  name="descricao"
                  label="Descrição (opcional)"
                  placeholder="Descrição do banner"
                  rows={18}
                  className="!w-full !h-full"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
                <FormButton
                  text="Salvar Banner"
                  className="!hidden sm:!flex"
                  icon={<UploadOutlined />}
                />
              </div>

              <div className="sm:w-[40%] hidden sm:flex">
                <div className="w-full">
                  {fileList.length > 0 ? (
                    <Image
                      src={URL.createObjectURL(fileList[0].originFileObj)}
                      alt="Prévia do banner"
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-3xl"
                    />
                  ) : (
                    <Image
                      src={getImageUrl()}
                      alt="Imagem atual"
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-3xl"
                      onError={() => {
                        setImageError(true);
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="sm:hidden w-full flex flex-col gap-3.5 items-center">
                <div className="w-full">
                  {fileList.length > 0 ? (
                    <Image
                      src={URL.createObjectURL(fileList[0].originFileObj)}
                      alt="Prévia do banner"
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-3xl"
                    />
                  ) : (
                    <Image
                      src={getImageUrl()}
                      alt="Imagem atual"
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-3xl"
                      onError={() => {
                        setImageError(true);
                      }}
                    />
                  )}
                </div>
                <FormButton
                  text="Salvar Banner"
                  className="!flex !sm:hidden"
                  icon={<UploadOutlined />}
                />
              </div>
            </div>
          </Form.FormBody>
        </Form.Body>
      </div>
    </>
  );
}
