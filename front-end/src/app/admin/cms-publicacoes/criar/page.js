"use client";
import Form from "@/components/cms/form";
import PreviaPost from "@/components/cms/form/fields/PreviaPost";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import TextField from "@/components/cms/form/fields/TextField";
import UploadField from "@/components/cms/form/fields/UploadField";
import { UploadOutlined } from "@ant-design/icons";
import FormButton from "@/components/cms/form/fields/Button";
import Image from "next/image";
import Sidebar from "@/components/cms/Sidebar";

import { useState } from "react";

export default function CriarPostPage() {
  const [fileList, setFileList] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onFinish = (values) => {
    setFormValues(values);
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <Form.Body title="Publicações | Cadastro">
          <Form.FormHeader href="/admin/cms-publicacoes" />
          <Form.FormBody onFinish={onFinish} onFinishFailed={onFinishFailed}>
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
                  title={title}
                  content={content}
                />
              </div>

              <div className="sm:hidden w-full flex flex-col gap-3.5 items-center">
                <PreviaPost
                  fileList={fileList}
                  title={title}
                  content={content}
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
