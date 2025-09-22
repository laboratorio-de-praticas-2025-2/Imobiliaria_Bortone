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
import { useEffect, useState } from "react";
import axios from "axios";

export default function EditarPublicidadePage() {
  const params = useParams(); 
  const id = params?.id;
  const router = useRouter();
  const [fileList, setFileList] = useState([]);
  const [publicidade, setPublicidade] = useState(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [formValues, setFormValues] = useState(null);

  useEffect(() => {
    if (id) {
      loadPublicidade();
    }
  }, [id]);

  const loadPublicidade = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/publicidade/${id}`);
      if (response.status === 200) {
        setPublicidade(response.data);
        setFileList([]);
        console.log('Publicidade carregada:', response.data);
      }
    } catch {
      console.log("Erro ao carregar publicidade");
    }
  };

  const onFinish = (values) => {
    setFormValues(values);
    setIsConfirmModalVisible(true);
  };

  const onConfirm = async () => {
    if (formValues.titulo && formValues.conteudo) {
      try {
        console.log('=== FRONT-END DEBUG ===');
        console.log('fileList:', fileList);
        console.log('fileList.length:', fileList.length);
        if (fileList.length > 0) {
          console.log('fileList[0]:', fileList[0]);
          console.log('fileList[0].originFileObj:', fileList[0].originFileObj);
        }
        console.log('formValues:', formValues);
        console.log('publicidade:', publicidade);
        console.log('=======================');
        
        const formData = new FormData();
        formData.append('titulo', formValues.titulo);
        formData.append('conteudo', formValues.conteudo);
        formData.append('usuario_id', publicidade.usuario_id.toString());
        formData.append('ativo', publicidade.ativo.toString());
        
        if (fileList.length > 0 && fileList[0].originFileObj) {
          formData.append('url_imagem', fileList[0].originFileObj);
          console.log('Arquivo adicionado ao FormData:', fileList[0].originFileObj.name);
        } else {
          console.log('Nenhum arquivo novo selecionado');
        }

        console.log('FormData entries:');
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/publicidade/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.status === 200) {
          alert("Publicidade atualizada com sucesso!");
          setIsConfirmModalVisible(false);
          router.push("/admin/cms-publicidades");
        }
      } catch (error) {
        console.log("Erro ao atualizar a publicidade:", error);
      }
    } else {
      alert("Preencha todos os campos!");
    }
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
        <Form.Body title="Publicidades | Edição">
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
                    src={publicidade.url_imagem.startsWith('/') ? publicidade.url_imagem : `/images/publicidadeImages/${publicidade.url_imagem}`}
                    alt="Imagem atual"
                    width={400}
                    height={320}
                    className="h-full w-full object-cover rounded-3xl"
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
                />
              </div>
            </div>
          </Form.FormBody>
        </Form.Body>
      </div>
    </>
  );
}
