"use client";
import { Card, Col, ConfigProvider, Pagination, Row } from "antd";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Cards({ searchTerm = "" }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7; // 7 cards por página
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPosts = posts.slice(startIndex, startIndex + pageSize);

  const buildImage = (apiUrl, url) => {
    if (!url) return "/404.png"; // Fallback image
    
    // Normalizar URL da imagem
    let imageUrl = url;
    
    // Se não começar com /, adicionar prefixo padrão para imagens de blog
    if (!imageUrl.startsWith("/")) {
      imageUrl = `/images/blogImages/${imageUrl}`;
    }
    
    // Se for caminho relativo /images/... e existir NEXT_PUBLIC_API_URL, monta URL absoluta
    if (imageUrl.startsWith("/images/") && apiUrl) {
      return `${apiUrl}${imageUrl}`;
    }
    
    return imageUrl;
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV !== "production" ? "http://localhost:4000" : "");
        const apiUrl = (rawApiUrl || "").replace(/\/api\/?$/, "");
        const params = new URLSearchParams();
        
        // Adiciona parâmetro de busca se houver termo
        if (searchTerm && searchTerm.trim()) {
          params.append("titulo", searchTerm.trim());
        }
        
        // Busca todos os registros - força limite alto para pegar todos
        params.append("limit", "1000"); // Limite alto para pegar todos
        const url = `${apiUrl}/publicacoes?${params.toString()}`;
        const resp = await axios.get(url);
        const data = resp.data?.data || resp.data || [];
        const mapped = data.map((p) => ({
          ...p,
          url_imagem: buildImage(apiUrl, p.url_imagem),
        }));
        setPosts(mapped);
        setTotalItems(mapped.length);
      } catch (e) {
        console.error("Erro ao carregar posts do blog:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentPage, searchTerm]);

  // Reset página quando termo de busca muda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return <div className="text-center text-[var(--primary)]">Carregando posts...</div>;
  }

  return (
    <div>
      {/* Primeiro post destacado */}
      {paginatedPosts.length > 0 && (
        <Row gutter={[16, 16]} className="mb-10">
          <Col span={24}>
            <ConfigProvider
              theme={{
                components: {
                  Card: {
                    bodyPadding: 0,
                    borderRadiusLG: 25,
                  },
                },
              }}
            >
              <Link href={`/blog/${paginatedPosts[0].id}`}>
                <Card hoverable>
                  <div className="relative h-120 rounded-3xl overflow-hidden group">
                    {/* Imagem com filtro */}
                    <div className="absolute inset-0">
                      <Image
                        src={paginatedPosts[0].url_imagem}
                        alt={paginatedPosts[0].titulo}
                        fill
                        className="object-cover brightness-80 group-hover:brightness-60 group-hover:saturate-70 group-hover:blur-10 transition-all duration-300"
                        onError={(e) => {
                          e.target.src = "/404.png";
                        }}
                      />
                    </div>
                    {/* Conteúdo sobreposto sem filtro */}
                    <div className="relative z-10 p-6 py-10 flex flex-col justify-end h-full">
                      <h2 className="text-white font-bold md:text-3xl text-xl lemon-milk">
                        {paginatedPosts[0].titulo}
                      </h2>
                      <p className="text-white text-[16px] lemon-milk">
                        {paginatedPosts[0].data_publicacao}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </ConfigProvider>
          </Col>
        </Row>
      )}

      {/* Restante dos posts em 2 colunas */}
      <Row gutter={[38, 28]}>
        {paginatedPosts.slice(1).map((post) => (
          <Col xs={24} sm={12} key={post.id}>
            <ConfigProvider
              theme={{
                components: {
                  Card: {
                    bodyPadding: 0, // aqui funciona
                    borderRadiusLG: 25,
                  },
                },
              }}
            >
              <Link href={`/blog/${post.id}`}>
                <Card hoverable>
                  <div className="relative h-130 rounded-3xl overflow-hidden group">
                    {/* Imagem com filtro */}
                    <div className="absolute inset-0">
                      <Image
                        src={post.url_imagem}
                        alt={post.titulo}
                        fill
                        className="object-cover brightness-80 group-hover:brightness-60 group-hover:saturate-70 transition-all duration-300"
                        onError={(e) => {
                          e.target.src = "/404.png";
                        }}
                      />
                    </div>
                    {/* Conteúdo sobreposto sem filtro */}
                    <div className="relative z-10 p-6 py-10 flex flex-col justify-end h-full">
                      <h2 className="text-white font-bold md:text-3xl text-xl lemon-milk">
                        {post.titulo}
                      </h2>
                      <p className="text-white text-[16px] lemon-milk">
                        {post.data_publicacao}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </ConfigProvider>
          </Col>
        ))}
      </Row>
      <div className="flex justify-center mt-10">
        <ConfigProvider
          theme={{
            token: {
              fontSize: 16,
              borderRadius: 50,
            },
            components: {
              Pagination: {
                itemSize: 40,
                itemBg: "#ffffff",
                colorBorder: "#304383",
                colorText: "#304383",
                itemActiveBg: "#304383",
                itemActiveColor: "#ffffff",
                itemLinkBg: "#ffffff",
                itemLinkColor: "#304383",
                itemLinkBorderColor: "transparent",
              },
            },
          }}
        >
          <Pagination
            className="custom-pagination"
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={(page) => setCurrentPage(page)}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
