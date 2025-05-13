import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserResponseDTO } from "../dtos/user.dto.js";

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
      console.error("Error en registro de usuario:", error);
      res.status(500).json({
        status: "error",
        message: "Error al registrar el usuario",
        details: error.message,
      });
    }
  }
);

// Manejador de error de registro
router.post("/register", (err, req, res, next) => {
  if (err) {
    console.error("Error de validación en registro:", err);
    return res.status(400).json({
      status: "error",
      message: "Error en el proceso de registro",
      details: err.message,
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
      console.error("Error en proceso de login:", error);
      res.status(500).json({
        status: "error",
        message: "Error al iniciar sesión",
        details: error.message,
      });
    }
  }
);

// Logout
router.get("/logout", (req, res) => {
  try {
    res.clearCookie("authToken");
    res.status(200).json({ status: "success", message: "Logout exitoso" });
  } catch (error) {
    console.error("Error en proceso de logout:", error);
    res.status(500).json({
      status: "error",
      message: "Error al cerrar sesión",
      details: error.message,
    });
  }
});

// Ruta current para validar usuario logueado
router.get("/current", passportJWT, (req, res) => {
  try {
    const userDTO = new UserResponseDTO(req.user);
    res.status(200).json({ status: "success", payload: userDTO });
  } catch (error) {
    console.error("Error al obtener información del usuario actual:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener la información del usuario actual",
      details: error.message,
    });
  }
});

export default router;
