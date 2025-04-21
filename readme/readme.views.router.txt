VIEWS ROUTER - DOCUMENTACIÓN

Este router gestiona las vistas renderizadas del frontend utilizando plantillas (como Handlebars) y control de sesión para usuarios autenticados.

# Base URL
/

# Dependencias
- Express
- auth.middleware.js (contiene middlewares para autenticación y autorización)
- productManager y cartManager (se asume que son instancias disponibles en el entorno)

# Middlewares utilizados
- checkAuth: Verifica si el usuario está autenticado (para mostrar ciertos contenidos).
- redirectIfLoggedIn: Evita que usuarios ya autenticados accedan a páginas como login o register.
- requireAuth: Obliga a que el usuario esté autenticado para acceder a la ruta.

# Endpoints disponibles:

# 1. Redirección desde la raíz
Método: GET
Ruta: /
Descripción: Redirige automáticamente a /products.

# 2. Página de registro
Método: GET
Ruta: /register
Middleware: redirectIfLoggedIn
Descripción: Renderiza la vista de registro si el usuario no está logueado.

# 3. Página de login
Método: GET
Ruta: /login
Middleware: redirectIfLoggedIn
Descripción: Renderiza la vista de login si el usuario no está logueado.

# 4. Página de perfil
Método: GET
Ruta: /profile
Middleware: requireAuth
Descripción: Renderiza la vista del perfil de usuario. Solo accesible si el usuario está autenticado.

# 5. Página de productos
Método: GET
Ruta: /products
Middleware: checkAuth
Query Params opcionales:
- page: número de página (por defecto 1)
- limit: cantidad de productos por página (por defecto 5)

Descripción: Renderiza una vista con los productos paginados. Convierte los productos a objetos simples para facilitar su uso en Handlebars.
Respuesta: Vista "products" con información de productos y paginación.

# 6. Vista del carrito
Método: GET
Ruta: /carts/:cid
Middleware: checkAuth
Descripción: Renderiza la vista del carrito con los productos que contiene, mostrando su cantidad. Convierte los productos a objetos simples para poder utilizarlos en Handlebars.
Respuesta: Vista "carts" con productos y cantidades.

# Notas
- Las vistas están basadas en plantillas que se renderizan usando métodos como res.render().
- Los middlewares aseguran que las rutas respondan correctamente según el estado de autenticación del usuario.
- Los errores internos del servidor responden con status 500 y un mensaje en formato JSON.
