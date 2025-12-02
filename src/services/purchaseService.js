import { CartRepository } from "../repositories/cartRepository.js";
import { ProductRepository } from "../repositories/productRepository.js";
import { TicketRepository } from "../repositories/ticketRepository.js";
import { UserRepository } from "../repositories/userRepository.js";
import emailService from "./emailService.js";

export class PurchaseService {
  static async processPurchase(userId, userEmail) {
    // Obtener carrito del usuario
    const cart = await CartRepository.getByUser(userId);
    
    if (!cart || !cart.products || cart.products.length === 0) {
      throw new Error("El carrito está vacío");
    }

    const processedProducts = [];
    const incompleteProducts = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const productId = item.product._id || item.product;
      const requestedQuantity = item.quantity;

      const stockCheck = await ProductRepository.checkStock(
        productId,
        requestedQuantity
      );

      if (stockCheck.available) {
        await ProductRepository.updateStock(productId, -requestedQuantity);

        const product = stockCheck.product;
        const productTotal = product.price * requestedQuantity;
        totalAmount += productTotal;

        processedProducts.push({
          product: productId,
          quantity: requestedQuantity,
          price: productTotal,
        });
      } else {
        incompleteProducts.push({
          product: productId,
          quantity: requestedQuantity,
          reason: stockCheck.reason || "Stock insuficiente",
        });
      }
    }

    let ticket = null;
    if (processedProducts.length > 0) {
      ticket = await TicketRepository.create({
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: userEmail,
        products: processedProducts,
        incompleteProducts: incompleteProducts.length > 0 ? incompleteProducts : [],
      });

      try {
        await emailService.sendPurchaseConfirmationEmail(userEmail, {
          ...ticket,
          products: processedProducts.map((p) => ({
            ...p,
            product: cart.products.find(
              (item) =>
                (item.product._id || item.product).toString() ===
                p.product.toString()
            )?.product,
          })),
          incompleteProducts,
        });
      } catch (error) {
        console.error("Error al enviar email de confirmación:", error);
      }
    }


    if (processedProducts.length > 0) {
      for (const processed of processedProducts) {
        await CartRepository.removeProduct(
          cart._id,
          processed.product
        );
      }
    }

    return {
      ticket,
      processedProducts,
      incompleteProducts,
      totalAmount,
      message:
        incompleteProducts.length > 0
          ? "Compra parcialmente procesada. Algunos productos no tenían stock suficiente."
          : "Compra procesada exitosamente",
    };
  }
}

