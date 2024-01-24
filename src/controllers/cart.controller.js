// controllers/cart.controller.js
import cartService from "../services/cart.service.js";
import Exception from "../utils.js";

export default class cartController {
  static async get(query) {
    try {
      return await cartService.getCarts(query);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async getOne(query) {
    try {
      return await cartService.getOneCart(query);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async getById(cid) {
    try {
      return await cartService.getCartById(cid);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async create(cartData) {
    try {
      return await cartService.createCart(cartData);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async updateById(uid, data) {
    try {
      return await cartService.updateCartById(uid, data);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async findOneAndUpdate(pid, data) {
    try {
      return await cartService.findOneAndUpdateCart(pid, data);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async deleteById(cid) {
    try {
      return await cartService.deleteCartById(cid);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async findByIdAndUpdate(cid, data) {
    try {
      return await cartService.findByIdAndUpdateCart(cid, data);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async deleteOne(criterio) {
    try {
      return await cartService.deleteOneCart(criterio);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
}
