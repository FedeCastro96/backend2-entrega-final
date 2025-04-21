--------------------------------------Router de Autenticación --------------------------------------------
Este archivo contiene las rutas de autenticación y autorización de usuarios en la aplicación. El objetivo principal es gestionar el registro, inicio de sesión, cierre de sesión y la validación de usuarios autenticados utilizando JWT (JSON Web Tokens) y Passport.js.

Dependencias requeridas:

express: Framework web para Node.js.

passport: Middleware para la autenticación.

jsonwebtoken: Librería para generar y verificar tokens JWT.

passport-local: Estrategia de Passport para la autenticación local (usuario y contraseña).

passport-jwt: Estrategia de Passport para autenticar a través de JWT.

dotenv (si no está configurado en otro lugar): Para cargar variables de entorno como JWT_SECRET.

Las rutas en este archivo incluyen:

La ruta POST /register permite registrar a un nuevo usuario. Utiliza el middleware passport.authenticate('register') para manejar el registro de usuarios. Si el registro es exitoso, devuelve un mensaje indicando que el usuario fue registrado correctamente. Si el registro falla, redirige a /api/sessions/failregister.

La ruta GET /failregister maneja los fallos en el registro. Devuelve un mensaje de error si el registro no fue exitoso.

La ruta POST /login permite a un usuario iniciar sesión proporcionando su correo electrónico y contraseña. Utiliza el middleware passport.authenticate('login') para la autenticación. Si la autenticación es exitosa, genera un token JWT y lo envía en una cookie llamada authToken. Si el login falla, redirige a /api/sessions/faillogin.

La ruta GET /faillogin maneja los fallos en el inicio de sesión. Devuelve un mensaje de error si las credenciales no son correctas.

La ruta GET /logout permite al usuario cerrar sesión, eliminando la cookie authToken. Devuelve un mensaje indicando que el cierre de sesión fue exitoso.

La ruta GET /current permite validar si un usuario está autenticado mediante el JWT. Si el usuario está autenticado, devuelve los datos del usuario (ID, nombre, correo, rol, etc.). Si el usuario no está autenticado, devuelve un mensaje de error.

Este archivo depende de que se haya configurado la variable de entorno JWT_SECRET en el archivo .env. Esta variable se usa para firmar los tokens JWT. Por ejemplo:

JWT_SECRET=miclavesupersecreta

Además, el token JWT se almacena en una cookie llamada authToken, la cual tiene el atributo httpOnly, lo que significa que no puede ser accedida por JavaScript en el navegador, proporcionando mayor seguridad.

