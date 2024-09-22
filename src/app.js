import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import UserSessionRouter from "./routes/sessions.routes.js";
import ViewsRouter from "./routes/views.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import { initPassport, jwtPassport } from "./config/passport.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Configurar handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(passport.initialize());
//app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

initPassport();
jwtPassport();
app.use("/api/sessions", UserSessionRouter);
app.use("/", ViewsRouter);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
