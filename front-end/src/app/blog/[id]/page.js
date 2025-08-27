"use client";
import { useParams } from "next/navigation";
import { postsData } from "@/constants/posts";
import HomeNavbar from "@/components/home/HomeNavbar";
import HomeFooter from "@/components/home/HomeFooter";
import { Image } from "antd";
export default function ContentBlog() {
    
  const { id } = useParams(); // pega o id da URL
  const post = postsData.find((p) => String(p.id) === id);

  if (!post) return <div>Post não encontrado.</div>;

  return (
    <div>
        <HomeNavbar />
            <div className="  py-8">
                {/* Títulos principais */}

                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 px-5 md:px-16">
                    <span className="text-[var(--primary)] lg:text-3xl text-[5.5vw] uppercase lemon-milk ">
                        {post.title}
                    </span>
                    <span className="text-[var(--primary)] lg:text-lg text-[3.8vw] uppercase lemon-milk ">
                        {post.date}
                    </span>
                </div>
                <hr className="border-t border-[#D7D7D7] py-5" />

                <div className="md:px-16">
                    <Image
                        src={post.image}
                        alt=""
                        width="100%"
                        className="w-screen md:w-full max-h-[500px] object-cover rounded-none md:!rounded-[25px] "
                    />
                </div>

                {/* Conteúdo do post */}
                <div className="prose max-w-none text-[20px] text-[var(--primary)] pt-10 px-4 md:px-16">
                {post.content}
                </div>
                
            </div>
                            <hr className="border-t border-[#D7D7D7] pb-5 " />

        <HomeFooter />
    </div>

  );
}
