import messageModel from "../models/message.model.js";
import Exception from "../dirname.js";

export default class messageManager {
  static async get() {
    const message = await messageModel.find();
    return message;
  }

  static async getById(uid) {
    const message = await messageModel.findById(uid);
    if(!message) {throw new Exception ('No existe el Mensaje', 404)}
    return message;
  }
  static async create(messageData) {
    const message = await messageModel.create(messageData);
    console.log('Mensaje creado');
    return message;
  }
  static async updateById(uid, data) {
    const message = await messageModel.findById(uid);
    if (!message) throw new Exception("El Mensaje no existe", 404);
    const criterio = {_id: uid};
    const operation = {$set: data}
    await messageModel.updateOne(criterio, operation);
    console.log('Mensaje actualizado');
  }
  static async deleteById(uid) {
    const message = await messageModel.findById(uid);
    if (!message) throw new Exception("El Mensaje no existe", 404);
    const criterio = {_id: uid};
    await messageModel.deleteOne(criterio);
    console.log('Mensaje eliminado');
  }
}
