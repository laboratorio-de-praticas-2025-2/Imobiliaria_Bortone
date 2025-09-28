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

export default function EditarPostPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [fileList, setFileList] = useState([]);
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // Usaremos caminhos relativos para imagens (sem hostname) para evitar exigência de domains no Next/Image

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV !== "production" ? "http://localhost:4000" : "");
        const apiUrl = rawApiUrl.replace(/\/api\/?$/, "");
        const response = await axios.get(`${apiUrl}/publicacoes/${id}`);
        setPost(response.data);
        setTitle(response.data?.titulo || "");
        setContent(response.data?.conteudo || "");
      } catch (error) {
        console.error("Erro ao carregar publicação:", error);
      }
    };
    if (id) fetchPost();
  }, [id]);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      if (values.titulo) formData.append("titulo", values.titulo);
      if (values.conteudo) formData.append("conteudo", values.conteudo);
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("url_imagem", fileList[0].originFileObj);
      }

      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV !== "production" ? "http://localhost:4000" : "");
      const apiUrl = rawApiUrl.replace(/\/api\/?$/, "");

      const response = await axios.put(`${apiUrl}/publicacoes/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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

  if (!post) return <div>Carregando...</div>;

  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <Form.Body title="Publicações | Edição">
          <Form.FormHeader href="/admin/cms-publicacoes" />
          <Form.FormBody
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
              titulo: post.titulo,
              conteudo: post.conteudo,
            }}
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
                      {post?.url_imagem && (
                        <Image
                          src={(() => {
                            let imageUrl = post.url_imagem;
                            if (!imageUrl.startsWith("/")) {
                              imageUrl = `/images/blogImages/${imageUrl}`;
                            }
                            const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV !== "production" ? "http://localhost:4000" : "");
                            const apiUrl = rawApiUrl.replace(/\/api\/?$/, "");
                            if (imageUrl.startsWith("/images/") && apiUrl) {
                              return `${apiUrl}${imageUrl}`;
                            }
                            return imageUrl;
                          })()}
                          alt="Imagem atual"
                          width={400}
                          height={320}
                          className="h-full w-full object-cover rounded-3xl"
                          onError={(e) => {
                            e.target.src = "/404.png";
                          }}
                        />
                      )}
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
                  ) : post?.url_imagem ? (
                    <Image
                      src={(() => {
                        let imageUrl = post.url_imagem;
                        if (!imageUrl.startsWith("/")) {
                          imageUrl = `/images/blogImages/${imageUrl}`;
                        }
                        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV !== "production" ? "http://localhost:4000" : "");
                        const apiUrl = rawApiUrl.replace(/\/api\/?$/, "");
                        if (imageUrl.startsWith("/images/") && apiUrl) {
                          return `${apiUrl}${imageUrl}`;
                        }
                        return imageUrl;
                      })()}
                      alt="Imagem atual"
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-3xl"
                      onError={(e) => {
                        e.target.src = "/404.png";
                      }}
                    />
                  ) : (
                    <div className="w-full h-80 bg-gray-200 rounded-3xl" />
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
                  ) : post?.url_imagem ? (
                    <Image
                      src={(() => {
                        let imageUrl = post.url_imagem;
                        if (!imageUrl.startsWith("/")) {
                          imageUrl = `/images/blogImages/${imageUrl}`;
                        }
                        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV !== "production" ? "http://localhost:4000" : "");
                        const apiUrl = rawApiUrl.replace(/\/api\/?$/, "");
                        if (imageUrl.startsWith("/images/") && apiUrl) {
                          return `${apiUrl}${imageUrl}`;
                        }
                        return imageUrl;
                      })()}
                      alt="Imagem atual"
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-3xl"
                      onError={(e) => {
                        e.target.src = "/404.png";
                      }}
                    />
                  ) : (
                    <div className="w-full h-80 bg-gray-200 rounded-3xl" />
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
