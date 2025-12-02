import passwordResetTokenModel from "../models/passwordResetTokenModel.js";

export class PasswordResetTokenDAO {
  static async findByToken(token) {
    return await passwordResetTokenModel.findOne({ token }).lean();
  }

  static async findByUser(userId) {
    return await passwordResetTokenModel
      .findOne({ user: userId, used: false })
      .lean();
  }

  static async create(tokenData) {
    return await passwordResetTokenModel.create(tokenData);
  }

  static async markAsUsed(token) {
    return await passwordResetTokenModel
      .findOneAndUpdate({ token }, { used: true }, { new: true })
      .lean();
  }

  static async deleteByUser(userId) {
    return await passwordResetTokenModel.deleteMany({ user: userId });
  }
}

