import { Router } from "express";
import passport from "passport";
import { CartRepository } from "../repositories/cartRepository.js";
import { CartDTO } from "../dtos/cartDTO.js";
import { requireUser } from "../middleware/authorization.js";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));
router.use(requireUser);

router.get("/", async (req, res) => {
  try {
    let cart = await CartRepository.getByUser(req.user._id || req.user.id);

    if (!cart) {
      cart = await CartRepository.create(req.user._id || req.user.id);
    }

    const cartDTO = CartDTO.fromCart(cart);
    res.send({
      status: "success",
      payload: cartDTO.toJSON(),
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const { quantity = 1 } = req.body;

    if (quantity <= 0) {
      return res.status(400).send({
        status: "error",
        message: "La cantidad debe ser mayor a 0",
      });
    }

    let cart = await CartRepository.getByUser(req.user._id || req.user.id);

    if (!cart) {
      cart = await CartRepository.create(req.user._id || req.user.id);
    }

    const updatedCart = await CartRepository.addProduct(
      cart._id || cart.id,
      pid,
      quantity
    );

    const cartDTO = CartDTO.fromCart(updatedCart);
    res.send({
      status: "success",
      payload: cartDTO.toJSON(),
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.put("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).send({
        status: "error",
        message: "La cantidad debe ser mayor a 0",
      });
    }

    const cart = await CartRepository.getByUser(req.user._id || req.user.id);

    if (!cart) {
      return res.status(404).send({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    const updatedCart = await CartRepository.updateProductQuantity(
      cart._id || cart.id,
      pid,
      quantity
    );

    const cartDTO = CartDTO.fromCart(updatedCart);
    res.send({
      status: "success",
      payload: cartDTO.toJSON(),
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.delete("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const cart = await CartRepository.getByUser(req.user._id || req.user.id);

    if (!cart) {
      return res.status(404).send({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    const updatedCart = await CartRepository.removeProduct(
      cart._id || cart.id,
      pid
    );

    const cartDTO = CartDTO.fromCart(updatedCart);
    res.send({
      status: "success",
      payload: cartDTO.toJSON(),
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.delete("/", async (req, res) => {
  try {
    const cart = await CartRepository.getByUser(req.user._id || req.user.id);

    if (!cart) {
      return res.status(404).send({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    await CartRepository.clearCart(cart._id || cart.id);

    res.send({
      status: "success",
      message: "Carrito vaciado exitosamente",
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

export default router;

