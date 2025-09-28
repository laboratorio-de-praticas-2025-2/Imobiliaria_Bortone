"use client";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { Form as FormAntd, Upload, Button } from "antd";
import PreviaImovel from "./PreviaImovel";
import {useEffect} from "react";

export default function UploadImovel({
  className,
  multiple = false,
  fileList,
  setFileList,   // 👈 agora vem do pai
}) {
  
  // revoga single object URL
  const revokeIfBlob = (url) => {
    try {
      if (url && url.startsWith?.("blob:")) URL.revokeObjectURL(url);
    } catch {}
  };


  // remove chamado pela previa
  const handleRemove = (file) => {
    // revoga se for blob que criamos
    if (file.url && file.originFileObj) revokeIfBlob(file.url);
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  // normaliza e faz merge deduplicado por uid
  const handleChange = ({ fileList: incoming }) => {
    // normaliza incoming (cria url se originFileObj e não existir)
    const normalizedIncoming = incoming.map((f) => {
      if (!f.url && f.originFileObj) {
        // evita criar repetidamente
        f.url = f.url || URL.createObjectURL(f.originFileObj);
      }
      return { ...f, url: f.url || f.thumbUrl || null };
    });

    setFileList((prev) => {
      // se quiser manter a ordem dos novos substituindo a antiga, retorne normalizedIncoming.
      // aqui mantemos prev na frente e acrescentamos novos não existentes
      const existing = new Set(prev.map((p) => p.uid));
      const merged = [...prev];
      normalizedIncoming.forEach((n) => {
        if (!existing.has(n.uid)) merged.push(n);
      });
      // se preferir a ordem dos arquivos conforme seleção mais recente, use:
      // return normalizedIncoming;
      return merged;
    });
  };

  // cleanup ao desmontar: revoga todos blob urls criados
  useEffect(() => {
    return () => {
      (fileList || []).forEach((f) => {
        if (f.url && f.originFileObj) revokeIfBlob(f.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
                fileList={fileList} // controla o Upload
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
                fileList={fileList}
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
