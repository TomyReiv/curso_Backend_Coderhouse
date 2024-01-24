
import userManager from "../dao/userManager.js";
import Exception from "../utils.js";
import userDto from "../dto/user.dto.js";

export default class userService {
  static async getUsers(query = {}) {
    try {
      const users = await userManager.get(query);
      return users.map(user => new userDto(user))
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async getUserById(uid) {
    try {
      const user = await userManager.getById(uid);
      if (!user) {
        throw new Exception("No existe el usuario", 404);
      }
      return user;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async createUser(userData) {
    try {
      return await userManager.createUser(userData);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async findUserByEmail(email) {
    try {
      const user = await userManager.findUserByEmail( email );
      if (!user) {
        throw new Exception("No existe el usuario", 404);
      }
     return new userDto(user)
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async updateById(uid, data) {
    try {
      const user = await userManager.getById(uid);
      if (!user) throw new Exception("El usuario no existe", 404);

      const criterio = { _id: uid };
      const operation = { $set: data };

      await userManager.updateById(criterio, operation);
      console.log("Usuario actualizado");
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async updatePassword(uid, data) {
    try {
      const user = await userManager.getById(uid);
      if (!user) throw new Exception("El usuario no existe", 404);

      const criterio = { _id: uid };
      const operation = { $set: {'password': data} };
      
      await userManager.updateById(criterio, operation);
      console.log("Usuario actualizado");
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async deleteById(uid) {
    try {
      const user = await userManager.getById(uid);
      if (!user) throw new Exception("El usuario no existe", 404);

      const criterio = { _id: uid };
      await userManager.deleteOne(criterio);

      console.log("Usuario eliminado");
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
}
