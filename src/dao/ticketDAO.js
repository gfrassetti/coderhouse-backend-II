import ticketModel from "../models/ticketModel.js";

export class TicketDAO {
  static async findAll() {
    return await ticketModel.find().populate("products.product").lean();
  }

  static async findById(id) {
    return await ticketModel.findById(id).populate("products.product").lean();
  }

  static async findByCode(code) {
    return await ticketModel.findOne({ code }).populate("products.product").lean();
  }

  static async findByPurchaser(email) {
    return await ticketModel
      .find({ purchaser: email })
      .populate("products.product")
      .lean();
  }

  static async create(ticketData) {
    return await ticketModel.create(ticketData);
  }
}

