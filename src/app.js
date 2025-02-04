import express from "express";
import { engine } from "express-handlebars";
import "./database.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const PUERTO = 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));

//Express handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas
//-->app.use: Se utiliza para montar middleware o routers y no depende de un método HTTP específico.
//-->app.get: Define un manejador para solicitudes con el método HTTP específico (GET) y una ruta exacta.

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//iniciar servidor
app.listen(PUERTO, () => {
  console.log("Escuchando el puerto:", PUERTO);
});
