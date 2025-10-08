"use client";
import { useParams } from "next/navigation";
import Form from "@/components/cms/form";
import FormButton from "@/components/cms/form/fields/Button";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import TextField from "@/components/cms/form/fields/TextField";
import UploadField from "@/components/cms/form/fields/UploadField";
import Sidebar from "@/components/cms/Sidebar";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { uploadBlogImage } from "@/services/netlifyUploadService";
import { Form as FormAntd } from "antd";
import { buildImageUrl } from "@/utils/imageUtils";
import SplashScreen from "@/components/SplashScreen";

export default function EditarPostPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [form] = FormAntd.useForm();
  const [fileList, setFileList] = useState([]);
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Função para gerar URL da imagem com fallback usando utilitário unificado
  const getImageUrl = () => {
    if (imageError) {
      return "/404.png";
    }
    return buildImageUrl(post?.url_imagem, 'publicacao', '/404.png');
  };

  // Usaremos caminhos relativos para imagens (sem hostname) para evitar exigência de domains no Next/Image

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV !== "production" ? "http://localhost:4000" : "");
        const apiUrl = rawApiUrl.replace(/\/api\/?$/, "");
        const response = await axios.get(`${apiUrl}/publicacoes/${id}`);
        setPost(response.data);
        setTitle(response.data?.titulo || "");
        setContent(response.data?.conteudo || "");
        
        // Preencher o formulário com os dados carregados
        form.setFieldsValue({
          titulo: response.data?.titulo || "",
          conteudo: response.data?.conteudo || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar publicação:", error);
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id, form]);

  const onFinish = async (values) => {
    try {
      let url_imagem = post?.url_imagem; // Manter imagem atual

      // Upload da nova imagem via Cloudinary se houver arquivo
      if (fileList.length > 0 && fileList[0].originFileObj) {
        url_imagem = await uploadBlogImage(
          fileList[0].originFileObj,
          values.titulo,
          values.conteudo,
          "1" // usuario_id
        );
        console.log('Nova imagem uploaded:', url_imagem);
      }

      // Enviar dados para o backend sem arquivo
      const blogData = {
        titulo: values.titulo,
        conteudo: values.conteudo,
        url_imagem
      };

      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV !== "production" ? "http://localhost:4000" : "");
      const apiUrl = rawApiUrl.replace(/\/api\/?$/, "");

      const response = await axios.put(`${apiUrl}/publicacoes/${id}`, blogData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        alert("Publicação atualizada com sucesso!");
        router.push("/admin/cms-publicacoes");
      }
    } catch (error) {
      console.error("Erro ao atualizar publicação:", error);
      alert("Não foi possível atualizar a publicação.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Edit Failed:", errorInfo);
  };

  if (loading) return <SplashScreen />;

  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <Form.Body title="Publicações | Edição">
          <Form.FormHeader href="/admin/cms-publicacoes" />
          <Form.FormBody
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className="flex flex-col sm:flex-row w-full gap-6">
              {/* Coluna do Formulário */}
              <div className="sm:w-[60%] flex flex-col gap-3 items-end">
                <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-3">
                  <TextField
                    name="titulo"
                    label="Título da matéria"
                    placeholder="Título da matéria"
                    className="!w-[100%]"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <UploadField
                    name="url_imagem"
                    label="Imagem de Capa"
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
                        onError={(e) => {
                          console.error('❌ Erro ao carregar imagem da publicação:', {
                            original: post?.url_imagem,
                            constructed: getImageUrl(),
                            error: e
                          });
                          setImageError(true);
                        }}
                        onLoad={() => {
                          console.log('✅ Imagem da publicação carregada com sucesso:', getImageUrl());
                        }}
                      />
                    </div>
                  )}
                </div>
                <TextAreaField
                  name="conteudo"
                  label="Corpo"
                  placeholder="Corpo da publicação"
                  rows={18}
                  className="!w-full !h-full"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <FormButton
                  text="Publicar"
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
                  text="Publicar"
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
