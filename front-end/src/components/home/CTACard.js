import { Flex, Button } from "antd"

export default function CTACard({ className, title, description, buttonText }) {
    return (
        <div className={`p-7 bg-[#DEE1F0] flex align-middle rounded-xl ${className}`}>
            <Flex vertical gap="large" justify="center">
                <p className="text-3xl font-extrabold text-[var(--primary)]">{title}</p>
                <p className="text-lg text-[var(--primary)]">{description}</p>
                <Button className="cta-card-button">{buttonText}</Button>
            </Flex>
        </div>
    )
}