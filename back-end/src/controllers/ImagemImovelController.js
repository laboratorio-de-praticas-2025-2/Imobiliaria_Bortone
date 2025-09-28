import multer from 'multer';
import path from 'path';
<<<<<<< HEAD
import crypto from 'crypto'; // Importa o módulo crypto
import * as ImagemImovelService from '../services/ImagemImovelService.js';

// Configuração do Multer para armazenamento de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../front-end/public/images/imoveis/'); // Onde as imagens serão salvas
=======
import crypto from 'crypto'; 
import fs from 'fs';
import * as ImagemImovelService from '../services/ImagemImovelService.js';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Salvar diretamente no diretório public/images/imoveis do front-end
    const uploadPath = path.join(process.cwd(), '../front-end/public/images/imoveis');
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath); 
>>>>>>> origin/develop
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname); // Obtém a extensão original do arquivo
    const newFilename = crypto.randomBytes(16).toString('hex') + extname; // Gera um nome único
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

export const uploadImage = (req, res) => {
  upload.single('imagem')(req, res, async (err) => {
    if (err) {
      console.error("Erro no upload da imagem:", err);
<<<<<<< HEAD
      return res.status(500).json({ error: "Erro ao fazer upload da imagem." });
    }

    if (!req.file) {
=======
      return res.status(500).json({ 
        error: "Erro ao fazer upload da imagem.", 
        details: err.message 
      });
    }

    if (!req.file) {
      console.error("Nenhum arquivo de imagem enviado. req.body:", req.body);
>>>>>>> origin/develop
      return res.status(400).json({ error: "Nenhum arquivo de imagem enviado." });
    }

    const { imovel_id, descricao } = req.body;
<<<<<<< HEAD

    if (!imovel_id || !descricao) {
      return res.status(400).json({ error: "Campos obrigatórios: imovel_id, descricao." });
    }

    try {
      const url_imagem = `/images/imoveis/${req.file.filename}`; // Caminho onde a imagem foi salva
      const novaImagem = await ImagemImovelService.createImagem({
        imovel_id: parseInt(imovel_id),
        url_imagem,
        descricao,
      });
      res.status(201).json(novaImagem);
    } catch (error) {
      console.error("Erro ao salvar informações da imagem no banco de dados:", error);
      res.status(500).json({ error: "Erro interno do servidor ao salvar imagem." });
=======
    console.log("Upload request body:", { imovel_id, descricao });
    console.log("Upload file info:", req.file);

    if (!imovel_id) {
      return res.status(400).json({ error: "Campo obrigatório: imovel_id." });
    }

    try {
      // Armazenar URL relativa para o front-end acessar
      const url_imagem = `/images/imoveis/${req.file.filename}`;
      const novaImagem = await ImagemImovelService.createImagem({
        imovel_id: parseInt(imovel_id),
        url_imagem,
        descricao: descricao || "Imagem do imóvel",
      });
      console.log("Imagem salva com sucesso:", novaImagem);
      res.status(201).json(novaImagem);
    } catch (error) {
      console.error("Erro ao salvar informações da imagem no banco de dados:", error);
      res.status(500).json({ 
        error: "Erro interno do servidor ao salvar imagem.", 
        details: error.message 
      });
>>>>>>> origin/develop
    }
  });
};

export const deleteImage = async (req, res) => {
  const { id } = req.params;
  try {
<<<<<<< HEAD
    const deleted = await ImagemImovelService.deleteImagem(id);
    if (!deleted) {
      return res.status(404).json({ error: "Imagem não encontrada." });
    }
=======
    // Primeiro buscar a imagem para obter o caminho do arquivo
    const imagem = await ImagemImovelService.getImageById(id);
    if (!imagem) {
      return res.status(404).json({ error: "Imagem não encontrada." });
    }

    // Extrair o nome do arquivo da URL
    const filename = path.basename(imagem.url_imagem);
    const filePath = path.join(process.cwd(), '../front-end/public/images/imoveis', filename);

    // Deletar o arquivo físico se existir
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Deletar o registro do banco
    const deleted = await ImagemImovelService.deleteImagem(id);
    if (!deleted) {
      return res.status(404).json({ error: "Erro ao excluir imagem do banco de dados." });
    }
    
>>>>>>> origin/develop
    res.status(200).json({ message: "Imagem excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir imagem:", error);
    res.status(500).json({ error: "Erro interno do servidor ao excluir imagem." });
  }
};

export const getImageById = async (req, res) => {
  const { id } = req.params;
  try {
    const image = await ImagemImovelService.getImageById(id);
    if (!image) {
      return res.status(404).json({ error: "Imagem não encontrada." });
    }
    res.status(200).json(image);
  } catch (error) {
    console.error("Erro ao buscar imagem por ID:", error);
    res.status(500).json({ error: "Erro interno do servidor ao buscar imagem." });
  }
};

export const getImagesByImovelId = async (req, res) => {
  const { imovelId } = req.params;
  try {
    const images = await ImagemImovelService.getImagesByImovelId(imovelId);
    if (!images || images.length === 0) {
      return res.status(404).json({ error: "Nenhuma imagem encontrada para este imóvel." });
    }
    res.status(200).json(images);
  } catch (error) {
    console.error("Erro ao buscar imagens por ID do imóvel:", error);
    res.status(500).json({ error: "Erro interno do servidor ao buscar imagens do imóvel." });
  }
<<<<<<< HEAD
=======
};

// Função alternativa para criar imagem apenas com URL (sem upload)
export const createImageFromUrl = async (req, res) => {
  try {
    const { imovel_id, url_imagem, descricao } = req.body;

    if (!imovel_id || !url_imagem) {
      return res.status(400).json({ error: "Campos obrigatórios: imovel_id, url_imagem." });
    }

    const novaImagem = await ImagemImovelService.createImagem({
      imovel_id: parseInt(imovel_id),
      url_imagem,
      descricao: descricao || "Imagem do imóvel",
    });

    console.log("Imagem criada com sucesso:", novaImagem);
    res.status(201).json(novaImagem);
  } catch (error) {
    console.error("Erro ao criar imagem:", error);
    res.status(500).json({ 
      error: "Erro interno do servidor ao criar imagem.", 
      details: error.message 
    });
  }
>>>>>>> origin/develop
};