import express from "express";
import crypto from "crypto";
import userRepository from "../repositories/user.repository.js";
import ResetToken from "../dao/models/resetToken.model.js";
import emailService from "../services/email.service.js";
import bcrypt from "bcrypt";
import User from "../dao/models/user.model.js";

const router = express.Router();

// Solicitar restablecimiento de contraseña
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Verificar si el usuario existe
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "No existe una cuenta con ese email",
      });
    }

    // Generar token
    const token = crypto.randomBytes(32).toString("hex");

    // Guardar token en la base de datos
    await ResetToken.create({
      userId: user._id,
      token: token,
    });

    // Enviar email
    await emailService.sendPasswordResetEmail(email, token);

    res.status(200).json({
      status: "success",
      message: "Se ha enviado un correo con las instrucciones",
    });
  } catch (error) {
    console.error("Error en forgot-password:", error);
    res.status(500).json({
      status: "error",
      message: "Error al procesar la solicitud",
      details: error.message,
    });
  }
});

// Restablecer contraseña
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Buscar el token
    const resetToken = await ResetToken.findOne({ token });
    if (!resetToken) {
      return res.status(400).json({
        status: "error",
        message: "Token inválido o expirado",
      });
    }

    // Obtener el usuario directamente de la base de datos
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    // Verificar que la nueva contraseña sea diferente
    if (user.password) {
      // Verificar que existe la contraseña
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({
          status: "error",
          message: "La nueva contraseña no puede ser igual a la anterior",
        });
      }
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña del usuario
    user.password = hashedPassword;
    await user.save();

    // Eliminar el token usado
    await ResetToken.deleteOne({ token });

    res.status(200).json({
      status: "success",
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    console.error("Error en reset-password:", error);
    res.status(500).json({
      status: "error",
      message: "Error al restablecer la contraseña",
      details: error.message,
    });
  }
});

export default router;
