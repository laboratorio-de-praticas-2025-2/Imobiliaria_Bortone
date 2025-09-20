"use client";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form as FormAntd, Upload } from "antd";

export default function UploadField({
  name,
  label,
  multiple = false,
  className,
  fileList,
  setFileList,
}) {
  return (
    <div className={`custom-form-item ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <Upload
        beforeUpload={(file) => {
          // Permitir o arquivo ser adicionado à lista, mas não fazer upload automático
          return false;
        }}
        fileList={fileList}
        onChange={({ fileList }) => {
          console.log('Upload onChange - fileList:', fileList);
          setFileList(multiple ? fileList : fileList.slice(-1));
        }}
        multiple={multiple}
        className="!w-fit"
      >
        <Button className="!text-[var(--primary)] !text-xl !font-bold !border-[var(--primary)] hover:!bg-[var(--primary)] hover:!text-white hover:!border-[var(--primary)] !rounded-full !p-4 !w-fit !h-[36px]">
          Selecionar arquivo <UploadOutlined />
        </Button>
      </Upload>
    </div>
  );
}
