"use client";
import { postsData } from "@/mock/posts";
import { Card, Col, ConfigProvider, Pagination, Row } from "antd";
import Link from "next/link";
import { useState } from "react";

export default function Cards() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7; // 7 cards por página
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPosts = postsData.slice(startIndex, startIndex + pageSize);

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
                    <div
                      className="absolute inset-0 bg-cover bg-center brightness-80  group-hover:brightness-60 group-hover:saturate-70 group-hover:blur-10  transition-all duration-300 "
                      style={{
                        backgroundImage: `url(${paginatedPosts[0].image})`,
                      }}
                    />
                    {/* Conteúdo sobreposto sem filtro */}
                    <div className="relative z-10 p-6 py-10 flex flex-col justify-end h-full">
                      <h2 className="text-white font-bold md:text-3xl text-xl lemon-milk">
                        {paginatedPosts[0].title}
                      </h2>
                      <p className="text-white text-[16px] lemon-milk">
                        {paginatedPosts[0].date}
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
                    <div
                      className="absolute inset-0 bg-cover bg-center brightness-80  group-hover:brightness-60 group-hover:saturate-70 transition-all duration-300"
                      style={{ backgroundImage: `url(${post.image})` }}
                    />
                    {/* Conteúdo sobreposto sem filtro */}
                    <div className="relative z-10 p-6 py-10 flex flex-col justify-end h-full">
                      <h2 className="text-white font-bold md:text-3xl text-xl lemon-milk">
                        {post.title}
                      </h2>
                      <p className="text-white text-[16px] lemon-milk">
                        {post.date}
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
            total={postsData.length}
            onChange={(page) => setCurrentPage(page)}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
