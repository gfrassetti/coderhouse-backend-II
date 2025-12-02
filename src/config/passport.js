import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UserRepository } from "../repositories/userRepository.js";
import { createHash, isValidPassword } from "../utils/password.js";
import { config } from "./config.js";

export const JWT_SECRET = config.jwt.secret;

const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  if (user.password) delete user.password;
  return user;
};

const buildJwtPayload = (user) => ({
  userId: user._id.toString(),
  role: user.role,
  email: user.email,
});

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
        session: false,
      },
      async (req, email, password, done) => {
        try {
          const existingUser = await UserRepository.getByEmail(email);
          if (existingUser) {
            return done(null, false, { message: "El usuario ya existe" });
          }

          const { first_name, last_name, age, cart = null, role = "user" } =
            req.body;

          if (!first_name || !last_name || !age || !password) {
            return done(null, false, {
              message: "Faltan campos obligatorios para registrar el usuario",
            });
          }

          const newUser = await UserRepository.create({
            first_name,
            last_name,
            email,
            age,
            password,
            cart,
            role,
          });

          return done(null, sanitizeUser(newUser));
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        session: false,
      },
      async (email, password, done) => {
        try {
          const user = await UserRepository.getByEmail(email);
          if (!user) {
            return done(null, false, { message: "Credenciales inválidas" });
          }

          if (!isValidPassword(password, user.password)) {
            return done(null, false, { message: "Credenciales inválidas" });
          }

          return done(null, sanitizeUser(user));
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      async (payload, done) => {
        try {
          const user = await UserRepository.getById(payload.userId);
          if (!user) {
            return done(null, false, { message: "Token inválido" });
          }
          return done(null, sanitizeUser(user));
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};

export const createJwtPayload = buildJwtPayload;

export default initializePassport;

