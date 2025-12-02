import cartModel from "../models/cartModel.js";

export class CartDAO {
  static async findById(id) {
    return await cartModel.findById(id).populate("products.product").lean();
  }

  static async findByUser(userId) {
    return await cartModel
      .findOne({ user: userId })
      .populate("products.product")
      .lean();
  }

  static async create(cartData) {
    return await cartModel.create(cartData);
  }

  static async updateById(id, updateData) {
    return await cartModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("products.product")
      .lean();
  }

  static async addProduct(cartId, productId, quantity) {
    const cart = await cartModel.findById(cartId);
    if (!cart) return null;

    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingProductIndex >= 0) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return await cartModel.findById(cartId).populate("products.product").lean();
  }

  static async updateProductQuantity(cartId, productId, quantity) {
    const cart = await cartModel.findById(cartId);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (productIndex >= 0) {
      if (quantity <= 0) {
        cart.products.splice(productIndex, 1);
      } else {
        cart.products[productIndex].quantity = quantity;
      }
      await cart.save();
    }

    return await cartModel.findById(cartId).populate("products.product").lean();
  }

  static async removeProduct(cartId, productId) {
    const cart = await cartModel.findById(cartId);
    if (!cart) return null;

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    await cart.save();
    return await cartModel.findById(cartId).populate("products.product").lean();
  }

  static async clearCart(cartId) {
    return await cartModel
      .findByIdAndUpdate(cartId, { products: [] }, { new: true })
      .populate("products.product")
      .lean();
  }

  static async deleteById(id) {
    return await cartModel.findByIdAndDelete(id).lean();
  }
}

