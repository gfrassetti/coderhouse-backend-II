import { Router } from "express";
import { UserRepository } from "../repositories/userRepository.js";
import { UserDTO } from "../dtos/userDTO.js";

const router = Router();

// Consultar todos los usuarios
router.get("/", async (req, res) => {
  try {
    const users = await UserRepository.getAll();
    const usersDTO = UserDTO.fromUsers(users);

    res.send({
      status: "success",
      payload: usersDTO.map((u) => u.toJSON()),
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

    const existing = await UserRepository.getByEmail(email);
    if (existing) {
      return res.status(409).send({
        status: "error",
        message: "El correo electrónico ya está registrado",
      });
    }

    const user = await UserRepository.create({
      first_name,
      last_name,
      email,
      age,
      password,
      role,
      cart,
    });

    const userDTO = UserDTO.fromUser(user);
    res.status(201).send({
      status: "success",
      payload: userDTO.toJSON(),
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
  const updateData = req.body;

  try {
    const existingUser = await UserRepository.getById(uid);
    if (!existingUser) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    if (updateData.email && updateData.email !== existingUser.email) {
      const emailTaken = await UserRepository.getByEmail(updateData.email);
      if (emailTaken) {
        return res.status(409).send({
          status: "error",
          message: "El correo electrónico ya está registrado",
        });
      }
    }

    const updatedUser = await UserRepository.update(uid, updateData);
    const userDTO = UserDTO.fromUser(updatedUser);

    res.send({
      status: "success",
      payload: userDTO.toJSON(),
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
    const user = await UserRepository.getById(uid);
    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    await UserRepository.delete(uid);
    res.status(200).send({
      status: "success",
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

export default router;