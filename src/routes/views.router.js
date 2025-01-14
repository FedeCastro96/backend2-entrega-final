import { Router } from "express";
const router = Router();

import fileManager from "../manager/fileManager.js";
const { ProductManager } = fileManager;
const manager = new ProductManager("./src/data/products.json");

//PRimer punto: enviar productos al home.handlebars

router.get("/products", async (req, res) => {
  try {
    const productos = await manager.getProducts();
    res.render("home", { productos });
  } catch (error) {
    console.error("error al obtener productos:", error);
    res.status(500).render("error", {
      message: "Error al cargar los productos",
      error: error.message,
    });
  }
});

//segundo punto
router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

export default router;
