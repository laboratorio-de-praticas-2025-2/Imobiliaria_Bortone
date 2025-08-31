// Configuração principal do Express (carrega rotas, middlewares, DB)

import express from "express";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "../public")));

app.use("/", routes);
app.use(errorHandler);

export default app;
