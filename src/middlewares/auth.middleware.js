import passport from "passport";

// Middleware para verificar si el usuario es admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    status: "error",
    error: "Acceso denegado. Se requiere rol de administrador.",
  });
};

//Middleware para verificar si el usuario está autenticado
export const checkAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Si es una petición AJAX o fetch, devolvemos JSON
      if (req.xhr || req.headers.accept.includes("application/json")) {
        return res.status(401).json({ error: "No autorizado" });
      }
      // Si es una petición normal del navegador, redirigimos a login con mensaje
      return res.redirect(
        "/login?message=Por favor, inicia sesión para acceder a los productos"
      );
    }
    req.user = user;
    return next();
  })(req, res, next);
};

//Middleware para redirigir a la página de login si no está autenticado
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

//Middleare para requerir autentcación
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
