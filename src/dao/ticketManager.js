import Exception from "../utils.js";
import ticketModel from "../models/ticket.model.js";

export default class ticketManager {
  static async get() {
    try {
      return await ticketModel.find();
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
  static async getById(id) {
    try {
      return await ticketModel.findById(id);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
  static async create(data) {
    try {
      const ticket = await ticketModel.create(data);
      console.log("Ticket de venta creado");
      return { message: "Ticket de venta creado" };
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
  static async update(id, data) {
    try {
      await ticketModel.updateById(id, data);
      return { message: "Ticket actualizado" };
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
}
