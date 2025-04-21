import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import bcrypt from "bcrypt";
import User from "../dao/models/user.model.js";
import CartModel from "../dao/models/cart.model.js";

// Estrategias
const LocalStrategy = local.Strategy;
const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

// JWT settings
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Extractor de cookies para JWT
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["authToken"];
  }
  return token;
};

export const initializePassportStrategies = () => {
  // Estrategia de registro
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;

          // Verificar si el usuario ya existe
          const exists = await User.findOne({ email });
          if (exists) {
            return done(null, false, { message: "El usuario ya existe" });
          }

          // Crear carrito para el usuario
          const cart = await CartModel.create({ products: [] });

          // Encriptar contraseña con bcrypt.hashSync
          const hashedPassword = bcrypt.hashSync(password, 10);

          // Crear usuario
          const user = await User.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            cart: cart._id,
            role: email.includes("admin") ? "admin" : "user", // Simple lógica para asignar rol admin
          });

          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // Estrategia de login
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // Buscar usuario
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }

          // Verificar contraseña
          const isValidPassword = bcrypt.compareSync(password, user.password);
          if (!isValidPassword) {
            return done(null, false, { message: "Contraseña incorrecta" });
          }

          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // Estrategia JWT - En lugar de fromExtractors, usamos una función directa
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: function (req) {
          return cookieExtractor(req);
        },
        secretOrKey: JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          // Buscar usuario por ID del payload
          const user = await User.findById(jwt_payload.userId);
          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }

          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // Serialización y deserialización para sesiones (opcional si usas solo JWT)
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
