// image-loader.js - Custom loader para evitar problemas com Sharp
export default function myImageLoader({ src, width, quality }) {
  // Retorna a URL da imagem sem processamento
  return src
}