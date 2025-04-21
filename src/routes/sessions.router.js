import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware para verificar JWT
const passportJWT = passport.authenticate("jwt", { session: false });

// Registro de usuario
router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failregister",
  }),
  async (req, res) => {
    try {
      res
        .status(201)
        .json({ status: "success", message: "Usuario registrado con éxito" });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  }
);

router.get("/failregister", (req, res) => {
  res.status(400).json({ status: "error", error: "Fallo en el registro" });
});

// Login de usuario
router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    try {
      // Generar JWT token
      const token = jwt.sign({ userId: req.user._id }, JWT_SECRET, {
        expiresIn: "24h",
      });

      // Enviar token en cookie
      res.cookie("authToken", token, {
        maxAge: 1000 * 60 * 60 * 24, // 1 día
        httpOnly: true,
      });

      res.status(200).json({ status: "success", message: "Login exitoso" });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  }
);

router.get("/faillogin", (req, res) => {
  res.status(401).json({ status: "error", error: "Fallo en la autenticación" });
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ status: "success", message: "Logout exitoso" });
});

// Ruta current para validar usuario logueado
router.get("/current", passportJWT, (req, res) => {
  // Si llegamos aquí, el usuario está autenticado
  const user = {
    id: req.user._id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
    cart: req.user.cart,
    role: req.user.role,
  };

  res.status(200).json({ status: "success", payload: user });
});

export default router;
