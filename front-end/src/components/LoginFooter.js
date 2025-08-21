import { Flex } from "antd";
import SocialMediaIcon from "./SocialMediaIcon";
import { socialMedias } from "@/constants/socialMedias";

export default function LoginFooter() {
  return (
    <Flex vertical gap={22}>
      <div className="flex flex-row items-center justify-center gap-5 text-[var(--primary)] font-semibold">
        <div className="h-[2px] bg-[var(--primary)] w-[5rem]" />
        ou
        <div className="h-[2px] bg-[var(--primary)]  w-[5rem]" />
      </div>
      <div className="flex flex-row w-full gap-3.5 justify-center">
        {socialMedias.map((media) => (
          <SocialMediaIcon key={media.alt} src={media.src} alt={media.alt} />
        ))}
      </div>
    </Flex>
  );
}
