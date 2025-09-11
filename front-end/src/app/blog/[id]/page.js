"use client";
import ShareButton from "@/components/blog/ShareButton";
import HomeFooter from "@/components/home/HomeFooter";
import HomeNavbar from "@/components/home/HomeNavbar";
import { postsData } from "@/mock/posts";
import { Image, Spin } from "antd";
import { useParams } from "next/navigation";
import { useSEO } from "@/hooks/useSEO";
import { useEffect, useState } from "react";

export default function ContentBlog() {
  const { id } = useParams(); // pega o id da URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Mockado: busca no array local
  useEffect(() => {
    if (!id) return;

    // Simula delay de chamada à API
    const timeout = setTimeout(() => {
      const foundPost = postsData.find((p) => String(p.id) === id);
      setPost(foundPost || null);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [id]);

  // 🔹 SEO dinâmico
  useSEO({
    title: post?.title || "Post do Blog",
    description:
      post?.excerpt ||
      post?.content?.substring(0, 160) ||
      "Leia nosso post sobre imóveis e mercado imobiliário.",
    keywords: "blog, imóveis, mercado imobiliário, dicas, notícias",
    url: `https://imobiliaria-bortone.vercel.app/blog/${id}`,
    image: post?.image,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!post) return <div>Post não encontrado.</div>;

  return (
    <div>
      <HomeNavbar />
      <div className="  py-8">
        {/* Títulos principais */}

        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 px-5 md:px-16">
          <span className="text-[var(--primary)] lg:text-3xl text-[5.5vw] uppercase lemon-milk ">
            {post.titulo}
          </span>
          <span className="text-[var(--primary)] lg:text-lg text-[3.8vw] uppercase lemon-milk ">
            {post.data_publicacao}
          </span>
        </div>
        <hr className="border-t border-[#D7D7D7] py-5" />

        <div className="md:px-16">
          <Image
            src={post.url_imagem}
            alt=""
            width="100%"
            className="w-screen md:w-full max-h-[500px] object-cover rounded-none md:!rounded-[25px]"
          />

          {/* ShareButton só em desktop, abaixo da imagem */}
          <div className="hidden md:flex justify-end pt-2">
            <ShareButton />
          </div>
        </div>

        {/* Conteúdo do post */}
        <div className="prose max-w-none text-[20px] text-[var(--primary)] md:pt-6 pt-10 px-4 md:px-16">
          {post.conteudo}
        </div>

        {/* ShareButton só em mobile, abaixo do conteúdo */}
        <div className="flex md:hidden justify-end px-4 mt-4">
          <ShareButton />
        </div>
      </div>
      <hr className="border-t border-[#D7D7D7] pb-5 " />
      <HomeFooter />
    </div>
  );
}
