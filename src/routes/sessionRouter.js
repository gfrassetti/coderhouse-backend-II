import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { createJwtPayload } from "../config/passport.js";
import { CurrentUserDTO } from "../dtos/userDTO.js";
import { PasswordResetService } from "../services/passwordResetService.js";

const router = Router();

const passportCallback = (strategy) => (req, res, next) => {
  passport.authenticate(strategy, { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).send({
        status: "error",
        message: info?.message ?? "Operación no permitida",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

router.post("/register", passportCallback("register"), (req, res) => {
  res.status(201).send({
    status: "success",
    payload: req.user,
  });
});

router.post("/login", passportCallback("login"), (req, res) => {
  const token = jwt.sign(createJwtPayload(req.user), config.jwt.secret, {
    expiresIn: config.jwt.expiration,
  });

  res.send({
    status: "success",
    payload: {
      token,
      user: req.user,
    },
  });
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const userDTO = CurrentUserDTO.fromUser(req.user);
    res.send({
      status: "success",
      payload: userDTO.toJSON(),
    });
  }
);

router.post("/password-reset/request", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({
        status: "error",
        message: "El email es requerido",
      });
    }

    const result = await PasswordResetService.requestPasswordReset(email);
    res.send({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/password-reset/reset", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).send({
        status: "error",
        message: "Token y nueva contraseña son requeridos",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).send({
        status: "error",
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    const result = await PasswordResetService.resetPassword(token, newPassword);
    res.send({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

export default router;

