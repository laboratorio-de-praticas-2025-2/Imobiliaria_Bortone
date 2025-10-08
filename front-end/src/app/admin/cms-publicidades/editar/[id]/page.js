"use client";
import { useParams, useRouter } from "next/navigation";
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
import { useEffect, useState, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import { uploadPublicidadeImage } from "@/services/netlifyUploadService";
import { apiClient } from "@/utils/apiClient";
import { buildImageUrl } from "@/utils/imageUtils";
import { useFormSubmit } from "@/hooks/useAsyncOperation";

export default function EditarPublicidadePage() {
  const params = useParams(); 
  const id = params?.id;
  const router = useRouter();
  const [form] = FormAntd.useForm();
  const [fileList, setFileList] = useState([]);
  const [publicidade, setPublicidade] = useState(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const { submitForm, isLoading } = useFormSubmit();

  const loadPublicidade = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/publicidade/${id}`);
      if (response.status === 200) {
        setPublicidade(response.data);
        setFileList([]);
        console.log('Publicidade carregada:', response.data);
        
        // Preencher o formulário com os dados carregados
        form.setFieldsValue({
          titulo: response.data.titulo,
          conteudo: response.data.conteudo,
        });
      }
      setLoading(false);
    } catch {
      console.log("Erro ao carregar publicidade");
      setLoading(false);
    }
  }, [id, form]);

  useEffect(() => {
    if (id) {
      loadPublicidade();
    }
  }, [id, loadPublicidade]);

  const onFinish = (values) => {
    setFormValues(values);
    setIsConfirmModalVisible(true);
  };

  const onConfirm = async () => {
    await submitForm(
      formValues,
      async (validatedValues) => {
        console.log('=== FRONT-END DEBUG ===');
        console.log('fileList:', fileList);
        console.log('fileList.length:', fileList.length);
        if (fileList.length > 0) {
          console.log('fileList[0]:', fileList[0]);
          console.log('fileList[0].originFileObj:', fileList[0].originFileObj);
        }
        console.log('validatedValues:', validatedValues);
        console.log('publicidade:', publicidade);
        console.log('=======================');
        
        let url_imagem = publicidade.url_imagem; // Manter imagem atual

        // Upload da nova imagem via Cloudinary se houver arquivo
        if (fileList.length > 0 && fileList[0].originFileObj) {
          url_imagem = await uploadPublicidadeImage(
            fileList[0].originFileObj,
            validatedValues.titulo,
            validatedValues.conteudo,
            publicidade.usuario_id.toString(),
            publicidade.ativo
          );
          console.log('Nova imagem uploaded:', url_imagem);
        } else {
          console.log('Nenhum arquivo novo selecionado, mantendo imagem atual');
        }

        // Enviar dados para o backend sem arquivo
        const publicidadeData = {
          titulo: validatedValues.titulo,
          conteudo: validatedValues.conteudo,
          usuario_id: publicidade.usuario_id,
          ativo: publicidade.ativo,
          url_imagem
        };

        console.log('Enviando dados para backend:', publicidadeData);

        const response = await apiClient.put(`/publicidade/${id}`, publicidadeData);
        
        if (response.status === 200) {
          setIsConfirmModalVisible(false);
          router.push("/admin/cms-publicidades");
          return response.data;
        }
      },
      {
        requiredFields: ['titulo', 'conteudo'],
        successMessage: "Publicidade atualizada com sucesso!",
        onSuccess: () => {
          setIsConfirmModalVisible(false);
          router.push("/admin/cms-publicidades");
        }
      }
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Edit Failed:", errorInfo);
  };

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
        <Form.Body title="Publicidades | Edição">
          <Form.FormHeader href="/admin/cms-publicidades" />
          <Form.FormBody
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className="flex flex-col w-full gap-2 ">
              <p className="!text-[#0d1b3e] !font-semibold text-[16px]">
                Prévia *
              </p>
              {fileList.length > 0 && fileList[0].originFileObj ? (
                <div className="w-[100%] md:h-[25vh] h-[13vh] bg-gray-200 rounded-3xl ">
                  <Image
                    src={URL.createObjectURL(fileList[0].originFileObj)}
                    alt="Nova imagem selecionada"
                    width={400}
                    height={320}
                    className="h-full w-full object-cover rounded-3xl"
                  />
                </div>
              ) : publicidade?.url_imagem ? (
                <div className="w-[100%] md:h-[25vh] h-[13vh] bg-gray-200 rounded-3xl ">
                  <Image
                    src={buildImageUrl(publicidade.url_imagem, 'publicidade', '/images/casa.png')}
                    alt="Imagem atual"
                    width={400}
                    height={320}
                    className="h-full w-full object-cover rounded-3xl"
                    onError={(e) => { 
                      console.error('❌ Erro ao carregar imagem da publicidade:', {
                        original: publicidade.url_imagem,
                        constructed: buildImageUrl(publicidade.url_imagem, 'publicidade', '/images/casa.png'),
                        error: e
                      });
                      try { e.target.src = '/404.png'; } catch {} 
                    }}
                    onLoad={() => {
                      console.log('✅ Imagem da publicidade carregada com sucesso:', buildImageUrl(publicidade.url_imagem, 'publicidade', '/images/casa.png'));
                    }}
                  />
                </div>
              ) : (
                <div className="md:h-[25vh] h-[13vh] w-[100%] bg-[#D4D4D4] md:rounded-3xl rounded-xl flex items-center justify-center text-white font-semibold md:text-xl text-sm">
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
                <FormButton
                  text="Publicar"
                  onClick={() => setIsConfirmModalVisible(true)}
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