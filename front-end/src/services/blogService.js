import "dotenv/config";
const url = process.env.NEXT_PUBLIC_API_URL;

export async function getAllArtigos(query = {}) {
  const queryString = new URLSearchParams(query).toString();
  const res = await fetch(`${url}/blogs?${queryString}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Erro ao buscar artigos");
  return res.json();
}

export async function getArtigoById(id) {
  const res = await fetch(`${url}/blogs/${id}`, { method: "GET" });
  if (!res.ok) throw new Error("Erro ao buscar artigo por ID");
  return res.json();
}

export async function createArtigo(data) {
  const res = await fetch(`${url}/blogs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar artigo");
  return res.json();
}

