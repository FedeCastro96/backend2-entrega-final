auth.middleware.js - Descripción de Middlewares

Este archivo contiene middlewares utilizados para la autenticación y autorización
de usuarios en una aplicación Node.js que utiliza Passport con estrategia JWT.

Dependencias:
- passport: Librería de autenticación.
- Estrategia JWT debe estar configurada previamente.

Middlewares incluidos:

# checkAuth
Verifica si el usuario está autenticado mediante JWT.
- Si el token es válido, agrega el objeto "user" al objeto "req".
- Si el token no es válido o está ausente, devuelve un error 401 (No autorizado).
- Uso recomendado: proteger rutas privadas que requieren autenticación.

# isAdmin
Verifica si el usuario autenticado tiene el rol "admin".
- Si el usuario tiene rol de administrador, permite continuar.
- Si no lo tiene, devuelve un error 403 (Acceso denegado).
- Uso recomendado: rutas restringidas solo para administradores.

# redirectIfLoggedIn
Evita que usuarios ya autenticados accedan a rutas públicas como login o registro.
- Si el usuario ya está autenticado, redirige automáticamente a /products.
- Si no está autenticado, permite continuar hacia la ruta deseada.

# requireAuth
Requiere autenticación para acceder a una ruta específica.
- Si el usuario no está autenticado, redirige automáticamente a /login.
- Si el usuario está autenticado, permite continuar con la ejecución.
- Uso recomendado: páginas o rutas accesibles únicamente para usuarios logueados.

Notas adicionales:
- Estos middlewares deben usarse en rutas según los requerimientos de seguridad del sistema.
- Asegurarse de tener configurada correctamente la estrategia JWT en passport.
