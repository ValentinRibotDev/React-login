require('dotenv').config();

//Creation d'une classe pool
const { Pool } = require("pg");

//Variable pour comparaison ci dessous
const isProduction = process.env.NODE_ENV === "production";

//Connexion enre pSQL BDD et notre app
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool ({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString
});

module.exports = { pool };