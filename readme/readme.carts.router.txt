CARTS ROUTER - DOCUMENTACIÓN

Este router gestiona las rutas relacionadas con los carritos de compra en una API REST construida con Express.

# Base URL
/api/carts

# Dependencias
- Express
- CartManager (gestor de operaciones con la base de datos)
- CartModel (modelo de Mongoose para los carritos)

# Endpoints disponibles:

# 1. Crear un nuevo carrito
Método: POST
Ruta: /
Descripción: Crea un carrito vacío en la base de datos.
Respuesta: Objeto JSON con el carrito creado.

# 2. Obtener un carrito por ID
Método: GET
Ruta: /:cid
Descripción: Busca un carrito por su ID y devuelve su contenido (productos).
Respuesta: Objeto JSON con el carrito encontrado o error si no existe.

# 3. Agregar un producto a un carrito
Método: POST
Ruta: /:cid/product/:pid
Descripción: Agrega un producto (pid) al carrito (cid). Si ya existe, incrementa la cantidad. Se puede especificar la cantidad en el body.
Body (opcional): { "quantity": número }
Respuesta: Lista actualizada de productos en el carrito.

# 4. Eliminar un producto específico de un carrito
Método: DELETE
Ruta: /:cid/product/:pid
Descripción: Elimina un producto específico de un carrito.
Respuesta: Mensaje de éxito y carrito actualizado.

# 5. Reemplazar todo el contenido de un carrito
Método: PUT
Ruta: /:cid
Descripción: Reemplaza completamente los productos del carrito con un nuevo arreglo recibido en el body.
Body: Array de productos (con id y quantity)
Respuesta: Carrito actualizado.

# 6. Actualizar la cantidad de un producto específico en el carrito
Método: PUT
Ruta: /:cid/product/:pid
Descripción: Modifica la cantidad de un producto dentro del carrito.
Body: { "quantity": número }
Respuesta: Mensaje de éxito y carrito actualizado.

# 7. Vaciar un carrito
Método: DELETE
Ruta: /:cid
Descripción: Elimina todos los productos del carrito especificado.
Respuesta: Mensaje de éxito y carrito vacío.

# 8. Obtener todos los carritos
Método: GET
Ruta: /
Descripción: Devuelve todos los carritos existentes en la base de datos.
Respuesta: Array de carritos.

# Notas
- Todos los errores del servidor devuelven un status 500 con un mensaje de error.
- Es importante asegurarse de que los IDs (de carrito y producto) sean válidos y existan en la base de datos para evitar errores.
