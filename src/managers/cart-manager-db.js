import CartRepository from "../repositories/cart.repository.js";

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
}

export default CartManager;
