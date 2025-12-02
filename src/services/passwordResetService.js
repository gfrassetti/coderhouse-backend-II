import { UserRepository } from "../repositories/userRepository.js";
import { PasswordResetTokenRepository } from "../repositories/passwordResetTokenRepository.js";
import emailService from "./emailService.js";
import { isValidPassword } from "../utils/password.js";

export class PasswordResetService {
  static async requestPasswordReset(email) {
    const user = await UserRepository.getByEmail(email);
    
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return {
        success: true,
        message: "Si el email existe, recibirás un enlace para restablecer tu contraseña",
      };
    }

    const tokenData = await PasswordResetTokenRepository.createToken(user._id);

    try {
      await emailService.sendPasswordResetEmail(email, tokenData.token);
      return {
        success: true,
        message: "Se ha enviado un enlace de recuperación a tu correo electrónico",
      };
    } catch (error) {
      throw new Error("Error al enviar el correo de recuperación");
    }
  }

  static async resetPassword(token, newPassword) {

    const tokenValidation = await PasswordResetTokenRepository.getByToken(token);
    
    if (!tokenValidation.valid) {
      throw new Error(tokenValidation.reason || "Token inválido");
    }

    const { tokenData } = tokenValidation;
    

    const user = await UserRepository.getById(tokenData.user);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }


    if (isValidPassword(newPassword, user.password)) {
      throw new Error("La nueva contraseña no puede ser igual a la anterior");
    }

    await UserRepository.update(user._id, { password: newPassword });

//token usado
    await PasswordResetTokenRepository.markAsUsed(token);

    return {
      success: true,
      message: "Contraseña actualizada exitosamente",
    };
  }
}

