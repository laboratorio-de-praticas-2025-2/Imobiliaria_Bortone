import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { 
  createArtigo, 
  getAllArtigos, 
  getArtigoById, 
  updateArtigo, 
  deleteArtigo 
} from "../controllers/blogController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../../front-end/public/images/blogImages');
    
    // Garantir que o diretório existe
    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
        console.log('Diretório blogImages criado:', uploadPath);
      }
    } catch (e) {
      console.error('Erro ao garantir diretório blogImages:', e);
      return cb(e);
    }
    
    console.log("Multer destination:", uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    console.log("Multer filename:", filename);
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const blogRoutes = Router();

blogRoutes.get("/", getAllArtigos);

blogRoutes.get("/:id", getArtigoById);

blogRoutes.post("/", upload.single("url_imagem"), createArtigo);

blogRoutes.put("/:id", upload.single("url_imagem"), updateArtigo);

blogRoutes.delete("/:id", deleteArtigo);

export default blogRoutes;