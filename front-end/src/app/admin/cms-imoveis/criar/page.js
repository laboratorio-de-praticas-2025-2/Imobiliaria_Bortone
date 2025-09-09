"use client";
import Form from "@/components/cms/form";
import { useState } from "react";
import RadioField from "@/components/cms/form/fields/RadioField";
import TextField from "@/components/cms/form/fields/TextField";
import FormButton from "@/components/cms/form/fields/Button";
import { MdPersonAdd } from "react-icons/md";
import Sidebar from "@/components/cms/Sidebar";
import TextAreaField from "@/components/cms/form/fields/TextAreaField";
import DropdownField from "@/components/cms/form/fields/Dropdown";
import { Form as FormAntd } from "antd";
import UploadField from "@/components/cms/form/fields/UploadField";

export default function CriarImovelPage() {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const [tipoSelecionado, setTipoSelecionado] = useState("Selecione o Tipo");
  const [statusSelecionado, setstatusSelecionado] =
    useState("Selecione o status");
  const [fileList, setFileList] = useState([]);

  const options = ["Casa", "Terreno"];
  const status = ["Disponivel", "Indisponivel", "Vendido", "Alugado"];

  return (
    <>
      <Sidebar />
      <div className="md:ml-20">
        <Form.Body title="Imóveis | Cadastro">
          <Form.FormHeader href="/admin/cms-imoveis" />
          <Form.FormBody onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <div className="flex flex-col sm:flex-row w-full">
              {/* Coluna do Formulário */}
              <div className="sm:w-[50%] flex flex-col gap-6 items-start">
                <div className=" flex flex-row gap-6">
                  <FormAntd.Item
                    label={"Tipo"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
                    ]}
                    className={`custom-form-item `}
                    labelCol={{ span: 24 }}
                  >
                    <DropdownField
                      placeholder="Selecione o Tipo"
                      label="Tipo"
                      options={options}
                      selected={tipoSelecionado}
                      setSelected={setTipoSelecionado}
                      handleSelect={(option) => setTipoSelecionado(option)}
                      width={"w-full"}
                      classname="bg-white hover:bg-[#EEF0F9] w-full "
                    />
                  </FormAntd.Item>

                  <FormAntd.Item
                    label={"Status"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
                    ]}
                    className={`custom-form-item `}
                    labelCol={{ span: 24 }}
                  >
                    <DropdownField
                      placeholder="Selecione o Tipo"
                      options={status}
                      selected={statusSelecionado}
                      setSelected={setstatusSelecionado}
                      handleSelect={(status) => setstatusSelecionado(status)}
                      width={"w-full"}
                      classname="bg-white hover:bg-[#EEF0F9] w-full "
                    />
                  </FormAntd.Item>
                </div>
                <UploadField
                  name="imagem"
                  label="Imagens"
                  multiple={false}
                  className="!w-fit"
                  fileList={fileList}
                  setFileList={setFileList}
                />
                <TextAreaField
                  name="descricao"
                  label="Descrição"
                  placeholder="Corpo da descrição"
                  rows={12}
                  className="!w-full !h-full"
                />
                <FormButton text="Cadastrar" icon={<MdPersonAdd />} />
              </div>
              <div className="sm:w-[50%] flex flex-col gap-6 items-start">
                <div className=" flex flex-row gap-6">
                  <FormAntd.Item
                    label={"Tipo"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
                    ]}
                    className={`custom-form-item `}
                    labelCol={{ span: 24 }}
                  >
                    <DropdownField
                      placeholder="Selecione o Tipo"
                      label="Tipo"
                      options={options}
                      selected={tipoSelecionado}
                      setSelected={setTipoSelecionado}
                      handleSelect={(option) => setTipoSelecionado(option)}
                      width={"w-full"}
                      classname="bg-white hover:bg-[#EEF0F9] w-full "
                    />
                  </FormAntd.Item>

                  <FormAntd.Item
                    label={"Status"}
                    rules={[
                      { required: true, message: "Este campo é obrigatório!" },
                    ]}
                    className={`custom-form-item `}
                    labelCol={{ span: 24 }}
                  >
                    <DropdownField
                      placeholder="Selecione o Tipo"
                      options={status}
                      selected={statusSelecionado}
                      setSelected={setstatusSelecionado}
                      handleSelect={(status) => setstatusSelecionado(status)}
                      width={"w-full"}
                      classname="bg-white hover:bg-[#EEF0F9] w-full "
                    />
                  </FormAntd.Item>
                </div>
                <FormButton text="Cadastrar" icon={<MdPersonAdd />} />
              </div>
            </div>
          </Form.FormBody>
        </Form.Body>
      </div>
    </>
  );
}
