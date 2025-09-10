import express from "express";
import blogController from "../controllers/blogController.js";

const blogRoutes = express.Router();


blogRoutes.get("/blogs", blogController.getAllBlogs);
blogRoutes.get("/blogs/:id", blogController.getBlogById);
blogRoutes.post("/blogs", blogController.createBlog);
blogRoutes.put("/blogs/:id", blogController.updateBlog);
blogRoutes.delete("/blogs/:id", blogController.deleteBlog);

export default blogRoutes;
