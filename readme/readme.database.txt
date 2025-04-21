--------------------------------------Configuración de Base de Datos --------------------------------------------

Este archivo (`database.js`) maneja la conexión a la base de datos MongoDB utilizando Mongoose. Implementa una configuración robusta con manejo de errores y validación de variables de entorno.

## Características principales:

1. **Configuración de Variables de Entorno**:
   - Utiliza `dotenv` para cargar las variables de entorno desde el archivo `.env`
   - Requiere la variable `DB_URL` para establecer la conexión con MongoDB

2. **Validación de Configuración**:
   - Verifica que la URL de la base de datos esté definida
   - Lanza un error descriptivo si la configuración es incorrecta

3. **Manejo de Conexión**:
   - Establece la conexión con MongoDB usando Mongoose
   - Proporciona mensajes claros sobre el estado de la conexión
   - Maneja errores de conexión de forma apropiada

4. **Seguridad**:
   - Las credenciales de la base de datos se manejan a través de variables de entorno
   - La URL de conexión no se expone en el código fuente
   ## Requisitos:
- **mongoose**: Para la conexión y manejo de la base de datos MongoDB
- **dotenv**: Para la gestión de variables de entorno

## Ejemplo de uso:
```javascript
// En tu archivo .env
DB_URL=mongodb+srv://usuario:contraseña@cluster.mongodb.net/nombre_db

// La conexión se establece automáticamente al importar el archivo
import './database.js';
```

## Manejo de Errores:
- Si la conexión falla, se muestra un mensaje de error detallado
- El proceso se termina (process.exit(1)) si no se puede establecer la conexión
- Se validan las variables de entorno antes de intentar la conexión

Esta configuración asegura una conexión segura y robusta a la base de datos MongoDB, con un manejo apropiado de errores y validación de configuración.

