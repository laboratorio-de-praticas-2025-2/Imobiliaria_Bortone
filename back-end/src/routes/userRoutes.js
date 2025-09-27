import express from "express";
const userRoutes = express.Router();
import userController from "../controllers/userController.js";

userRoutes.post("/register", userController.createUser);

userRoutes.post("/login", userController.loginUser);

export default userRoutes;