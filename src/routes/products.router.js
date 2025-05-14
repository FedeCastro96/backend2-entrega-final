import express from "express";
import ProductManager from "../managers/product-manager-db.js";
import { checkAuth, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();
const productManager = new ProductManager();

//Recibe parámetros de consulta limit, page, sort, y query desde la URL.
//Usa estos parámetros para solicitar productos de la base de datos a través de productManager.getProducts.
// Responde con una lista de productos, paginación y enlaces a la página siguiente/anterior, o con un error si algo falla.
// Ejemplo: GET http://localhost:3000/products?limit=5&page=2&sort=asc
// GET http://localhost:Puerto/

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const productos = await productManager.getProducts({
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query,
    });

    res.json({
      status: "success",
      payload: productos,
      totalPages: productos.totalPages,
      prevPage: productos.prevPage,
      nextPage: productos.nextPage,
      page: productos.page,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      prevLink: productos.hasPrevPage
        ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}`
        : null,
      nextLink: productos.hasNextPage
        ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}`
        : null,
    });
  } catch (error) {
    console.error("Error al obtener productos", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

// 2) Traer solo un producto por id:  -------- GET http://localhost:3000/:pid
router.get("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    const producto = await productManager.getProductById(id);
    if (!producto) {
      return res.json({
        error: "Producto no encontrado",
      });
    }

    res.json(producto);
  } catch (error) {
    console.error("Error al obtener producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

// 3) Agregar nuevo producto ----------  POST http://localhost:3000/
router.post("/", checkAuth, isAdmin, async (req, res) => {
  try {
    const nuevoProducto = await productManager.addProduct(req.body);
    res.status(201).json({
      message: "Producto agregado exitosamente",
      producto: nuevoProducto,
    });
  } catch (error) {
    console.error("Error al agregar producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

// 4) Actualiczar por ID
router.put("/:pid", checkAuth, isAdmin, async (req, res) => {
  const id = req.params.pid;
  const productoActualizado = req.body;

  try {
    await productManager.updateProduct(id, productoActualizado);
    res.json({
      message: "Producto actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

// 5) Eliminar producto:
router.delete("/:pid", checkAuth, isAdmin, async (req, res) => {
  const id = req.params.pid;

  try {
    await productManager.deleteProduct(id);
    res.json({
      message: "Producto eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

export default router;
