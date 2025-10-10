"use client";
import { useState } from "react";
import Form from "@/components/cms/form";
import FormButton from "@/components/cms/form/fields/Button";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import TextField from "@/components/cms/form/fields/TextField";
import UploadField from "@/components/cms/form/fields/UploadField";
import Sidebar from "@/components/cms/Sidebar";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { uploadPublicidadeImage } from "@/services/netlifyUploadService";
import { useFormSubmit } from "@/hooks/useAsyncOperation";
import { apiClient } from "@/utils/apiClient";
import { useAuth } from "@/hooks/useAuth";

export default function CriarPublicidadePage() {
  const [fileList, setFileList] = useState([]);
  const router = useRouter();
  const { submitForm, isLoading } = useFormSubmit();
  const { user } = useAuth();

  const onFinish = async (values) => {
    await submitForm(
      values,
      async (validatedValues) => {
        let url_imagem = null;

        // Upload da imagem via Netlify se houver arquivo
        if (fileList.length > 0 && fileList[0].originFileObj) {
          url_imagem = await uploadPublicidadeImage(
            fileList[0].originFileObj,
            validatedValues.titulo,
            validatedValues.conteudo,
            user?.id?.toString() || "1", // usuario_id do usuário logado
            true // ativo
          );
        }

        // Enviar dados para o backend sem arquivo
        const publicidadeData = {
          titulo: validatedValues.titulo,
          conteudo: validatedValues.conteudo,
          usuario_id: user?.id || 1,
          ativo: true,
          url_imagem
        };

        const response = await apiClient.post("/publicidade", publicidadeData);
        
        if (response.status === 201) {
          router.push("/admin/cms-publicidades");
          return response.data;
        }
      },
      {
        requiredFields: ['titulo', 'conteudo'],
        successMessage: "Publicidade cadastrada com sucesso!",
        onSuccess: () => {
          router.push("/admin/cms-publicidades");
        }
      }
    );
  };

  const onFinishFailed = (errorInfo) => {
    // Handle form validation errors if needed
  };



  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <Form.Body title="Publicidades | Cadastro">
          <Form.FormHeader href="/admin/cms-publicidades" />
          <Form.FormBody onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <div className="flex flex-col w-full gap-2 ">
              <p className="!text-[#0d1b3e] !font-semibold text-[16px]">
                Prévia *
              </p>
              {fileList.length > 0 ? (
                <div className="w-[100%] md:h-[25vh] h-[13vh] bg-gray-200 rounded-3xl ">
                  <Image
                    src={URL.createObjectURL(fileList[0].originFileObj)}
                    alt="Prévia da publicidade"
                    width={400}
                    height={320}
                    className="h-full w-full object-cover rounded-3xl"
                  />
                </div>
              ) : (
                <div className="md:h-[25vh] h-[13vh] w-[100%] bg-[#D4D4D4] rounded-3xl flex items-center justify-center text-white font-semibold text-xl">
                  Imagem de capa
                </div>
              )}

              <div className="flex md:flex-row flex-col md:gap-6 gap-4">
                <TextField
                  name="titulo"
                  label="Título da campanha de publicidade"
                  placeholder="Título da campanha publicitária"
                  className="!w-[100%]"
                />
                <UploadField
                  name="url_imagem"
                  label="Imagem de capa"
                  multiple={false}
                  className="!w-fit"
                  fileList={fileList}
                  setFileList={setFileList}
                />
              </div>

              <TextAreaField
                name="conteudo"
                label="Corpo"
                placeholder="Corpo da publicação"
                rows={3}
                className="!w-full !h-full"
              />

              <div className="flex justify-end mt-4">
                <FormButton text="Publicar" icon={<UploadOutlined />} loading={isLoading} />
              </div>
            </div>
          </Form.FormBody>
        </Form.Body>
      </div>
    </>
  );
}