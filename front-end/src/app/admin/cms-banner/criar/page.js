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
import { useState, useEffect } from "react";
import { uploadBannerImage } from "@/services/netlifyUploadService";

export default function CriarBannerPage() {
  const [fileList, setFileList] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Garante que certas partes só rodem no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  const onFinish = async (values) => {
    try {
      let url_imagem = null;

      // Upload da imagem via Netlify se houver arquivo
      if (fileList.length > 0) {
        url_imagem = await uploadBannerImage(
          fileList[0].originFileObj,
          values.descricao,
          "1" // usuario_id
        );
      }

      // Enviar dados para o backend sem arquivo
      const bannerData = {
        descricao: values.descricao,
        usuario_id: 1,
        ativo: true,
        url_imagem
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/banner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bannerData),
      });

      if (res.ok) {
        alert("Banner criado com sucesso!");
        setFileList([]);
      } else {
        const data = await res.json();
        alert("Erro ao criar banner: " + (data.error || "Desconhecido"));
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar o formulário: " + error.message);
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

                  <UploadField
                    name="imagem"
                    label="Imagem do Banner"
                    multiple={false}
                    className="!w-fit"
                    fileList={fileList}
                    setFileList={setFileList}
                  />

                  {fileList.length > 0 ? (
                    <div className="sm:hidden w-[100%] h-80 bg-gray-200 rounded-3xl my-3.5 overflow-hidden">
                      <Image
                        src={URL.createObjectURL(fileList[0].originFileObj)}
                        alt="Prévia do banner"
                        width={400}
                        height={320}
                        className="h-full w-full object-cover rounded-3xl"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="sm:hidden h-80 w-[100%] bg-gray-200 rounded-3xl my-3.5 flex items-center justify-center">
                      <p className="text-gray-500">Selecione uma imagem</p>
                    </div>
                  )}
                </div>
                <TextAreaField
                  name="descricao"
                  label="Descrição"
                  placeholder="Corpo da descrição"
                  rows={18}
                  className="!w-full !h-full"
                />
                <FormButton
                  text="Publicar"
                  className="!hidden sm:!flex"
                  icon={<UploadOutlined />}
                />
              </div>

              <div className="sm:w-[40%] hidden sm:flex">
                <PreviaBanner fileList={fileList} />
              </div>

              <div className="sm:hidden w-full flex flex-col gap-3.5 items-center">
                <PreviaBanner fileList={fileList} />
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
