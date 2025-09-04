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

export default function CriarBannerPage() {
  const [fileList, setFileList] = useState([]);

  const onFinish = (values) => {
    console.log("Success:", values);
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
                      label="Título do Banner"
                      placeholder="Título do Banner"
                      className="!w-[100%]"
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
