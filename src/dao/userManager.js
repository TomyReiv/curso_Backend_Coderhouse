import userModel from "../models/user.model.js";
import Exception from "../utils.js";

export default class userManager {
  static async get(query = {}) {
    try {
      const users = await userModel.find(query);
      return users;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async getById(uid) {
    try {
      const user = await userModel.findById(uid);
      return user
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  };

  static async createUser(userData) {
    try {
      const user = await userModel.create(userData);
      console.log("Usuario creado");
      return { message: "Usuario creado" };
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  };

  static async findUserByEmail(email) {
    try {
      const user = await userModel.findOne(email);
      return user;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  };

  static async updateById(uid, data) {
    try {
      await userModel.updateById(uid, data);
      return { message: "Usuario actualizado" };
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  };
  
  static async deleteOne(uid) {
    try {
      await userModel.deleteOne(uid);
      return { message: "Usuario eliminado" };
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
}