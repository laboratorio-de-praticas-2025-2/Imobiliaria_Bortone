import express from "express";
import blogController from "../controllers/blogController.js";

const blogRoutes = express.Router();

<<<<<<< HEAD

=======
>>>>>>> 7f35f5114fedd39a00a363a8d7805432cf54a4f0
blogRoutes.get("/blogs", blogController.getAllArtigos);
blogRoutes.get("/blogs/:id", blogController.getArtigoById);
blogRoutes.post("/blogs", blogController.createArtigo);
blogRoutes.put("/blogs/:id", blogController.updateArtigo);
blogRoutes.delete("/blogs/:id", blogController.deleteArtigo);

export default blogRoutes;
