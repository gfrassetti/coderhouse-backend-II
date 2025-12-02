import { Router } from "express";
import passport from "passport";
import { ProductRepository } from "../repositories/productRepository.js";
import { ProductDTO } from "../dtos/productDTO.js";
import { requireAdmin } from "../middleware/authorization.js";

const router = Router();


router.use(passport.authenticate("jwt", { session: false }));

// GET /api/products - Obtener todos los productos (público autenticado)
router.get("/", async (req, res) => {
  try {
    const { status, category } = req.query;
    const filters = {};
    
    if (status !== undefined) {
      filters.status = status === "true";
    }
    if (category) {
      filters.category = category;
    }

    const products = await ProductRepository.getAll(filters);
    const productsDTO = ProductDTO.fromProducts(products);

    res.send({
      status: "success",
      payload: productsDTO.map((p) => p.toJSON()),
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductRepository.getById(pid);

    if (!product) {
      return res.status(404).send({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    const productDTO = ProductDTO.fromProduct(product);
    res.send({
      status: "success",
      payload: productDTO.toJSON(),
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const productData = req.body;

    if (
      !productData.title ||
      !productData.description ||
      !productData.code ||
      !productData.price ||
      !productData.category
    ) {
      return res.status(400).send({
        status: "error",
        message: "Faltan campos obligatorios",
      });
    }

    const product = await ProductRepository.create(productData);
    const productDTO = ProductDTO.fromProduct(product);

    res.status(201).send({
      status: "success",
      payload: productDTO.toJSON(),
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.put("/:pid", requireAdmin, async (req, res) => {
  try {
    const { pid } = req.params;
    const updateData = req.body;

    const existingProduct = await ProductRepository.getById(pid);
    if (!existingProduct) {
      return res.status(404).send({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    const product = await ProductRepository.update(pid, updateData);
    const productDTO = ProductDTO.fromProduct(product);

    res.send({
      status: "success",
      payload: productDTO.toJSON(),
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.delete("/:pid", requireAdmin, async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await ProductRepository.getById(pid);
    if (!product) {
      return res.status(404).send({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    await ProductRepository.delete(pid);

    res.send({
      status: "success",
      message: "Producto eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

export default router;

