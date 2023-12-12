import cartModel from "../models/cart.model.js";
import Exception from "../utils.js";

export default class cartManager {
  static async get(query) {
    const carts = await cartModel.find(query).populate("items.pid");
    return carts;
  }

  static async getOne(query) {
    try {
      const cart = await cartModel.findOne(query).populate("items.pid");
      return cart;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async getById(cid) {
    try {
      const cart = await cartModel.findById(cid).populate("items.pid");
      return cart;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async create(cartData) {
    try {
      const cart = await cartModel.create(cartData);
      console.log("Carrito creado");
      return cart;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async updateById(uid, data) {
    try {
      await cartModel.updateOne(criterio, operation);
      console.log("Carrito actualizado");
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async updateOne(criterio, operation) {
    try {
      const cart = await cartModel.updateOne(criterio, operation);
      console.log("Carrito actualizado");
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async findOneAndUpdate(userId, pid, data) {
    try {
      await cartModel.findOneAndUpdate(
        { userId, "items.pid": pid },
        { $inc: { "items.$.quantity": data || 1 } }
      );
      console.log("Cantidad actualizada en el carrito");
      return {message: 'Cantidad actualizada en el carrito'};
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async deleteOne(criterio) {
    try {
      const cart = await cartModel.deleteOne(criterio);
      console.log("Carrito eliminado");
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async deleteById(cid) {
    try {
      await cartModel.deleteOne(criterio);
      console.log("Carrito eliminado");
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
}
