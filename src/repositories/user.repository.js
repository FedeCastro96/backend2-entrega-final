import User from "../dao/models/user.model.js";

class UserRepository {
  async create(userData) {
    try {
      const newUser = new User(userData);
      await newUser.save();
      return newUser;
    } catch (error) {
      throw new Error(`Error al crear el usuario: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw new Error(`Error al obtener todos los usuarios: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error(`No se encontró ningún usuario con el ID: ${id}`);
      }
      return user;
    } catch (error) {
      throw new Error(`Error al buscar usuario por ID: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error(`No se encontró ningún usuario con el email: ${email}`);
      }
      return user;
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }

  async update(id, userData) {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, userData, {
        new: true,
      });
      if (!updatedUser) {
        throw new Error(
          `No se encontró ningún usuario con el ID: ${id} para actualizar`
        );
      }
      return updatedUser;
    } catch (error) {
      throw new Error(`Error al actualizar el usuario: ${error.message}`);
    }
  }

  async updatePassword(id, newPassword) {
    try {
      const user = await User.findById(id);

      if (!user) {
        throw new Error(
          `No se encontró ningún usuario con el ID: ${id} para actualizar la contraseña`
        );
      }

      user.password = newPassword;
      await user.save();

      return user;
    } catch (error) {
      throw new Error(`Error al actualizar la contraseña: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        throw new Error(
          `No se encontró ningún usuario con el ID: ${id} para eliminar`
        );
      }
      return deletedUser;
    } catch (error) {
      throw new Error(`Error al eliminar el usuario: ${error.message}`);
    }
  }

  async assignCartToUser(userId, cartId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { cart: cartId },
        { new: true }
      );
      if (!user) {
        throw new Error(
          `No se encontró ningún usuario con el ID: ${userId} para asignar el carrito`
        );
      }
      return user;
    } catch (error) {
      throw new Error(`Error al asignar carrito al usuario: ${error.message}`);
    }
  }
}

export default UserRepository;
