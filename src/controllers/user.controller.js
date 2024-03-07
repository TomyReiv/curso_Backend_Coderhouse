import userService from "../services/user.service.js";
import Exception from "../utils.js";
import { config } from "../config/config.js";

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
      console.log(error);
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

  static async uploadFile(uid, typeFile, file) {
    try {
      const data = {}
      switch (typeFile) {
        case 'Identificacion':
            Object.assign(data, {documento: `${config.BASE_URL}/documents/${file.filename}`})
            break;
        case 'Domicilio':
          Object.assign(data, {domicilio: `${config.BASE_URL}/documents/${file.filename}`})
            break;
        case 'Estado de cuenta':
          Object.assign(data, {cuenta: `${config.BASE_URL}/documents/${file.filename}`})
            break;
        case 'avatar':
          Object.assign(data, {avatar: `${config.BASE_URL}/documents/${file.filename}`})
            break;
        default:
          throw new Exception('Documento invalido');
    }
      const user = await userService.getUserById(uid);
      const documents = user.documents;
      documents.push(data)
      await userService.updateById(uid, {'documents':documents});
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
}
