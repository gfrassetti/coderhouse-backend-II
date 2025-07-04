import UserService from "../services/user.services.js";

const userService = new UserService();

export const login = (req, res) => userService.login(req, res);
export const register = (req, res) => userService.register(req, res);
export const profile = (req, res) => userService.profile(req, res);


/* export const profile = (req, res) => {
  passport.authenticate("jwt", { session: false }),
    handleAuth("admin"),
    (req, res) => {
      res.status(200).json({
        message: "Authenticated user",
        user: {
          first_name: req.user.first_name,
          last_name: req.user.last_name,
          email: req.user.email,
          age: req.user.age,
          role: req.user.role,
        },
      });
    };
}; */
