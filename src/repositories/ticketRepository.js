import { TicketDAO } from "../dao/ticketDAO.js";

export class TicketRepository {
  static async getAll() {
    return await TicketDAO.findAll();
  }

  static async getById(id) {
    return await TicketDAO.findById(id);
  }

  static async getByCode(code) {
    return await TicketDAO.findByCode(code);
  }

  static async getByPurchaser(email) {
    return await TicketDAO.findByPurchaser(email);
  }

  static async create(ticketData) {
    // Generar código único para el ticket
    const code = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    return await TicketDAO.create({
      ...ticketData,
      code,
    });
  }
}

