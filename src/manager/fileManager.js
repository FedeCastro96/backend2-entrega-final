// fileManager.js
import { promises as fs } from "fs";

class FileManager {
  constructor(path) {
    this.path = path; // Constructor que recibe la ruta del archivo a manejar
  }

  async readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8"); // Lee el archivo
      return JSON.parse(data); // Convierte el JSON en objeto de JavaScript
    } catch (error) {
      if (error.code === "ENOENT") {
        // Si el archivo no existe,...
        return []; //retornamos un array vacío
      }
      throw error;
    }
  }

  async writeFile(data) {
    try {
      await fs.writeFile(this.path, JSON.stringify(data, null, 2)); // Escribe los datos en el archivo
    } catch (error) {
      throw error;
    }
  }
}

class ProductManager extends FileManager {
  async getProducts() {
    return this.readFile();
  }

  // Agregamos el nuevo método aquí
  async addProduct(productData) {
    try {
      const products = await this.getProducts();

      // Validaciones
      if (
        !productData.title ||
        !productData.description ||
        !productData.price ||
        !productData.category ||
        !productData.code ||
        !productData.stock
      ) {
        throw new Error("Todos los campos son obligatorios");
      }

      // Verificar si el código ya existe
      const existingProduct = products.find((p) => p.code === productData.code);
      if (existingProduct) {
        throw new Error("Ya existe un producto con ese código");
      }

      // Generar ID
      const id =
        products.length === 0 ? 1 : Math.max(...products.map((p) => p.id)) + 1;

      // Crear nuevo producto
      const newProduct = {
        id,
        ...productData,
        status: true,
        thumbnails: productData.thumbnails || [],
      };

      // Agregar y guardar
      products.push(newProduct);
      await this.writeFile(products);
      return newProduct;
    } catch (error) {
      throw error;
    }
  }
}

export default { FileManager, ProductManager };
