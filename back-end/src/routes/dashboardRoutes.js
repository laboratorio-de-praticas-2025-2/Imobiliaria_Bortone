import dashboardController from "../controllers/dashboardController.js";
import express from "express";
const router = express.Router();
router.get("/dashboard", dashboardController.findInfoImoveis);
export default router;
