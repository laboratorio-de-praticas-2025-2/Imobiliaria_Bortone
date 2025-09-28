"use client";
import Form from "@/components/cms/form";
import PreviaBanner from "@/components/cms/form/fields/PreviaBanner";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import TextField from "@/components/cms/form/fields/TextField";
import UploadField from "@/components/cms/form/fields/UploadField";
import { UploadOutlined } from "@ant-design/icons";
import FormButton from "@/components/cms/form/fields/Button";
import Image from "next/image";
import Sidebar from "@/components/cms/Sidebar";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CriarBannerPage() {
  const [fileList, setFileList] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const router = useRouter();

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      
      if (values.titulo) {
        formData.append("titulo", values.titulo);
      }
      if (values.descricao) {
        formData.append("descricao", values.descricao);
      }
      formData.append("usuario_id", "1");
      formData.append("ativo", "true");

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("imagem", fileList[0].originFileObj);
      } else {
        alert("Por favor, selecione uma imagem para o banner!");
        return;
      }

      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV !== "production" ? "http://localhost:4000" : "");
      const apiUrl = rawApiUrl.replace(/\/api\/?$/, "");

      const response = await axios.post(`${apiUrl}/banner`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        alert("Banner criado com sucesso!");
        router.push("/admin/cms-banner");
      }
    } catch (error) {
      console.error("Erro ao criar banner:", error);
      alert("Não foi possível criar o banner.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <Form.Body title="Banners | Cadastro">
          <Form.FormHeader href="/admin/cms-banner" />
          <Form.FormBody onFinish={onFinish} onFinishFailed={onFinishFailed}>
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
                    <div className="sm:hidden h-80 w-[100%] bg-gray-200 rounded-3xl my-3.5" />
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
                  text="Criar Banner"
                  className="!hidden sm:!flex"
                  icon={<UploadOutlined />}
                />
              </div>

              <div className="sm:w-[40%] hidden sm:flex">
                <PreviaBanner 
                  fileList={fileList} 
                  titulo={titulo}
                  descricao={descricao}
                />
              </div>

              <div className="sm:hidden w-full flex flex-col gap-3.5 items-center">
                <PreviaBanner 
                  fileList={fileList} 
                  titulo={titulo}
                  descricao={descricao}
                />
                <FormButton
                  text="Criar Banner"
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
