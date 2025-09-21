import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
getAllPublicidades,
getPublicidadeById,
createPublicidade,
updatePublicidade,
deletePublicidade
} from "../controllers/publicidadeController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do multer para publicidadeImages (front-end)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../../front-end/public/images/publicidadeImages');
    console.log('Multer destination:', uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log('Multer filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

const router = Router();

// Lista todas as publicidades
router.get("/", getAllPublicidades);

// Busca uma publicidade pelo ID
router.get("/:id", getPublicidadeById);

// Cria uma nova publicidade
router.post("/", upload.single('url_imagem'), createPublicidade);

// Atualiza uma publicidade existente
router.put("/:id", upload.single('url_imagem'), updatePublicidade);

// Remove uma publicidade
router.delete("/:id", deletePublicidade);

export default router;
