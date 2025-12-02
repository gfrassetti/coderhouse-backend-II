export class TicketDTO {
  constructor(ticket) {
    this.id = ticket._id?.toString() || ticket.id;
    this.code = ticket.code;
    this.purchase_datetime = ticket.purchase_datetime;
    this.amount = ticket.amount;
    this.purchaser = ticket.purchaser;
    this.products = ticket.products || [];
    this.incompleteProducts = ticket.incompleteProducts || [];
  }

  static fromTicket(ticket) {
    if (!ticket) return null;
    return new TicketDTO(ticket);
  }

  static fromTickets(tickets) {
    return tickets.map((ticket) => TicketDTO.fromTicket(ticket));
  }

  toJSON() {
    return {
      id: this.id,
      code: this.code,
      purchase_datetime: this.purchase_datetime,
      amount: this.amount,
      purchaser: this.purchaser,
      products: this.products,
      incompleteProducts: this.incompleteProducts,
    };
  }
}

