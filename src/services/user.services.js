    import { createHash, isValidPassword, generateToken } from "../utils.js";
    import passport from "passport";
    import { UserSchemma } from "../models/user.model.js";
    import DatabaseDao from "../models/dao.js";

    const userDAO = new DatabaseDao(UserSchemma);

    export default class UserService {

        async login(user)
        {
            try {
                const { email, password } = req.body;
                /* const user = await UserSchemma.findOne({ email }).lean(); */
                const user = await userDAO.getByEmail(email);
                if (isValidPassword(user, password)) {
                const token = generateToken({
                    email: user.email,
                    name: user.first_name,
                    role: user.role,
                });
                return res
                    .status(200)
                    .cookie("currentUser", token, {
                    httpOnly: true,
                    maxAge: 60000,
                    signed: true,
                    })
                    .json({
                    message: "Login successful",
                    user: user.first_name,
                    token,
                    });
                }
                return res.status(400).json({ message: "Invalid credentials" });
            } catch (error) {
                return res.status(500).json({ message: "Error during login" });
            }
        }
        //usamos passport 
        async register(req, res) {
            passport.authenticate("register", {
            failureRedirect: "/failRegister",
            session: false,
            successRedirect: "/login",
            })(req, res);
        }

        async profile(req, res) {
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
        }
    }

