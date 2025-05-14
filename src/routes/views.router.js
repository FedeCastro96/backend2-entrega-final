import express from "express";
import {
  checkAuth,
  redirectIfLoggedIn,
  requireAuth,
} from "../middlewares/auth.middleware.js";
import ProductManager from "../managers/product-manager-db.js";
import CartManager from "../managers/cart-manager-db.js";

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

//Ruta principal - redirige a productos
router.get("/", (req, res) => {
  res.redirect("/products");
});

//Rutas de autenticación
router.get("/register", redirectIfLoggedIn, (req, res) => {
  res.render("register");
});

router.get("/login", redirectIfLoggedIn, (req, res) => {
  const message = req.query.message;
  res.render("login", { message });
});

router.get("/profile", requireAuth, (req, res) => {
  res.render("profile");
});

router.get("/products", checkAuth, async (req, res) => {
  try {
    const result = await productManager.getProducts();
    // Convertir los documentos de Mongoose a objetos planos
    const productos = result.docs.map((doc) => doc.toObject());

    res.render("products", {
      productos: productos,
      isAdmin: req.user.role === "admin",
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      currentPage: result.page,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/carts/:cid", checkAuth, async (req, res) => {
  const cartId = req.params.cid;

  try {
    const carrito = await cartManager.getCarritoById(cartId);

    if (!carrito) {
      console.log("No existe ese carrito con el id");
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productosEnCarrito = carrito.products.map((item) => ({
      product: item.product.toObject(),
      quantity: item.quantity,
    }));

    // Calcular el total del carrito
    const total = productosEnCarrito.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    res.render("carts", {
      productos: productosEnCarrito,
      total: total.toFixed(2),
    });
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});

router.get("/reset-password/:token", (req, res) => {
  res.render("reset-password");
});

export default router;
