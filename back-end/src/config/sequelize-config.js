import { Sequelize } from "sequelize";
import "dotenv/config";

const connection = new Sequelize({
  DB_DIALECT: process.env.DB_DIALECT,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_DATABASE: process.env.DB_DATABASE,
});

export default connection;
