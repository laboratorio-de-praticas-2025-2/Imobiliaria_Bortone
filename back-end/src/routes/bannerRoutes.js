import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import bannerController from "../controllers/bannerController.js";

const bannerRoutes = express.Router();

// garante que a pasta exista
const dir = "./uploads/banners";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// configuração do storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// rotas
bannerRoutes.get("/", bannerController.getAllBanners);

// rota toggle
bannerRoutes.put("/toggle/:id", bannerController.toggleBannerStatus);

// rotas genéricas
bannerRoutes.get("/:id", bannerController.getBannerById);
bannerRoutes.post("/", upload.single("imagem"), bannerController.createBanner);
bannerRoutes.put("/:id", upload.single("imagem"), bannerController.updateBanner);
bannerRoutes.delete("/:id", bannerController.deleteBanner);

export default bannerRoutes;
