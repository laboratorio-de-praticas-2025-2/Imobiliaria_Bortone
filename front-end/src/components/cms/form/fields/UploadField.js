"use client";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";

export default function UploadField({
  name,
  label,
  className,
  fileList,
  setFileList,
}) {
  // Validação de arquivo antes do upload
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Você só pode fazer upload de arquivos de imagem!');
      return Upload.LIST_IGNORE;
    }
    
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('A imagem deve ter menos de 5MB!');
      return Upload.LIST_IGNORE;
    }
    
    console.log('Arquivo validado com sucesso:', file);
    return false; // Não fazer upload automático
  };

  const handleChange = ({ fileList: newFileList }) => {
    console.log('Upload onChange - fileList:', newFileList);
    
    // Filtrar apenas arquivos válidos
    const validFiles = newFileList.filter(file => {
      if (file.originFileObj) {
        const isImage = file.originFileObj.type.startsWith('image/');
        const isValidSize = file.originFileObj.size / 1024 / 1024 < 5;
        return isImage && isValidSize;
      }
      return true; // Manter arquivos que já estavam na lista
    });
    
    // SEMPRE manter apenas uma imagem (independente da prop multiple)
    setFileList(validFiles.slice(-1));
  };

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
        maxCount={1}
        showUploadList={{
          showPreviewIcon: true,
          showRemoveIcon: true,
          showDownloadIcon: false,
        }}
      >
        <Button className="!text-[var(--primary)] !text-xl !font-bold !border-[var(--primary)] hover:!bg-[var(--primary)] hover:!text-white hover:!border-[var(--primary)] !rounded-full !p-4 !w-fit !h-[36px]">
          Selecionar arquivo <UploadOutlined />
        </Button>
      </Upload>
    </div>
  );
}
