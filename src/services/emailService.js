import nodemailer from "nodemailer";
import { config } from "../config/config.js";

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${config.frontend.url}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: "Recuperación de Contraseña - Ecommerce",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #0056b3;
            }
            .warning {
              color: #dc3545;
              font-size: 14px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Recuperación de Contraseña</h2>
            <p>Hola,</p>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el botón siguiente para continuar:</p>
            <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p>${resetUrl}</p>
            <p class="warning">⚠️ Este enlace expirará en 1 hora por seguridad.</p>
            <p>Si no solicitaste este cambio, ignora este correo.</p>
            <p>Saludos,<br>Equipo de Ecommerce</p>
          </div>
        </body>
        </html>
      `,
      text: `Has solicitado restablecer tu contraseña. Visita el siguiente enlace para continuar: ${resetUrl}. Este enlace expirará en 1 hora.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error("Error al enviar email:", error);
      throw new Error("Error al enviar el correo de recuperación");
    }
  }

  async sendPurchaseConfirmationEmail(email, ticket) {
    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: `Confirmación de Compra - Ticket ${ticket.code}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .ticket {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .product-item {
              padding: 10px;
              border-bottom: 1px solid #ddd;
            }
            .total {
              font-size: 20px;
              font-weight: bold;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Confirmación de Compra</h2>
            <p>Hola,</p>
            <p>Tu compra ha sido procesada exitosamente.</p>
            <div class="ticket">
              <h3>Ticket: ${ticket.code}</h3>
              <p><strong>Fecha:</strong> ${new Date(ticket.purchase_datetime).toLocaleString()}</p>
              <h4>Productos:</h4>
              ${ticket.products
                .map(
                  (item) => `
                <div class="product-item">
                  <p><strong>${item.product?.title || "Producto"}</strong> - Cantidad: ${item.quantity} - Precio: $${item.price}</p>
                </div>
              `
                )
                .join("")}
              <div class="total">Total: $${ticket.amount}</div>
            </div>
            ${ticket.incompleteProducts?.length > 0 ? `
              <h4>Productos no procesados:</h4>
              ${ticket.incompleteProducts
                .map(
                  (item) => `<p>${item.product?.title || "Producto"}: ${item.reason}</p>`
                )
                .join("")}
            ` : ""}
            <p>Gracias por tu compra!</p>
            <p>Saludos,<br>Equipo de Ecommerce</p>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error("Error al enviar email de confirmación:", error);
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();

