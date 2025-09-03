'use client'
import Form from "@/components/cms/form";
import { Input, Form as FormAntd } from "antd";

export default function CriarBannerPage() {
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
          <div>
            <FormAntd.Item
              label="Título do Banner"
              name="descricao"
              rules={[{ required: true, message: "Este campo é obrigatório!" }]}
              className="custom-form-item"
              labelCol={{ span: 24 }}
            >
              <Input placeholder="Título do Banner" className="custom-input" />
            </FormAntd.Item>
          </div>
        </Form.FormBody>
      </Form.Body>
    );
}