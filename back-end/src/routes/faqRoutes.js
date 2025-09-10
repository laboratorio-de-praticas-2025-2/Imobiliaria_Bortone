import express from "express";
import faqController from "../controllers/faqController.js";

const faqRoutes = express.Router();

faqRoutes.get("/", faqController.getAllFaqs);
faqRoutes.post("/", faqController.createFaq);
faqRoutes.put("/:id", faqController.updateFaq);
faqRoutes.delete("/:id", faqController.deleteFaq);
faqRoutes.get("/:id", faqController.getFaqById);

export default faqRoutes;