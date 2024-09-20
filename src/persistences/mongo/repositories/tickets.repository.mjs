import { ticketModel } from "../models/ticket.model.mjs";

const getAll = async () => {
  const tickets = await ticketModel.find();
  return tickets;
};

const getById = async (tid) => {
  const ticket = await ticketModel.findOne({ _id: tid });
  return ticket;
};

const create = async (data) => {
  const ticket = await ticketModel.create(data);
  return ticket;
};

export default {
  getAll,
  getById,
  create,
};
