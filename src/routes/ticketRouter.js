import { Router } from "express";
import passport from "passport";
import { TicketRepository } from "../repositories/ticketRepository.js";
import { TicketDTO } from "../dtos/ticketDTO.js";
import { PurchaseService } from "../services/purchaseService.js";
import { requireUser } from "../middleware/authorization.js";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/purchase", requireUser, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const userEmail = req.user.email;

    const result = await PurchaseService.processPurchase(userId, userEmail);

    const ticketDTO = result.ticket
      ? TicketDTO.fromTicket(result.ticket)
      : null;

    res.status(result.ticket ? 201 : 200).send({
      status: "success",
      payload: {
        ticket: ticketDTO ? ticketDTO.toJSON() : null,
        processedProducts: result.processedProducts,
        incompleteProducts: result.incompleteProducts,
        totalAmount: result.totalAmount,
      },
      message: result.message,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/", requireUser, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const tickets = await TicketRepository.getByPurchaser(userEmail);

    const ticketsDTO = TicketDTO.fromTickets(tickets);

    res.send({
      status: "success",
      payload: ticketsDTO.map((t) => t.toJSON()),
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/:tid", requireUser, async (req, res) => {
  try {
    const { tid } = req.params;
    const ticket = await TicketRepository.getById(tid);

    if (!ticket) {
      return res.status(404).send({
        status: "error",
        message: "Ticket no encontrado",
      });
    }

    if (ticket.purchaser !== req.user.email) {
      return res.status(403).send({
        status: "error",
        message: "No tienes permiso para ver este ticket",
      });
    }

    const ticketDTO = TicketDTO.fromTicket(ticket);
    res.send({
      status: "success",
      payload: ticketDTO.toJSON(),
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

export default router;

