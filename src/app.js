import dotenv from "dotenv";
dotenv.config();

import express from "express";
import handlebars from "express-handlebars";
import "./database.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";

//importar la config del passport
import { initializePassportStrategies } from "./config/passport.config.js";

//importar routers
import productsRouter from "./routes/products.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import passwordRouter from "./routes/password.router.js";

const app = express();
const PUERTO = process.env.PORT || 3000;

//Express handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));
app.use(cookieParser());

// Configuración de express-session
app.use(
  session({
    secret: process.env.JWT_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    },
  })
);

//iniciar passport
initializePassportStrategies();
app.use(passport.initialize());
app.use(passport.session());

//rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);
app.use("/api/password", passwordRouter);

//iniciar servidor
app.listen(PUERTO, () => {
  console.log("Escuchando el puerto:", PUERTO);
  console.log("http://localhost:" + PUERTO);
});

/** NOTAS 
  * Arquitectura Profesional:
  Aplicar una arquitectura más profesional en el servidor, utilizando patrones de diseño, manejo de variables de entorno y técnicas avanzadas como mailing.


  * Mejora en la Lógica de Compra:
  Profundizar en los roles de los usuarios y las autorizaciones aplicables a cada rol en el contexto de las compras dentro del ecommerce.
 */
