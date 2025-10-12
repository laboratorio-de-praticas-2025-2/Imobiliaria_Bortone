import { Button, Form } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function FormButton({
  text,
  icon,
  className = "",
  onClick,
  loading = false,
  disabled = false,
  htmlType = "submit",
  ...props
}) {
  
  const isLegacyMode = !("loading" in props) && !("onClick" in props);

  const isDisabled = loading || disabled;

  return (
    <>
      <Form.Item label={null}>
        <Button
          htmlType={htmlType}
          onClick={onClick}
          loading={loading}
          disabled={isDisabled}
          className={`!w-fit hover:!text-[var(--primary)] !text-xl !font-bold hover:!border-[var(--primary)] 
            !bg-[var(--primary)] hover:!bg-white !text-white !border-[var(--primary)] 
            !rounded-full !p-4 !h-[50px] ${className} ${isDisabled ? '!opacity-70 !cursor-not-allowed' : ''}`}
          {...props}
        >
          {loading ? (
            <>
              <LoadingOutlined className="mr-2" />
              Processando...
            </>
          ) : (
            <>
              {text} {icon}
            </>
          )}
        </Button>
      </Form.Item>
    </>
  );
}
