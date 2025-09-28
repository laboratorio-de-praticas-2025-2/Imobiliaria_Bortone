import express from "express";
const userRoutes = express.Router();
import userController from "../controllers/userController.js";

<<<<<<< HEAD
=======



>>>>>>> origin/develop
userRoutes.post("/register", userController.createUser);

userRoutes.post("/login", userController.loginUser);

<<<<<<< HEAD
=======
// Rota para cadastro de usuário CMS
userRoutes.post("/cms-register", userController.createCmsUser);
userRoutes.get("/users", userController.getUsers);
userRoutes.get("/user/:id", userController.getUserById);
userRoutes.patch("/user/:id", userController.updateUser);
userRoutes.delete("/user/:id", userController.deleteUser);


>>>>>>> origin/develop
export default userRoutes;