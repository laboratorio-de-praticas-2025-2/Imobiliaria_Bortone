import Sequelize from "sequelize";

const connection = new Sequelize({
  dialect: "mysql",
  host: "mysql-lp-imobiliaria.alwaysdata.net",
  user: "Utilizar o user disponibilizado pelo PM do seu produto",
  password: "Utilizar a senha disponibilizada pelo PM do seu produto",
  database: "lp-imobiliaria_dev",
});

export default connection;
