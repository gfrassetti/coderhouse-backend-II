import { PasswordResetTokenDAO } from "../dao/passwordResetTokenDAO.js";
import crypto from "crypto";
import { config } from "../config/config.js";

export class PasswordResetTokenRepository {
  static async createToken(userId) {
    // Token unico 
    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + config.passwordReset.expiration
    );

    //Invalidar tokens previos
    await PasswordResetTokenDAO.deleteByUser(userId);

    return await PasswordResetTokenDAO.create({
      user: userId,
      token,
      expiresAt,
      used: false,
    });
  }

  static async getByToken(token) {
    const tokenData = await PasswordResetTokenDAO.findByToken(token);
    
    if (!tokenData) {
      return { valid: false, reason: "Token no encontrado" };
    }

    if (tokenData.used) {
      return { valid: false, reason: "Token ya utilizado" };
    }

    if (new Date() > new Date(tokenData.expiresAt)) {
      return { valid: false, reason: "Token expirado" };
    }

    return { valid: true, tokenData };
  }

  static async markAsUsed(token) {
    return await PasswordResetTokenDAO.markAsUsed(token);
  }
}

