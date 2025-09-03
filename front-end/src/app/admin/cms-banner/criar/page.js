"use client";
import Form from "@/components/cms/form";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import TextField from "@/components/cms/form/fields/TextField";
import UploadField from "@/components/cms/form/fields/UploadField";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
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
    <Form.Body title="Banners | Cadastro">
      <Form.FormHeader href="/admin/cms-banner" />
      <Form.FormBody onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <div className="flex w-full gap-6">
          {/* Coluna do Formulário */}
          <div className="w-[60%] flex flex-col gap-3">
            <div className="flex w-full justify-between gap-3">
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
            </div>

            <TextAreaField
              name="descricao"
              label="Descrição"
              placeholder="Corpo da descrição"
              rows={20}
              className="!w-full !h-full"
            />
          </div>

          {/* Coluna da Prévia */}
          <div className="w-[40%] min-h-[200px] flex items-center justify-center border border-gray-300 rounded-2xl bg-white relative">
            <p className="absolute top-[-18px] left-10 font-bold text-lg">
              Prévia
            </p>
            <div className="flex justify-between w-full">
              <button className="custom-prev absolute top-1/2 left-0 -translate-y-1/2 z-20">
                <IoIosArrowBack size={70} color="#374a8c" />
              </button>
              <div className="w-30 h-80 bg-gray-200 rounded-r-3xl" />
              {fileList.length > 0 ? (
                <div className="w-100 h-80 bg-gray-200 rounded-3xl">
                  <Image
                    src={URL.createObjectURL(fileList[0].originFileObj)}
                    alt="Prévia do banner"
                    width={120}
                    height={320}
                    className="h-full w-full object-cover rounded-3xl"
                  />
                </div>
              ) : (
                <div className="w-100 h-80 bg-gray-200 rounded-3xl" />
              )}
              <div className="w-30 h-80 bg-gray-200 rounded-l-3xl" />
              <button className="custom-next absolute top-1/2 right-0 -translate-y-1/2 z-20">
                <IoIosArrowForward size={70} color="#374a8c" />
              </button>
            </div>
          </div>
        </div>
      </Form.FormBody>
    </Form.Body>
  );
}
