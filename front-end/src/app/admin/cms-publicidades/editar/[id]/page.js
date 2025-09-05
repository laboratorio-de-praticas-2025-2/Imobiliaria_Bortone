"use client";
import { useParams } from "next/navigation";
import ConfirmModal from "@/components/cms/ConfirmModal";
import Form from "@/components/cms/form";
import FormButton from "@/components/cms/form/fields/Button";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import TextField from "@/components/cms/form/fields/TextField";
import UploadField from "@/components/cms/form/fields/UploadField";
import Sidebar from "@/components/cms/Sidebar";
import {  Form as FormAntd } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { publicidadesMock } from "@/mock/publicidades";

export default function EditarPublicidadePage() {
   const params = useParams(); 
   const id = params?.id;
  const [fileList, setFileList] = useState([]);
  const [publicidade, setPublicidade] = useState(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [formValues, setFormValues] = useState(null);

  useEffect(() => {
    const found = publicidadesMock.find((b) => String(b.id) === String(id));
    setPublicidade(found);
  }, [id]);

  const onFinish = (values) => {
    setFormValues(values);
    setIsConfirmModalVisible(true);
  };

  const onConfirm = () => {
    console.log("Edit Success:", formValues);
    setIsConfirmModalVisible(false);
    window.location.href = "/admin/cms-publicidades";
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Edit Failed:", errorInfo);
  };

  if (!publicidade) return <div>Carregando...</div>;

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
        <Form.Body title="Publicidades | Cadastro">
          <Form.FormHeader href="/admin/cms-publicidades" />
          <Form.FormBody
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
              titulo: publicidade.titulo,
              conteudo: publicidade.conteudo,
            }}
          >
            <div className="flex flex-col w-full gap-2 ">
              <p className="!text-[#0d1b3e] !font-semibold text-[16px]">
                Prévia *
              </p>
              {fileList.length > 0 ? (
                <div className="w-[100%] h-80 bg-gray-200 rounded-3xl ">
                  <Image
                    src={URL.createObjectURL(fileList[0].originFileObj)}
                    alt="Prévia da publicidade"
                    width={400}
                    height={320}
                    className="h-full w-full object-cover rounded-3xl"
                  />
                </div>
              ) : (
                <div className="h-[25vh] w-[100%] bg-[#D4D4D4] rounded-3xl flex items-center justify-center text-white font-semibold text-xl">
                  Imagem de capa
                </div>
              )}

              <div className="flex gap-6">
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
                <FormButton
                  text="Publicar"
                  onClick={() => setIsConfirmModalVisible(true)}
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
