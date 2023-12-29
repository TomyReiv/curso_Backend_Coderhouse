/* import userManager from "../dao/userManager.js";
import Exception from "../utils.js";

export default class userController {
  static async get(query = {}) {
    try {
      const criterion = {};
      if (query._id) criterion._id = query._id;
      if (query.username) criterion.username = query.username;
      if (query.lastname) criterion.lastname = query.lastname;
      if (query.email) criterion.email = query.email;
      const users = await userManager.get(criterion);
      return users;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async getById(uid) {
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
      const user = await userManager.createUser(userData);
      console.log("Usuario creado");
      return user.message;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
  static async findUserByEmail(email) {
    try {
      const user = await userManager.findUserByEmail({email});
      if (!user) {
        throw new Exception("No existe el usuario", 404);
      }
      return user;
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
      await userManager.updateOne(criterio, operation);
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
      const result = await userManager.deleteOne(criterio);
      return result.message;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
}
 */

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
      console.log('uid controllers: ', uid);
      console.log('data controllers: ', data);

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
