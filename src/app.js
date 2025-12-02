import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import { config } from "./config/config.js";
import initializePassport from "./config/passport.js";

import userRouter from "./routes/userRouter.js";
import sessionRouter from "./routes/sessionRouter.js";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import ticketRouter from "./routes/ticketRouter.js";

const app = express();

mongoose.connect(config.database.uri);

mongoose.connection.on("error", (error) => {
  console.error("Error de conexión a MongoDB:", error);
});

mongoose.connection.once("open", () => {
  console.log("Conexión exitosa a MongoDB");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializePassport();
app.use(passport.initialize());

app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/tickets", ticketRouter);

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).send({
    status: "error",
    message: err.message || "Error interno del servidor",
  });
});

app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Ruta no encontrada",
  });
});

const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
  console.log(`Entorno: ${config.server.env}`);
});
