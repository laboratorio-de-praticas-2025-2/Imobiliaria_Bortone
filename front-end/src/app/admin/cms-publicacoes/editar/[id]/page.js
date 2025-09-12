"use client";
import { useParams } from "next/navigation";
import ConfirmModal from "@/components/cms/ConfirmModal";
import Form from "@/components/cms/form";
import FormButton from "@/components/cms/form/fields/Button";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import TextField from "@/components/cms/form/fields/TextField";
import UploadField from "@/components/cms/form/fields/UploadField";
import Sidebar from "@/components/cms/Sidebar";
import PreviaPost from "@/components/cms/form/fields/PreviaPost";
import { postsData } from "@/mock/posts";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function EditarPostPage() {
   const params = useParams(); 
   const id = params?.id;
  const [fileList, setFileList] = useState([]);
  const [post, setPost] = useState(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const found = postsData.find((b) => String(b.id) === String(id));
    setPost(found);
  }, [id]);

  const onFinish = (values) => {
    setFormValues(values);
    setIsConfirmModalVisible(true);
  };

  const onConfirm = () => {
    console.log("Edit Success:", formValues);
    setIsConfirmModalVisible(false);
    window.location.href = "/admin/cms-publicacoes";
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Edit Failed:", errorInfo);
  };

  if (!post) return <div>Carregando...</div>;

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
        <Form.Body title="Publicações | Edição">
          <Form.FormHeader href="/admin/cms-publicacoes" />
          <Form.FormBody
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
              titulo: post.titulo,
              conteudo: post.conteudo,
            }}
          >
            <div className="flex flex-col sm:flex-row w-full gap-6">
              {/* Coluna do Formulário */}
              <div className="sm:w-[60%] flex flex-col gap-3 items-end">
                <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-3">
                  <TextField
                    name="titulo"
                    label="Título da matéria"
                    placeholder="Título da matéria"
                    className="!w-[100%]"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <UploadField
                    name="url_imagem"
                    label="Imagem de Capa"
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
                  name="conteudo"
                  label="Corpo"
                  placeholder="Corpo da publicação"
                  rows={18}
                  className="!w-full !h-full"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <FormButton
                  text="Publicar"
                  className="!hidden sm:!flex"
                  icon={<UploadOutlined />}
                />
              </div>

              <div className="sm:w-[40%] hidden sm:flex">
                <PreviaPost
                  fileList={fileList}
                  title={title || post.titulo}
                  content={content || post.conteudo}
                />
              </div>

              <div className="sm:hidden w-full flex flex-col gap-3.5 items-center">
                <PreviaPost
                  fileList={fileList}
                  title={title || post.titulo}
                  content={content || post.conteudo}
                />
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
