// // fileManager.js
// import { promises as fs } from "fs";

// // Clase base para manejar archivos
// class FileManager {
//   constructor(path) {
//     this.path = path; //  Guarda la ruta del archivo que vamos a leer o escribir
//   }

//     // Método para leer el archivo
//   async readFile() {
//     try {
//       const data = await fs.readFile(this.path, "utf-8"); // Lee el archivo
//       return JSON.parse(data); // Convierte el JSON en objeto de JavaScript
//     } catch (error) {
//       if (error.code === "ENOENT") {
//         // Si el archivo no existe,...
//         return []; //retornamos un array vacío
//       }
//       throw error;
//     }
//   }
//   // Método para escribir en el archivo
//   async writeFile(data) {
//     try {
//       await fs.writeFile(this.path, JSON.stringify(data, null, 2));
//       // Convierte el objeto JavaScript a JSON (con formato legible) y lo guarda en el archivo
//     } catch (error) {
//       throw error;
//     }
//   }
// }
// // Clase para manejar productos, hereda de FileManager
// class ProductManager extends FileManager {
//     // Obtiene todos los productos del archivo
//   async getProducts() {
//     return this.readFile(); // Usa el método heredado de FileManager para leer el archivo
//   }

//   // Agrega un nuevo producto
//   async addProduct(productData) {
//     try {
//       const products = await this.getProducts(); // Obtiene la lista actual de productos

//       // Validaciones de campos obligatorios
//       if (
//         !productData.title ||
//         !productData.description ||
//         !productData.price ||
//         !productData.category ||
//         !productData.code ||
//         !productData.stock
//       ) {
//         throw new Error("Todos los campos son obligatorios");
//       }

//       // Verificar si ya existe un producto con el mismo código
//       const existingProduct = products.find((p) => p.code === productData.code);
//       if (existingProduct) {
//         throw new Error("Ya existe un producto con ese código");
//       }

//       // Generar un nuevo ID para el producto
//       const id =
//         products.length === 0 ? 1 : Math.max(...products.map((p) => p.id)) + 1;
//       // Si no hay productos, el ID es 1. Si hay productos, se toma el ID más alto y se suma 1.

//       // Crear el nuevo producto con todos los datos
//       const newProduct = {
//         id, // ID generado
//         ...productData, // Copia todos los datos del producto recibido
//         status: true, // Estado por defecto del producto (activo)
//         thumbnails: productData.thumbnails || [], // Si no se proporciona thumbnails, será un array vacío
//       };

//       // Agregar el nuevo producto al array y guardar en el archivo
//       products.push(newProduct);
//       await this.writeFile(products);// Guarda la lista actualizada en el archivo

//       return newProduct; // Devuelve el nuevo producto creado
//     } catch (error) {
//       throw error;
//     }
//   }
// }

// // Exportamos las clases para que puedan ser utilizadas en otros archivos
// export default { FileManager, ProductManager };
