import UserRepository from "../repositories/user.repository.js";

//Manager para manejar la lógica de negocio de usuarios
class UserManager {
  constructor() {
    this.userRepository = new UserRepository();
  }

  //Crea un nuevo usuario
  async createUser(userData) {
    try {
      return await this.userRepository.create(userData);
    } catch (error) {
      console.error(`Error al crear el usuario: ${error.message}`);
      throw new Error(`No se pudo crear el usuario: ${error.message}`);
    }
  }

  //Obtiene todos los usuarios
  async getAllUsers() {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      console.error(`Error al obtener usuarios: ${error.message}`);
      throw new Error(`No se pudieron obtener los usuarios: ${error.message}`);
    }
  }

  //Busca un usuario por su ID
  async getUserById(id) {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        console.warn(`Usuario no encontrado con ID: ${id}`);
        return null;
      }
      return user;
    } catch (error) {
      console.error(`Error al buscar usuario por ID: ${error.message}`);
      throw new Error(`No se pudo obtener el usuario: ${error.message}`);
    }
  }

  //Busca un usuario por su email
  async getUserByEmail(email) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        console.warn(`Usuario no encontrado con email: ${email}`);
        return null;
      }
      return user;
    } catch (error) {
      console.error(`Error al buscar usuario por email: ${error.message}`);
      throw new Error(`No se pudo obtener el usuario: ${error.message}`);
    }
  }

  //Actualiza los datos de un usuario
  async updateUser(id, userData) {
    try {
      const updatedUser = await this.userRepository.update(id, userData);
      if (!updatedUser) {
        console.warn(`Usuario no encontrado para actualizar con ID: ${id}`);
        return null;
      }
      return updatedUser;
    } catch (error) {
      console.error(`Error al actualizar usuario: ${error.message}`);
      throw new Error(`No se pudo actualizar el usuario: ${error.message}`);
    }
  }

  //Actualiza la contraseña de un usuario
  async updateUserPassword(id, newPassword) {
    try {
      const user = await this.userRepository.updatePassword(id, newPassword);
      if (!user) {
        console.warn(
          `Usuario no encontrado para actualizar contraseña con ID: ${id}`
        );
        return null;
      }
      return user;
    } catch (error) {
      console.error(`Error al actualizar contraseña: ${error.message}`);
      throw new Error(`No se pudo actualizar la contraseña: ${error.message}`);
    }
  }

  //Elimina un usuario
  async deleteUser(id) {
    try {
      const deletedUser = await this.userRepository.delete(id);
      if (!deletedUser) {
        console.warn(`Usuario no encontrado para eliminar con ID: ${id}`);
        return null;
      }
      return deletedUser;
    } catch (error) {
      console.error(`Error al eliminar usuario: ${error.message}`);
      throw new Error(`No se pudo eliminar el usuario: ${error.message}`);
    }
  }

  //Asigna un carrito a un usuario
  async assignCartToUser(userId, cartId) {
    try {
      const user = await this.userRepository.assignCartToUser(userId, cartId);
      if (!user) {
        console.warn(
          `Usuario no encontrado para asignar carrito con ID: ${userId}`
        );
        return null;
      }
      return user;
    } catch (error) {
      console.error(`Error al asignar carrito: ${error.message}`);
      throw new Error(
        `No se pudo asignar el carrito al usuario: ${error.message}`
      );
    }
  }
}

export default UserManager;
