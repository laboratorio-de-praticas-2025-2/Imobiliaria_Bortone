import dashboardController from "../controllers/dashboardController.js";
import express from "express";

const dashboardRouter = express.Router();

router.get("/dashboard", dashboardController.findInfosDashboard);

export default dashboardRouter;
