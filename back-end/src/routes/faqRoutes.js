import express from "express";
const faqRoutes = express.Router();
import faqController from "../controllers/faqController.js";

faqRoutes.get("/", faqController.getAllFaqs);
faqRoutes.post("/", faqController.createFaq);
faqRoutes.put("/:id", faqController.updateFaq);
faqRoutes.delete("/:id", faqController.deleteFaq);
faqRoutes.get("/:id", faqController.getFaqById);

export default faqRoutes;