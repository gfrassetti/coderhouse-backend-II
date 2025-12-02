import userModel from "../models/userModel.js";

export class UserDAO {
  static async findAll() {
    return await userModel.find().lean();
  }

  static async findById(id) {
    return await userModel.findById(id).lean();
  }

  static async findByEmail(email) {
    return await userModel.findOne({ email }).lean();
  }

  static async create(userData) {
    return await userModel.create(userData);
  }

  static async updateById(id, updateData) {
    return await userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .lean();
  }

  static async deleteById(id) {
    return await userModel.findByIdAndDelete(id).lean();
  }

  static async updateCart(userId, cartId) {
    return await userModel
      .findByIdAndUpdate(userId, { cart: cartId }, { new: true })
      .lean();
  }
}

