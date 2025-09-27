import express from "express";
const userRoutes = express.Router();
import userController from "../controllers/userController.js";

userRoutes.post("/register", userController.createUser);

userRoutes.post("/login", userController.loginUser);

userRoutes.get("/users", userController.getUsers);
userRoutes.get("/user/:id", userController.getUserById);
userRoutes.put("/user/:id", userController.updateUser);
userRoutes.delete("/user/:id", userController.deleteUser);


export default userRoutes;