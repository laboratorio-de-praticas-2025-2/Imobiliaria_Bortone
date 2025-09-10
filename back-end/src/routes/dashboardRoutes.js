import dashboardController from "../controllers/dashboardController.js";
import express from "express";

const router = express.Router();

router.get("/dashboard", dashboardController.findInfosDashboard);

export default router;
