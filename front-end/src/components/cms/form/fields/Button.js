import { Button, Form } from "antd";

export default function FormButton({text, icon, className,  disabled = false}) {
    return (
        <>
            <Form.Item label={null}>
                 <Button
                    disabled={disabled}
                    className={`!w-fit hover:!text-[var(--primary)] !text-xl !font-bold hover:!border-[var(--primary)] !bg-[var(--primary)] hover:!bg-white !text-white !border-[var(--primary)] !rounded-full !p-4 !h-[50px] ${className}`}
                    htmlType="submit"
                >
                    {text} {icon}
                </Button>
            </Form.Item>
        </>
    );
}