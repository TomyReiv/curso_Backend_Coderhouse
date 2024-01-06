import userService from "../services/user.service.js";
import Exception from "../utils.js";

export default class userController {
  static async get(query = {}) {
    try {
      return await userService.getUsers(query);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async getById(uid) { 
    try {
      return await userService.getUserById(uid);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async createUser(userData) {
    try {
      const user = await userService.createUser(userData);
      console.log("Usuario creado");
      return user.message;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async findUserByEmail(email) {
    try {
      return await userService.findUserByEmail({ email });
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async updateById(uid, data) {
    try {
      await userService.updateById(uid, data);
      console.log("Usuario actualizado");
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async updatePassword(uid, data) {
    try {
      await userService.updatePassword(uid, data);
      console.log("Usuario actualizado");
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async deleteById(uid) {
    try {
      await userService.deleteById(uid);
      console.log("Usuario eliminado");
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
}
