import passport from "passport";

// Middleware para verificar si el usuario es admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    status: "error",
    message:
      "Acceso denegado. Se requiere rol de administrador para realizar esta acción",
  });
};

//Middleware para verificar si el usuario está autenticado
export const checkAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error en la autenticación",
        details: err.message,
      });
    }
    if (!user) {
      // Verificar si la petición es una API o una vista
      if (req.path.startsWith("/api/")) {
        return res.status(401).json({
          status: "error",
          message:
            "No autorizado. Debe iniciar sesión para acceder a este recurso",
        });
      } else {
        // Si es una petición de vista, redirigir al login
        return res.redirect("/login");
      }
    }
    req.user = user;
    return next();
  })(req, res, next);
};

// Middleware para verificar si es un usuario normal (no admin)
export const isUser = (req, res, next) => {
  if (req.user && req.user.role === "user") {
    return next();
  }
  return res.status(403).json({
    status: "error",
    error: "Acceso denegado. Se requiere rol de usuario.",
  });
};

// Middleware para verificar si el usuario es el propietario del carrito
export const isCartOwner = (req, res, next) => {
  if (
    req.user &&
    req.user.cart &&
    req.user.cart.toString() === req.params.cid
  ) {
    return next();
  }
  return res.status(403).json({
    status: "error",
    error: "Acceso denegado. No eres el propietario de este carrito.",
  });
};

// Middleware para redirigir a la página de login si no está autenticado
export const redirectIfLoggedIn = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      return res.redirect("/products");
    }
    return next();
  })(req, res, next);
};

// Middleware para requerir autenticación
export const requireAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.user = user;
    return next();
  })(req, res, next);
};
