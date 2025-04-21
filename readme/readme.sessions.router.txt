sessions.router.js - Rutas de sesión de usuario

Este archivo define las rutas relacionadas al registro, login, logout y validación
de sesión del usuario utilizando Passport con estrategias locales y JWT.

Dependencias:
- express: Para definir rutas.
- passport: Para autenticación.
- jsonwebtoken: Para generar y verificar tokens JWT.
- cookie-parser (debe estar configurado en el servidor): Para manejar cookies HTTP.

Rutas definidas:

# POST /api/sessions/register
Registra un nuevo usuario utilizando la estrategia "register" de Passport.
- En caso de éxito, responde con un mensaje de registro exitoso.
- En caso de fallo, redirige a /api/sessions/failregister.

# GET /api/sessions/failregister
Devuelve un error 400 cuando falla el proceso de registro.
- Respuesta: { status: "error", error: "Fallo en el registro" }

# POST /api/sessions/login
Autentica a un usuario con la estrategia "login".
- Si es exitoso, genera un token JWT válido por 24 horas.
- El token se guarda en una cookie llamada "authToken".
- En caso de fallo, redirige a /api/sessions/faillogin.

# GET /api/sessions/faillogin
Devuelve un error 401 si falla el inicio de sesión.
- Respuesta: { status: "error", error: "Fallo en la autenticación" }

# GET /api/sessions/logout
Elimina la cookie de autenticación.
- Respuesta: { status: "success", message: "Logout exitoso" }

# GET /api/sessions/current
Devuelve los datos del usuario actualmente autenticado (requiere JWT).
- Middleware: passport.authenticate("jwt", { session: false })
- Devuelve un objeto con los datos del usuario logueado:
  - id, first_name, last_name, email, age, cart, role

Notas:
- La constante JWT_SECRET debe estar definida en el entorno para generar los tokens.
- El middleware de Passport debe estar correctamente configurado con las estrategias "register", "login" y "jwt".
- Esta ruta está pensada para integrarse con la lógica de sesiones y cookies seguras.
