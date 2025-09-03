import { Button, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function FormButton({text, icon}) {
    return (
        <>
            <Form.Item label={null}>
                <Button
                    className="!w-fit hover:!text-[var(--primary)] !text-lg !font-bold hover:!border-[var(--primary)] !bg-[var(--primary)] hover:!bg-white !text-white !border-[var(--primary)] !rounded-full !p-4 !h-[36px]"
                    htmlType="submit"
                >
                    {text} {icon}
                </Button>
            </Form.Item>
        </>
    );
}