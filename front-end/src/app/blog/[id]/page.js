"use client";
import ShareButton from "@/components/blog/ShareButton";
import HomeFooter from "@/components/home/HomeFooter";
import HomeNavbar from "@/components/home/HomeNavbar";
import { Image, Spin } from "antd";
import { useParams } from "next/navigation";
import { useSEO } from "@/hooks/useSEO";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ContentBlog() {
  const { id } = useParams(); // pega o id da URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiImage, setApiImage] = useState("");

  // Busca real no backend
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV !== "production" ? "http://localhost:4000" : "");
        const apiUrl = (rawApiUrl || "").replace(/\/api\/?$/, "");
        const resp = await axios.get(`${apiUrl}/publicacoes/${id}`);
        const data = resp.data;
        
        // Normalizar URL da imagem com mesmo padrão do Cards.js
        let img = "";
        if (data?.url_imagem) {
          let imageUrl = data.url_imagem;
          
          // Se não começar com /, adicionar prefixo padrão para imagens de blog
          if (!imageUrl.startsWith("/")) {
            imageUrl = `/images/blogImages/${imageUrl}`;
          }
          
          // Se for caminho relativo /images/... e existir NEXT_PUBLIC_API_URL, monta URL absoluta
          if (imageUrl.startsWith("/images/") && apiUrl) {
            img = `${apiUrl}${imageUrl}`;
          } else {
            img = imageUrl;
          }
        }
        
        setApiImage(img || "/404.png");
        setPost(data);
      } catch (e) {
        console.error("Erro ao carregar artigo:", e);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useSEO({
    title: post?.titulo || "Post do Blog",
    description: post?.conteudo?.substring(0, 160) || "Leia nosso post sobre imóveis e mercado imobiliário.",
    keywords: "blog, imóveis, mercado imobiliário, dicas, notícias",
    url: `https://imobiliaria-bortone.vercel.app/blog/${id}`,
    image: apiImage,
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
            src={apiImage}
            alt="Imagem do artigo"
            width="100%"
            className="w-screen md:w-full max-h-[500px] object-cover rounded-none md:!rounded-[25px]"
            onError={() => {
              setApiImage("/404.png");
            }}
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
