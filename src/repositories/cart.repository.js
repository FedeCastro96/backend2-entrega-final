import CartModel from "../dao/models/cart.model.js";

//Repositorio para manejar las operaciones de carritos de compra

class CartRepository {
  //Crea un nuevo carrito vacío

  async create() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error.message}`);
    }
  }

  //Busca un carrito por su ID

  async findById(id) {
    try {
      const cart = await CartModel.findById(id);
      if (!cart) {
        throw new Error(`No se encontró ningún carrito con el ID: ${id}`);
      }
      return cart;
    } catch (error) {
      throw new Error(`Error al buscar carrito por ID: ${error.message}`);
    }
  }

  //Agrega un producto al carrito

  async addProduct(cartId, productId, quantity = 1) {
    try {
      const cart = await this.findById(cartId);

      if (!cart) {
        throw new Error(`No se encontró ningún carrito con el ID: ${cartId}`);
      }

      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingProductIndex >= 0) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      cart.markModified("products");
      await cart.save();

      return cart;
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }

  //Elimina un producto del carrito

  async removeProduct(cartId, productId) {
    try {
      const cart = await this.findById(cartId);

      if (!cart) {
        throw new Error(`No se encontró ningún carrito con el ID: ${cartId}`);
      }

      const initialLength = cart.products.length;
      cart.products = cart.products.filter(
        (item) => item.product._id.toString() !== productId
      );

      if (cart.products.length === initialLength) {
        throw new Error(
          `No se encontró el producto con ID: ${productId} en el carrito`
        );
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(
        `Error al eliminar producto del carrito: ${error.message}`
      );
    }
  }

  //Actualiza todos los productos del carrito

  async updateCart(cartId, updatedProducts) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error(`No se encontró ningún carrito con el ID: ${cartId}`);
      }

      cart.products = updatedProducts;
      cart.markModified("products");
      await cart.save();

      return cart;
    } catch (error) {
      throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
  }

  //Actualiza la cantidad de un producto en el carrito

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await this.findById(cartId);

      if (!cart) {
        throw new Error(`No se encontró ningún carrito con el ID: ${cartId}`);
      }

      const productIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === productId
      );

      if (productIndex === -1) {
        throw new Error(
          `No se encontró el producto con ID: ${productId} en el carrito`
        );
      }

      cart.products[productIndex].quantity = newQuantity;
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(
        `Error al actualizar cantidad del producto: ${error.message}`
      );
    }
  }

  //Vacía el carrito eliminando todos los productos

  async clearCart(cartId) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );

      if (!cart) {
        throw new Error(`No se encontró ningún carrito con el ID: ${cartId}`);
      }

      return cart;
    } catch (error) {
      throw new Error(`Error al vaciar el carrito: ${error.message}`);
    }
  }
}

export default CartRepository;
