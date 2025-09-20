import express from "express";
import blogController from "../controllers/blogController.js";

const blogRoutes = express.Router();

blogRoutes.get("/blogs", blogController.getAllArtigos);
blogRoutes.get("/blogs/:id", blogController.getArtigoById);
blogRoutes.post("/blogs", blogController.createArtigo);
blogRoutes.put("/blogs/:id", blogController.updateArtigo);
blogRoutes.delete("/blogs/:id", blogController.deleteArtigo);

export default blogRoutes;
