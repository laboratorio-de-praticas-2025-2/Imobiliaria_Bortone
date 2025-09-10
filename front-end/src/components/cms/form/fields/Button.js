import { Button, Form } from "antd";

export default function FormButton({text, icon, className}) {
    return (
        <>
            <Form.Item label={null}>
                <Button
                    className={`!w-fit hover:!text-[var(--primary)] !text-lg !font-bold hover:!border-[var(--primary)] !bg-[var(--primary)] hover:!bg-white !text-white !border-[var(--primary)] !rounded-full !p-4 !h-[36px] ${className}`}
                    htmlType='submit'
                >
                    {text} {icon}
                </Button>
            </Form.Item>
        </>
    );
}