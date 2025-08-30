import { RiHome2Line } from "react-icons/ri";
import { FaSignHanging } from "react-icons/fa6";
import { HiMiniMegaphone } from "react-icons/hi2";
import { HiMiniNewspaper } from "react-icons/hi2";
import { AiFillQuestionCircle } from "react-icons/ai";

export const navLinks = [
  { name: "Home", path: "/", icon: RiHome2Line },
  { name: "Imóveis", path: "/imoveis", icon: FaSignHanging },
  { name: "Anuncie", path: "/anuncie", icon: HiMiniMegaphone },
  { name: "Blog", path: "/blog", icon: HiMiniNewspaper },
  { name: "FAQ", path: "/faq", icon: AiFillQuestionCircle },
];
