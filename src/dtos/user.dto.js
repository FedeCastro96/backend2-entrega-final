// UserResponseDTO - Para enviar información al cliente
class UserResponseDTO {
  constructor(user) {
    this.id = user._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.age = user.age;
    this.cart = user.cart;
    this.role = user.role;
  }
}

// UserCreateDTO - Para la creación de usuarios
class UserCreateDTO {
  constructor(userData) {
    this.first_name = userData.first_name;
    this.last_name = userData.last_name;
    this.email = userData.email;
    this.age = userData.age;
    this.password = userData.password;
  }
}

// UserUpdateDTO - Para actualizaciones de usuario
class UserUpdateDTO {
  constructor(userData) {
    this.first_name = userData.first_name;
    this.last_name = userData.last_name;
    this.email = userData.email;
    this.age = userData.age;
  }
}

export { UserResponseDTO, UserCreateDTO, UserUpdateDTO };
