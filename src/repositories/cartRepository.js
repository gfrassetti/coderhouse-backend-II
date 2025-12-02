import { CartDAO } from "../dao/cartDAO.js";

export class CartRepository {
  static async getById(id) {
    return await CartDAO.findById(id);
  }

  static async getByUser(userId) {
    return await CartDAO.findByUser(userId);
  }

  static async create(userId) {
    return await CartDAO.create({ user: userId, products: [] });
  }

  static async addProduct(cartId, productId, quantity) {
    if (quantity <= 0) {
      throw new Error("La cantidad debe ser mayor a 0");
    }
    return await CartDAO.addProduct(cartId, productId, quantity);
  }

  static async updateProductQuantity(cartId, productId, quantity) {
    if (quantity <= 0) {
      return await CartDAO.removeProduct(cartId, productId);
    }
    return await CartDAO.updateProductQuantity(cartId, productId, quantity);
  }

  static async removeProduct(cartId, productId) {
    return await CartDAO.removeProduct(cartId, productId);
  }

  static async clearCart(cartId) {
    return await CartDAO.clearCart(cartId);
  }

  static async delete(id) {
    return await CartDAO.deleteById(id);
  }
}

