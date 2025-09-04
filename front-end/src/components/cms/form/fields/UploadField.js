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
    <FormAntd.Item
      label={label}
      name={name}
      rules={[{ required: true, message: "Este campo é obrigatório!" }]}
      className={`custom-form-item ${className}`}
      labelCol={{ span: 24 }}
    >
      <Upload
        beforeUpload={() => false}
        fileList={fileList}
        onChange={({ fileList }) =>
          setFileList(multiple ? fileList : fileList.slice(-1))
        }
        multiple={multiple}
        className="!w-fit"
      >
        <Button className="!text-[var(--primary)] !text-lg !font-bold !border-[var(--primary)] hover:!bg-[var(--primary)] hover:!text-white hover:!border-[var(--primary)] !rounded-full !p-4 !w-fit !h-[36px]">
          Selecionar arquivo <UploadOutlined />
        </Button>
      </Upload>
    </FormAntd.Item>
  );
}
