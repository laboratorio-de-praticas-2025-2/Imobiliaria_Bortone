"use client";
import Form from "@/components/cms/form";
import PreviaBanner from "@/components/cms/form/fields/PreviaBanner";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import TextField from "@/components/cms/form/fields/TextField";
import UploadField from "@/components/cms/form/fields/UploadField";
import { UploadOutlined } from "@ant-design/icons";
import FormButton from "@/components/cms/form/fields/Button";

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
          <div className="w-[60%] flex flex-col gap-3 items-end">
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
              rows={18}
              className="!w-full !h-full"
            />
            <FormButton text="Publicar" icon={<UploadOutlined />} />
          </div>

          <PreviaBanner fileList={fileList} />
        </div>
      </Form.FormBody>
    </Form.Body>
  );
}
