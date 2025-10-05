import { Router } from "express";
import { 
  createArtigo, 
  getAllArtigos, 
  getArtigoById, 
  updateArtigo, 
  deleteArtigo 
} from "../controllers/blogController.js";

const blogRoutes = Router();

blogRoutes.get("/", getAllArtigos);

blogRoutes.get("/:id", getArtigoById);

blogRoutes.post("/", createArtigo);

blogRoutes.put("/:id", updateArtigo);

blogRoutes.delete("/:id", deleteArtigo);

export default blogRoutes;