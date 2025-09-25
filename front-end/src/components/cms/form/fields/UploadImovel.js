"use client";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { Form as FormAntd, Upload, Button } from "antd";
import PreviaImovel from "./PreviaImovel";

export default function UploadImovel({
  className,
  readOnly = false,
  multiple = false,
  fileList,
  setFileList,   // 👈 agora vem do pai
}) {
  const handleRemove = (file) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleChange = ({ file, fileList: newFileList }) => {
    // filtra só os arquivos válidos e garante que originFileObj esteja presente
    const validFiles = newFileList
      .map(f => ({
        ...f,
        url: f.url || URL.createObjectURL(f.originFileObj), // gera url para preview
      }))
      .filter(f => !!f.originFileObj); 
  
    setFileList(validFiles);
  };

  return (
    <div className="!w-full">
      <FormAntd.Item
        label={"Imagens"}
        className={`custom-form-item required !w-full ${className}`}
        labelCol={{ span: 24 }}
      >
        <div className="bg-[#CED2E1] w-full h-[15vh] rounded-lg p-2 flex items-center">
          {fileList.length === 0 ? (
            // botão centralizado quando não há imagens
            <div className="w-full flex justify-center items-center">
              <Upload
                beforeUpload={() => false}
                onChange={handleChange}
                multiple={multiple}
                showUploadList={false}
              >
                <Button className="!text-[var(--primary)] !text-md !font-bold !border-[var(--primary)] !rounded-full !p-4 !w-fit !h-[36px]">
                  Selecionar arquivo <UploadOutlined />
                </Button>
              </Upload>
            </div>
          ) : (
            // quando houver imagens, mostra as prévias + botão de adicionar
            <div className="h-full flex items-center gap-4 overflow-x-auto">
              <PreviaImovel fileList={fileList} onRemove={handleRemove} />
              <Upload
                beforeUpload={() => false}
                onChange={handleChange}
                multiple={multiple}
                showUploadList={false}
              >
                <Button
                  shape="circle"
                  icon={<PlusOutlined />}
                  className="!text-[var(--primary)] !border-[var(--primary)] !w-10 !h-10"
                />
              </Upload>
            </div>
          )}
        </div>
      </FormAntd.Item>
    </div>
  );
}
