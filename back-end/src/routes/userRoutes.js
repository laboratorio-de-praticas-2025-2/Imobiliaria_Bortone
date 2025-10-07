import express from "express";
const userRoutes = express.Router();
import userController from "../controllers/userController.js";




userRoutes.post("/register", userController.createUser);

userRoutes.post("/login", userController.loginUser);

// Rota para cadastro de usuário CMS
userRoutes.post("/cms-register", userController.createCmsUser);
userRoutes.get("/users", userController.getUsers);
userRoutes.get("/user/:id", userController.getUserById);
userRoutes.patch("/user/:id", userController.updateUser);
userRoutes.delete("/user/:id", userController.deleteUser);


export default userRoutes;