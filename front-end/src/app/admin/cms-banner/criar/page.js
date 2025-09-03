'use client'
import Form from "@/components/cms/form";
import { Input, Form as FormAntd, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import TextField from "@/components/cms/form/fields/TextField";
import UploadField from "@/components/cms/form/fields/UploadField";

const { TextArea } = Input;

export default function CriarBannerPage() {
    const [fileList, setFileList] = useState([]);

    const onFinish = (values) => {
        console.log("Success:", values);
    }

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    }    
    
    return (
      <Form.Body title="Banners | Cadastro">
        <Form.FormHeader href="/admin/cms-banner" />
        <Form.FormBody onFinish={onFinish} onFinishFailed={onFinishFailed}>
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
              className="!w-fit"
            />
          </div>

          <TextAreaField
            name="descricao"
            label="Descrição"
            placeholder="Corpo da descrição"
            rows={20}
            className="!w-full !h-full"
          />
        </Form.FormBody>
      </Form.Body>
    );
}