"use client";
import HomeNavbar from "@/components/home/HomeNavbar";
import InputPesquisa from "@/components/blog/InputPesquisa";
import ContentBlog from "@/components/blog/ContentBlog";
import HomeFooter from "@/components/home/HomeFooter";
import { useSEO } from "@/hooks/useSEO";
import { getSEOConfig } from "@/config/seo";

export default function Blog() {
  // SEO para página de blog
  useSEO(getSEOConfig('/blog'));
  return (
    <div>
      <HomeNavbar />
      <InputPesquisa />
      <ContentBlog />
      <HomeFooter />
    </div>
  );
}