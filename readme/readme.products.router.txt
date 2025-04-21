products.router.js - Rutas de productos

Este archivo define las rutas para gestionar productos en la base de datos.
Utiliza un ProductManager conectado a una fuente de datos para operaciones CRUD.

Dependencias:
- express: Para definir rutas.
- ProductManager: Clase encargada de acceder a los productos en la base de datos.

Rutas definidas:

# GET /api/products
Devuelve una lista de productos.
- Permite los siguientes parámetros de consulta:
  - limit: Cantidad de productos por página (por defecto: 10)
  - page: Número de página (por defecto: 1)
  - sort: Ordenamiento por precio ("asc" o "desc")
  - query: Filtro por categoría, disponibilidad, etc.
- Respuesta: listado de productos + info de paginación (prevPage, nextPage, etc.)

Ejemplo: /api/products?limit=5&page=2&sort=asc

# GET /api/products/:pid
Devuelve un producto según su ID.
- Parámetro: pid (ID del producto)
- Si no se encuentra el producto, devuelve un error con mensaje: "Producto no encontrado"

# POST /api/products
Agrega un nuevo producto a la base de datos.
- Requiere un objeto JSON con los datos del nuevo producto en el body.
- Respuesta: mensaje de éxito y el producto agregado.

# PUT /api/products/:pid
Actualiza un producto existente según su ID.
- Parámetro: pid (ID del producto)
- Requiere un objeto JSON con los campos a actualizar en el body.
- Respuesta: mensaje de actualización exitosa.

# DELETE /api/products/:pid
Elimina un producto según su ID.
- Parámetro: pid (ID del producto)
- Respuesta: mensaje de eliminación exitosa.

Notas:
- Todas las rutas manejan errores del servidor con código 500 y un mensaje genérico.
- El ProductManager debe implementar correctamente los métodos: getProducts, getProductById, addProduct, updateProduct y deleteProduct.
- Este router debe ser montado bajo el path /api/products en la aplicación principal.
