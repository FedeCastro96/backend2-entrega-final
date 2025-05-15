import CartRepository from "../repositories/cart.repository.js";
import ProductModel from "../dao/models/product.model.js";

//Manager para manejar la lógica de negocio de carritos
class CartManager {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  //Crea un nuevo carrito vacío
  async crearCarrito() {
    try {
      const nuevoCarrito = await this.cartRepository.create();
      return nuevoCarrito;
    } catch (error) {
      console.error(`Error al crear el carrito: ${error.message}`);
      throw new Error(`No se pudo crear el carrito: ${error.message}`);
    }
  }

  //Busca un carrito por su ID
  async getCarritoById(cartId) {
    try {
      const carrito = await this.cartRepository.findById(cartId);
      if (!carrito) {
        console.warn(`No se encontró el carrito con ID: ${cartId}`);
        return null;
      }
      return carrito;
    } catch (error) {
      console.error(`Error al buscar carrito: ${error.message}`);
      throw new Error(`No se pudo obtener el carrito: ${error.message}`);
    }
  }

  //Agrega un producto al carrito
  async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
    try {
      const carrito = await this.cartRepository.addProduct(
        cartId,
        productId,
        quantity
      );
      if (!carrito) {
        console.warn(
          `No se pudo agregar el producto ${productId} al carrito ${cartId}`
        );
        return null;
      }
      return carrito;
    } catch (error) {
      console.error(`Error al agregar producto al carrito: ${error.message}`);
      throw new Error(
        `No se pudo agregar el producto al carrito: ${error.message}`
      );
    }
  }

  //Elimina un producto del carrito
  async eliminarProductoDelCarrito(cartId, productId) {
    try {
      const carrito = await this.cartRepository.removeProduct(
        cartId,
        productId
      );
      if (!carrito) {
        console.warn(
          `No se pudo eliminar el producto ${productId} del carrito ${cartId}`
        );
        return null;
      }
      return carrito;
    } catch (error) {
      console.error(`Error al eliminar producto del carrito: ${error.message}`);
      throw new Error(
        `No se pudo eliminar el producto del carrito: ${error.message}`
      );
    }
  }

  //Actualiza todos los productos del carrito
  async actualizarCarrito(cartId, updatedProducts) {
    try {
      const carrito = await this.cartRepository.updateCart(
        cartId,
        updatedProducts
      );
      if (!carrito) {
        console.warn(`No se pudo actualizar el carrito ${cartId}`);
        return null;
      }
      return carrito;
    } catch (error) {
      console.error(`Error al actualizar carrito: ${error.message}`);
      throw new Error(`No se pudo actualizar el carrito: ${error.message}`);
    }
  }

  //Actualiza la cantidad de un producto en el carrito
  async actualizarCantidadDeProducto(cartId, productId, newQuantity) {
    try {
      const carrito = await this.cartRepository.updateProductQuantity(
        cartId,
        productId,
        newQuantity
      );
      if (!carrito) {
        console.warn(
          `No se pudo actualizar la cantidad del producto ${productId} en el carrito ${cartId}`
        );
        return null;
      }
      return carrito;
    } catch (error) {
      console.error(
        `Error al actualizar cantidad del producto: ${error.message}`
      );
      throw new Error(
        `No se pudo actualizar la cantidad del producto: ${error.message}`
      );
    }
  }

  //Vacía el carrito eliminando todos los productos
  async vaciarCarrito(cartId) {
    try {
      const carrito = await this.cartRepository.clearCart(cartId);
      if (!carrito) {
        console.warn(`No se pudo vaciar el carrito ${cartId}`);
        return null;
      }
      return carrito;
    } catch (error) {
      console.error(`Error al vaciar carrito: ${error.message}`);
      throw new Error(`No se pudo vaciar el carrito: ${error.message}`);
    }
  }

  //Procesa la compra del carrito
  async procesarCompra(cartId) {
    try {
      const carrito = await this.cartRepository.findById(cartId);
      if (!carrito) {
        return {
          status: "error",
          message: "Carrito no encontrado",
        };
      }

      if (!carrito.products || carrito.products.length === 0) {
        return {
          status: "error",
          message: "El carrito está vacío",
        };
      }

      // Verificar stock y actualizar productos
      const productosSinStock = [];
      const productosActualizados = [];

      for (const item of carrito.products) {
        const producto = await ProductModel.findById(item.product);

        if (!producto) {
          productosSinStock.push({
            id: item.product,
            title: "Producto no encontrado",
          });
          continue;
        }

        if (producto.stock < item.quantity) {
          productosSinStock.push({
            id: producto._id,
            title: producto.title,
          });
          continue;
        }

        // Actualizar stock
        producto.stock -= item.quantity;
        await producto.save();
        productosActualizados.push({
          id: producto._id,
          title: producto.title,
          quantity: item.quantity,
        });
      }

      // Si hay productos sin stock, devolver error
      if (productosSinStock.length > 0) {
        return {
          status: "error",
          message: "Algunos productos no tienen stock suficiente",
          productosSinStock,
        };
      }

      // Vaciar el carrito después de procesar la compra
      const carritoVaciado = await this.vaciarCarrito(cartId);

      return {
        status: "success",
        message: "Compra procesada exitosamente",
        productosComprados: productosActualizados,
        cart: carritoVaciado,
      };
    } catch (error) {
      console.error(`Error al procesar la compra: ${error.message}`);
      return {
        status: "error",
        message: error.message,
      };
    }
  }
}

export default CartManager;
