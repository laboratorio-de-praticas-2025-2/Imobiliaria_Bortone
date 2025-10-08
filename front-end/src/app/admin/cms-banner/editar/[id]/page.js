"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DatePicker as AntdDatePicker, Form as FormAntd } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import Sidebar from "@/components/cms/Sidebar";
import ConfirmModal from "@/components/cms/ConfirmModal";
import Form from "@/components/cms/form/index";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import FormButton from "@/components/cms/form/fields/Button";

import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import UploadField from "@/components/cms/form/fields/UploadField";
import { uploadBannerImage } from "@/services/netlifyUploadService";
import { apiClient } from "@/utils/apiClient";
import SplashScreen from "@/components/SplashScreen";
import { useFormSubmit } from "@/hooks/useAsyncOperation";
import { useAuth } from "@/hooks/useAuth";

export default function EditarBannerPage() {
  const { id } = useParams();
  const [form] = FormAntd.useForm();
  const [banner, setBanner] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [formValues, setFormValues] = useState(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const { submitForm, isLoading } = useFormSubmit();
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    const fetchBanner = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/banner/${id}`);
        const data = res.data;
        setBanner(data);
        
        // Preencher o formulário com os dados carregados
        form.setFieldsValue({
          descricao: data.descricao,
        });
        
        if (data.url_imagem) {
          // Para Vercel/Cloudinary, não adicionar base URL na inicialização do fileList
          setFileList([
            {
              uid: "-1",
              name: data.url_imagem.split("/").pop(),
              status: "done",
              url: data.url_imagem, // URL completa do Cloudinary
            },
          ]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar banner:", err);
        setLoading(false);
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
      const values = await form.validateFields();
      
      await submitForm(
        values,
        async (formData) => {
          let url_imagem = banner.url_imagem;

          // Upload da nova imagem via Cloudinary se houver arquivo
          if (fileList.length > 0 && fileList[0].originFileObj) {
            url_imagem = await uploadBannerImage(
              fileList[0].originFileObj,
              formData.descricao,
              user?.id?.toString() || "1" // usuario_id do usuário logado
            );
            console.log('Nova imagem uploaded:', url_imagem);
          }

          // Enviar dados para o backend sem arquivo
          const bannerData = {
            descricao: formData.descricao,
            usuario_id: user?.id || 1,
            url_imagem
          };

          const res = await apiClient.put(`/banner/${id}`, bannerData);

          if (res.status !== 200) {
            throw new Error(res.data?.error || "Erro ao atualizar banner");
          }

          return res.data;
        },
        {
          successMessage: "Banner atualizado com sucesso!",
          onSuccess: () => {
            setIsConfirmModalVisible(false);
            window.location.href = "/admin/cms-banner";
          },
          requiredFields: ['descricao']
        }
      );
    } catch (error) {
      console.error("Erro na validação:", error);
    }
  };

  const onFinishFailed = (errorInfo) => console.log("Edit Failed:", errorInfo);

  if (loading) return <SplashScreen />;

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
                  icon={<UploadOutlined />}
                  loading={isLoading}
                />
              </div>
            </div>
          </Form.FormBody>
        </Form.Body>
      </div>
    </>
  );
}