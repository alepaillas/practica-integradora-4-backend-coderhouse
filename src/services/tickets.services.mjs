import ticketRepository from "../persistences/mongo/repositories/tickets.repository.mjs";
import { generateUUID } from "../utils/uuid.mjs";
import customErrors from "../errors/customErrors.mjs"; // Import custom errors

const getAll = async () => {
  try {
    const tickets = await ticketRepository.getAll();
    if (!tickets || tickets.length === 0) {
      throw customErrors.notFoundError("No tickets found.");
    }
    return tickets;
  } catch (error) {
    throw error; // Pass error to the calling function
  }
};

const getById = async (id) => {
  try {
    const ticket = await ticketRepository.getById(id);
    if (!ticket) {
      throw customErrors.notFoundError(`Ticket with id: ${id} not found.`);
    }
    return ticket;
  } catch (error) {
    throw error; // Pass error to the calling function
  }
};

const createTicket = async (email, total, cartId) => {
  try {
    const newTicket = {
      amount: total,
      purchaser: email,
      code: generateUUID(),
      cart: cartId,
    };

    const createdTicket = await ticketRepository.create(newTicket);
    if (!createdTicket) {
      throw customErrors.createError("Error creating ticket.");
    }

    return createdTicket;
  } catch (error) {
    throw error; // Pass error to the calling function
  }
};

export default {
  getAll,
  getById,
  createTicket,
};
