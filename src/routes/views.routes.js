import { Router } from "express";
import passport from "passport";

//en construccion

const ViewsRouter = Router();

ViewsRouter.get("/", (req, res) => {
  res.render("Home");
});

ViewsRouter.get("/profile", (req, res) => {
  res.render("profile", { user: req.user });
});

ViewsRouter.get("/login", (req, res) => {
  res.render("Login");
});

ViewsRouter.get("/register", (req, res) => {
  res.render("Register");
});

ViewsRouter.get("/profile", (req, res) => {
  res.send("Profile");
});

ViewsRouter.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

export default ViewsRouter;
