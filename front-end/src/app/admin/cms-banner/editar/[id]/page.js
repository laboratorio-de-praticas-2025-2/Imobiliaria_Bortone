"use client";
import ConfirmModal from "@/components/cms/ConfirmModal";
import Form from "@/components/cms/form";
import FormButton from "@/components/cms/form/fields/Button";
import PreviaBanner from "@/components/cms/form/fields/PreviaBanner";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import TextField from "@/components/cms/form/fields/TextField";
import UploadField from "@/components/cms/form/fields/UploadField";
import { bannersMock } from "@/constants/banner";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import Sidebar from "@/components/cms/Sidebar";

export default function EditarBannerPage({ params }) {
  const id = params?.id;
  const [fileList, setFileList] = useState([]);
  const [banner, setBanner] = useState(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [formValues, setFormValues] = useState(null);

  useEffect(() => {
    const found = bannersMock.find((b) => String(b.id) === String(id));
    setBanner(found);
  }, [id]);

  const onFinish = (values) => {
    setFormValues(values);
    setIsConfirmModalVisible(true);
  };

  const onConfirm = () => {
    console.log("Edit Success:", formValues);
    setIsConfirmModalVisible(false);
    window.location.href = "/admin/cms-banner";
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Edit Failed:", errorInfo);
  };

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
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
              titulo: banner.descricao,
              descricao: banner.descricao,
            }}
          >
            <div className="flex flex-col sm:flex-row w-full gap-6">
              <div className="sm:w-[60%] flex flex-col gap-3 items-end">
                <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-3">
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
                  name="descricao"
                  label="Descrição"
                  placeholder="Corpo da descrição"
                  rows={18}
                  className="!w-full !h-full"
                />
                <FormButton
                  text="Salvar"
                  className="!hidden sm:!flex"
                  onClick={() => setIsConfirmModalVisible(true)}
                  icon={<UploadOutlined />}
                />
              </div>

              <div className="sm:w-[40%] hidden sm:flex">
                <PreviaBanner fileList={fileList} />
              </div>

              <div className="sm:hidden w-full flex flex-col gap-3.5 items-center">
                <PreviaBanner fileList={fileList} />
                <FormButton
                  text="Salvar"
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
