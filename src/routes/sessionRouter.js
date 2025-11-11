import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { JWT_SECRET, createJwtPayload } from "../config/passport.js";

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
  const token = jwt.sign(createJwtPayload(req.user), JWT_SECRET, {
    expiresIn: "1h",
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
    res.send({
      status: "success",
      payload: req.user,
    });
  }
);

export default router;

