import { Sequelize } from "sequelize";
import "dotenv/config";

const connection = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: 3307,
    dialect: process.env.DB_DIALECT,
  }
);

export default connection;