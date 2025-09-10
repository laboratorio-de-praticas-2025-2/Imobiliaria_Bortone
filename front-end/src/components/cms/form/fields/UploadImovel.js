"use client";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Form as FormAntd, Upload, Button } from "antd";

export default function UploadImovel({
  className,
  readOnly = false,
  multiple = false,
}) {
  const [fileList, setFileList] = useState([]);

  return (
    <div className="!w-full ">
      <FormAntd.Item
        label={"Imagem"}
        className={`custom-form-item !w-full ${className}`}
        labelCol={{ span: 24 }}
      >
        {/* A alteração está aqui: justify-center e items-center */}
        <div className="bg-[#CED2E1] flex justify-center items-center w-full h-[15vh] rounded-lg">
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) =>
              setFileList(multiple ? fileList : fileList.slice(-1))
            }
            multiple={multiple}
          >
            <Button className="!text-[var(--primary)] !text-md !font-bold !border-[var(--primary)] hover:!bg-[var(--primary)] hover:!text-white hover:!border-[var(--primary)] !rounded-full !p-4 !w-fit !h-[36px]">
              Selecionar arquivo <UploadOutlined />
            </Button>
          </Upload>
        </div>
      </FormAntd.Item>
    </div>
  );
}