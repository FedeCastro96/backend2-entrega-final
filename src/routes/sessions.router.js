import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Configure dotenv
dotenv.config();

// Get JWT_SECRET from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const router = express.Router();

// Middleware para verificar JWT
const passportJWT = passport.authenticate("jwt", { session: false });

// Registro de usuario
router.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    failureMessage: true,
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

// Manejador de error de registro
router.post("/register", (err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      status: "error",
      error: err.message || "Error en el registro",
    });
  }
  next();
});

// Login de usuario
router.post(
  "/login",
  passport.authenticate("login", {
    session: true,
    failureMessage: true,
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

      res.status(200).json({
        status: "success",
        message: "Login exitoso",
        token: token,
      });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  }
);

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
