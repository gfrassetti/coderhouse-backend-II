import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import userRouter from "./routes/userRouter.js";
import sessionRouter from "./routes/sessionRouter.js";
import initializePassport from "./config/passport.js";

const app = express();

const uri = "mongodb://127.0.0.1:27017/class-zero";
mongoose.connect(uri);


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

initializePassport();
app.use(passport.initialize());

app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Start Server in Port ${PORT}`);
});
