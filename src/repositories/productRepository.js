import { ProductDAO } from "../dao/productDAO.js";

export class ProductRepository {
  static async getAll(filters = {}) {
    return await ProductDAO.findAll(filters);
  }

  static async getById(id) {
    return await ProductDAO.findById(id);
  }

  static async getByCode(code) {
    return await ProductDAO.findByCode(code);
  }

  static async create(productData) {
    // Validar que el código sea único
    const existing = await ProductDAO.findByCode(productData.code);
    if (existing) {
      throw new Error("El código del producto ya existe");
    }
    return await ProductDAO.create(productData);
  }

  static async update(id, updateData) {
    // Si se actualiza el código, validar que sea único
    if (updateData.code) {
      const existing = await ProductDAO.findByCode(updateData.code);
      if (existing && existing._id.toString() !== id.toString()) {
        throw new Error("El código del producto ya existe");
      }
    }
    return await ProductDAO.updateById(id, updateData);
  }

  static async delete(id) {
    return await ProductDAO.deleteById(id);
  }

  static async updateStock(productId, quantity) {
    const product = await ProductDAO.findById(productId);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    if (product.stock + quantity < 0) {
      throw new Error("Stock insuficiente");
    }
    return await ProductDAO.updateStock(productId, quantity);
  }

  static async checkStock(productId, quantity) {
    const product = await ProductDAO.findById(productId);
    if (!product) {
      return { available: false, reason: "Producto no encontrado" };
    }
    if (product.stock < quantity) {
      return {
        available: false,
        reason: `Stock insuficiente. Disponible: ${product.stock}, Solicitado: ${quantity}`,
        availableStock: product.stock,
      };
    }
    return { available: true, product };
  }
}

