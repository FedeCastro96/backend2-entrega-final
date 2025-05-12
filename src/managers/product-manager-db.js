import ProductRepository from "../repositories/product.repository.js";

//Manager para manejar la lógica de negocio de productos
class ProductManager {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  //Agrega un nuevo producto a la base de datos
  async addProduct({
    title,
    description,
    price,
    image,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      //Verificar campos obligatorios
      if (!title || !description || !price || !code || !stock || !category) {
        console.error("Faltan campos obligatorios en el producto");
        throw new Error("Todos los campos son obligatorios");
      }

      //Verificar si el código ya existe
      const existeProducto = await this.productRepository.findByCode(code);
      if (existeProducto) {
        console.warn(`Ya existe un producto con el código: ${code}`);
        throw new Error(`El código ${code} ya está en uso`);
      }

      //Imagen por defecto si no se proporciona una
      const defaultImage = "https://via.placeholder.com/300x200?text=No+Image";
      const productImage = image || defaultImage;

      // Crear objeto del producto para guardar
      const productData = {
        title,
        description,
        price,
        img: productImage,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || [],
      };

      // Guardar el nuevo producto usando el repositorio
      return await this.productRepository.create(productData);
    } catch (error) {
      console.error(`Error al agregar producto: ${error.message}`);
      throw new Error(`No se pudo agregar el producto: ${error.message}`);
    }
  }

  //Obtiene productos con paginación y filtros
  async getProducts(options = {}) {
    try {
      return await this.productRepository.findAll(options);
    } catch (error) {
      console.error(`Error al obtener productos: ${error.message}`);
      throw new Error(`No se pudieron obtener los productos: ${error.message}`);
    }
  }

  //Busca un producto por su ID
  async getProductById(id) {
    try {
      const producto = await this.productRepository.findById(id);

      if (!producto) {
        console.warn(`Producto no encontrado con ID: ${id}`);
        return null;
      }

      return producto;
    } catch (error) {
      console.error(`Error al buscar producto por ID: ${error.message}`);
      throw new Error(`No se pudo obtener el producto: ${error.message}`);
    }
  }

  //Actualiza los datos de un producto
  async updateProduct(id, productoActualizado) {
    try {
      const actualizado = await this.productRepository.update(
        id,
        productoActualizado
      );

      if (!actualizado) {
        console.warn(`Producto no encontrado para actualizar con ID: ${id}`);
        return null;
      }

      return actualizado;
    } catch (error) {
      console.error(`Error al actualizar producto: ${error.message}`);
      throw new Error(`No se pudo actualizar el producto: ${error.message}`);
    }
  }

  //Elimina un producto
  async deleteProduct(id) {
    try {
      const eliminado = await this.productRepository.delete(id);

      if (!eliminado) {
        console.warn(`Producto no encontrado para eliminar con ID: ${id}`);
        return null;
      }

      return eliminado;
    } catch (error) {
      console.error(`Error al eliminar producto: ${error.message}`);
      throw new Error(`No se pudo eliminar el producto: ${error.message}`);
    }
  }
}

export default ProductManager;
