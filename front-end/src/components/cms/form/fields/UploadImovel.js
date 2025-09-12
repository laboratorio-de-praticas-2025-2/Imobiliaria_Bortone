"use client";
import { useState } from "react";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { Form as FormAntd, Upload, Button } from "antd";
import PreviaImovel from "./PreviaImovel";

export default function UploadImovel({
  className,
  readOnly = false,
  multiple = false,
}) {
  const [fileList, setFileList] = useState([]);

  const handleRemove = (file) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  return (
    <div className="!w-full">
      <FormAntd.Item
        label={"Imagens"}
        className={`custom-form-item !w-full ${className}`}
        labelCol={{ span: 24 }}
      >
        <div className="bg-[#CED2E1] w-full h-[15vh] rounded-lg p-2 flex items-center">
          {fileList.length === 0 ? (
            // botão centralizado quando não há imagens
            <div className="w-full flex justify-center items-center">
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) =>
                  setFileList(multiple ? fileList : fileList.slice(-1))
                }
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
                fileList={fileList}
                onChange={({ fileList }) =>
                  setFileList(multiple ? fileList : fileList.slice(-1))
                }
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
