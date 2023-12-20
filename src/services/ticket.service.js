import Exception from "../utils.js";
import ticketManager from "../dao/ticketManager.js";

export default class ticketService {
  static async get() {
    try {
      return await ticketManager.get();
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
  static async getById(id) {
    try {
      const ticket = await ticketManager.getById(id);
      if (!ticket) throw new Exception("Ticket not found", 404);
      return ticket;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
  static async create(data) {
    try {
      return await ticketManager.create(data);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
  static async update(id, data) {
    try {
      const ticket = await ticketManager.getById(id);
      if (!ticket) throw new Exception("The ticket does not exist", 404);
      const tid = { _id: id };
      const ticketData = { $set: data };
      return await ticketManager.update(tid, ticketData);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
}
