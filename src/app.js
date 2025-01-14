import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import fileManager from "./manager/fileManager.js";

const app = express();
const PUERTO = 8080;

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

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
const httpServer = app.listen(PUERTO, () => {
  console.log("Escuchando el puerto:", PUERTO);
});

//WEBSOCKET

const { ProductManager } = fileManager;
const manager = new ProductManager("./src/data/products.json");

// Inicializar Socket.IO después de crear el servidor
const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("conectado un cliente");

  // Enviar productos iniciales
  try {
    const productos = await manager.getProducts();
    console.log("Enviando productos:", productos);

    socket.emit("productos", productos);
  } catch (error) {
    console.error("Error al enviar productos:", error);
  }

  // Escuchar evento de nuevo producto
  socket.on("agregarProducto", async (producto) => {
    console.log("Producto recibido en servidor", producto);
    try {
      const productos = await manager.getProducts();
      productos.push(producto);
      await manager.writeFile(productos);

      // Emitir la lista actualizada a todos los clientes
      io.emit("productos", await manager.getProducts());
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  });

  // Enviar productos iniciales
  socket.emit("productos", await manager.getProducts());

  //elimnar producto
  socket.on("eliminarProducto", async (id) => console.log(id));
});
