import express from "express";
import bannerController from "../controllers/bannerController.js";

const bannerRoutes = express.Router();

// rotas
bannerRoutes.get("/", bannerController.getAllBanners);

// rota toggle
bannerRoutes.put("/toggle/:id", bannerController.toggleBannerStatus);

// rotas genéricas
bannerRoutes.get("/:id", bannerController.getBannerById);
bannerRoutes.post("/", bannerController.createBanner);
bannerRoutes.put("/:id", bannerController.updateBanner);
bannerRoutes.delete("/:id", bannerController.deleteBanner);

export default bannerRoutes;
