import HomeNavbar from "@/components/home/HomeNavbar";
import InputPesquisa from "@/components/blog/InputPesquisa";
import ContentBlog from "@/components/blog/ContentBlog";
import HomeFooter from "@/components/home/HomeFooter";
export default function Blog() {
  return (
    <div>
        <HomeNavbar />
        <InputPesquisa />
        <ContentBlog />
        <HomeFooter />
    </div>
  )
}