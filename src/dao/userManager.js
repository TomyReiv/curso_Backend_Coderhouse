import userModel from "../models/user.model.js";
import Exception from "../utils.js";

export default class userManager {
  static async get(query = {}) {
    const criterion = {};
    if (query._id) criterion._id = query._id;
    if (query.username) criterion.username = query.username;
    if (query.lastname) criterion.lastname = query.lastname;
    if (query.email) criterion.email = query.email;
    const users = await userModel.find(criterion);
    return users;
  }

  static async getById(uid) {
    const user = await userModel.findById(uid);
    if(!user) {throw new Exception ('No existe el usuario', 404)}
    return user;
  }
  static async createUser(userData) {
    const user = await userModel.create(userData);
    console.log('Usuario creado');
    return {message: 'Usuario creado'};
  }
  static async findUserByEmail(email){
    const user = await userModel.findOne({email});
    if(!user) {throw new Exception ('No existe el usuario', 404)}
    return user;
  }
  static async updateById(uid, data) {
    const user = await userModel.findById(uid);
    if (!user) throw new Exception("El usuario no existe", 404);
    const criterio = {_id: uid};
    const operation = {$set: data}
    await userModel.updateOne(criterio, operation);
    console.log('Usuario actualizado');
  }
  static async deleteById(uid) {
    const user = await userModel.findById(uid);
    if (!user) throw new Exception("El usuario no existe", 404);
    const criterio = {_id: uid};
    await userModel.deleteOne(criterio);
    console.log('Usuario eliminado');
  }
}
