import dashboardController from "../controllers/dashboardController.js";
import express from "express";

const dashboardRouter = express.Router();

dashboardRouter.get("/", dashboardController.findInfosDashboard);

export default dashboardRouter;
