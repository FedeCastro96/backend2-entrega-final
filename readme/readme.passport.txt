--------------------------------------PASSPORT --------------------------------------------

Este archivo configura las estrategias de autenticación utilizando **Passport.js** para una aplicación Node.js. Se implementan tres estrategias principales para manejar el registro de usuarios, el inicio de sesión, y la autenticación basada en JWT (JSON Web Token).

## Estrategias implementadas:

1. **Registro de usuario (register)**: Permite registrar un nuevo usuario en el sistema.
   - Se verifica si el usuario ya existe, y en caso contrario, se crea un nuevo usuario.
   - Se genera un carrito vacío para el nuevo usuario.
   - La contraseña se encripta usando **bcrypt** para mayor seguridad.
   
2. **Inicio de sesión (login)**: Permite a los usuarios iniciar sesión en el sistema utilizando su email y contraseña.
   - Se verifica si el usuario existe y si la contraseña ingresada es correcta.
   
3. **Autenticación con JWT (jwt)**: Permite la autenticación de usuarios mediante tokens JWT.
   - El token JWT se extrae de las cookies de la solicitud y se valida utilizando una clave secreta.
   - Se busca el usuario correspondiente al token y, si es válido, se autentica al usuario.

## Serialización y deserialización:

- **`serializeUser`** guarda el **ID del usuario** en la sesión.
- **`deserializeUser`** busca al usuario en la base de datos utilizando el ID almacenado en la sesión para mantener la sesión activa.

## Requisitos:
- **passport**: Librería principal para la autenticación.
- **passport-local**: Estrategia de autenticación local (email y contraseña).
- **passport-jwt**: Estrategia para autenticación mediante JWT.
- **bcrypt**: Para encriptar y comparar contraseñas de forma segura.
- **dotenv**: Para manejar variables de entorno (como JWT_SECRET).

Este archivo facilita la implementación de autenticación segura y gestión de sesiones en una aplicación web.

