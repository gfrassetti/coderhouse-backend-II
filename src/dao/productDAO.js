import productModel from "../models/productModel.js";

export class ProductDAO {
  static async findAll(filters = {}) {
    return await productModel.find(filters).lean();
  }

  static async findById(id) {
    return await productModel.findById(id).lean();
  }

  static async findByCode(code) {
    return await productModel.findOne({ code }).lean();
  }

  static async create(productData) {
    return await productModel.create(productData);
  }

  static async updateById(id, updateData) {
    return await productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .lean();
  }

  static async deleteById(id) {
    return await productModel.findByIdAndDelete(id).lean();
  }

  static async updateStock(productId, quantity) {
    return await productModel
      .findByIdAndUpdate(
        productId,
        { $inc: { stock: quantity } },
        { new: true }
      )
      .lean();
  }
}

