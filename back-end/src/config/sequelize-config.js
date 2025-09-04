import { Sequelize } from "sequelize";

const connection = new Sequelize(
  'lp-imobiliaria_dev', 
  '426814_dados',      
  'DSM-2C602y',        
  {
    host: 'mysql-lp-imobiliaria.alwaysdata.net', 
    dialect: 'mysql',
  }
);

export default connection;
