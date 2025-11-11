import { Router } from "express";
import userModel from "../models/userModel.js";
import { createHash } from "../utils/password.js";

const router = Router();

// Consultar todos los usuarios
router.get("/", async (req, res) => {
  try {
    const result = await userModel.find().lean();
    const users = result.map(({ password, ...rest }) => rest);

    res.send({
      status: "success",
      payload: users,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

// Crear un usuario
router.post("/", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    age,
    password,
    role = "user",
    cart = null,
  } = req.body;
  try {
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).send({
        status: "error",
        message: "Todos los campos obligatorios deben estar completos",
      });
    }

    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(409).send({
        status: "error",
        message: "El correo electrónico ya está registrado",
      });
    }

    const hashedPassword = createHash(password);
    const result = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      role,
      cart,
    });
    const { password: _, ...user } = result.toObject();
    res.status(201).send({
      status: "success",
      payload: user,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

// Actualizar un usuario
router.put("/:uid", async (req, res) => {
  const uid = req.params.uid;
  const {
    first_name,
    last_name,
    email,
    age,
    password,
    role,
    cart,
  } = req.body;
  try {
    const user = await userModel.findById(uid);
    if (!user) throw new Error("Usuario no encontrado");

    if (email && email !== user.email) {
      const emailTaken = await userModel.findOne({ email });
      if (emailTaken) {
        return res.status(409).send({
          status: "error",
          message: "El correo electrónico ya está registrado",
        });
      }
    }

    const newUser = {
      first_name: first_name ?? user.first_name,
      last_name: last_name ?? user.last_name,
      email: email ?? user.email,
      age: age ?? user.age,
      role: role ?? user.role,
      cart: cart ?? user.cart,
    };

    if (password) {
      newUser.password = createHash(password);
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(uid, newUser, { new: true })
      .lean();

    const { password: _, ...userWithoutPassword } = updatedUser;

    res.send({
      status: "success",
      payload: userWithoutPassword,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

// Eliminar un usuario
router.delete("/:uid", async (req, res) => {
  const uid = req.params.uid;
  try {
    const result = await userModel.deleteOne({ _id: uid });
    res.status(200).send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

export default router;