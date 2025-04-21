import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  throw new Error("DB_URL is not defined in environment variables");
}

mongoose
  .connect(DB_URL)
  .then(() => console.log("Conexión exitosa con la base de datos"))
  .catch((error) => {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  });
