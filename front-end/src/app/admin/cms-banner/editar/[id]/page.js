"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";

import ConfirmModal from "@/components/cms/ConfirmModal";
import Form from "@/components/cms/form";
import FormButton from "@/components/cms/form/fields/Button";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import UploadField from "@/components/cms/form/fields/UploadField";
import Sidebar from "@/components/cms/Sidebar";
import { uploadBannerImage } from "@/services/netlifyUploadService";
import { Form as FormAntd } from "antd";

const BACKEND_BASE_URL = "http://localhost:4000";

export default function EditarBannerPage() {
  const { id } = useParams();
  const [form] = FormAntd.useForm();
  const [banner, setBanner] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [formValues, setFormValues] = useState(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchBanner = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/banner/${id}`);
        const data = await res.json();
        setBanner(data);
        
        // Preencher o formulário com os dados carregados
        form.setFieldsValue({
          descricao: data.descricao,
        });
        
        if (data.url_imagem) {
          // Inicializa fileList com a imagem existente para que o UploadField a reconheça
          setFileList([
            {
              uid: "-1",
              name: data.url_imagem.split("/").pop(),
              status: "done",
              url: `${BACKEND_BASE_URL}${data.url_imagem}`,
            },
          ]);
        }
      } catch (err) {
        console.error("Erro ao buscar banner:", err);
      }
    };
    fetchBanner();
  }, [id, form]);

  const onFinish = (values) => {
    setFormValues(values);
    setIsConfirmModalVisible(true);
  };

  const onConfirm = async () => {
    try {
      let url_imagem = banner?.url_imagem; // Manter imagem atual

      // Upload da nova imagem via Cloudinary se houver arquivo
      if (fileList.length > 0 && fileList[0].originFileObj) {
        url_imagem = await uploadBannerImage(
          fileList[0].originFileObj,
          formValues.descricao,
          "1" // usuario_id
        );
        console.log('Nova imagem uploaded:', url_imagem);
      }

      // Enviar dados para o backend sem arquivo
      const bannerData = {
        descricao: formValues.descricao,
        usuario_id: 1,
        ativo: true,
        url_imagem
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || BACKEND_BASE_URL;
      const res = await fetch(`${apiUrl}/banner/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bannerData),
      });

      if (res.ok) {
        alert("Banner atualizado com sucesso!");
        setIsConfirmModalVisible(false);
        window.location.href = "/admin/cms-banner";
      } else {
        const data = await res.json();
        alert("Erro ao atualizar banner: " + (data.error || "Desconhecido"));
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar o formulário.");
    }
  };

  const onFinishFailed = (errorInfo) => console.log("Edit Failed:", errorInfo);

  if (!banner) return <div>Carregando...</div>;

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
        <Form.Body title="Banners | Edição">
          <Form.FormHeader href="/admin/cms-banner" />
          <Form.FormBody
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className="flex flex-col w-full gap-6">
              <div className="w-full flex flex-col gap-3 items-end">
                <UploadField
                  name="imagem"
                  label="Imagem do Banner"
                  multiple={false}
                  fileList={fileList}
                  setFileList={setFileList}
                />

                <TextAreaField
                  name="descricao"
                  label="Descrição"
                  placeholder="Corpo da descrição"
                  rows={18}
                  className="!w-full !h-full"
                />

                <FormButton
                  text="Salvar"
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