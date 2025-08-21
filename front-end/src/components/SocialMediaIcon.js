import Image from "next/image";

export default function SocialMediaIcon({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="cursor-pointer social-media-icon"
    />
  );
}
