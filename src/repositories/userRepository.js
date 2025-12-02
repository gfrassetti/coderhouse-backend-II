import { UserDAO } from "../dao/userDAO.js";
import { createHash } from "../utils/password.js";

export class UserRepository {
  static async getAll() {
    return await UserDAO.findAll();
  }

  static async getById(id) {
    return await UserDAO.findById(id);
  }

  static async getByEmail(email) {
    return await UserDAO.findByEmail(email);
  }

  static async create(userData) {
    if (userData.password) {
      userData.password = createHash(userData.password);
    }
    return await UserDAO.create(userData);
  }

  static async update(id, updateData) {
    if (updateData.password) {
      updateData.password = createHash(updateData.password);
    }
    return await UserDAO.updateById(id, updateData);
  }

  static async delete(id) {
    return await UserDAO.deleteById(id);
  }

  static async updateCart(userId, cartId) {
    return await UserDAO.updateCart(userId, cartId);
  }
}

