import cartModel from "../models/cart.model.js";
import Exception from "../utils.js";

export default class cartManager {
  static async get() {
    const carts = await cartModel.find();
    return carts;
  }

  static async getById(cid) {
    const cart = await cartModel.findById(cid);
    if (!cart) {
      throw new Exception("No existe el Carrito", 404);
    }
    return cart;
  }

  static async create(cartData) {
    const { userId, items: [{ pid, quantity }] } = cartData;
    const cartExist = await cartModel.findOne({ userId });

    if (cartExist) {
      const existingItem = cartExist.items.find(item => item.pid === pid);
  
      if (existingItem) {
        await cartModel.findOneAndUpdate(
          { userId, "items.pid": pid },
          { $inc: { "items.$.quantity": quantity || 1 } }
        );
        console.log("Cantidad actualizada en el carrito");
      } else {
        cartExist.items.push({ pid, quantity: quantity });
        await cartExist.save();
        console.log("Producto agregado al carrito");
      }
    } else {
      const cart = await cartModel.create(cartData);
      console.log("Carrito creado");
      return cart;
    }
  }

  static async updateById(uid, data) {
    const cart = await cartModel.findById(uid);
    if (!cart) throw new Exception("El Carrito no existe", 404);
    const criterio = { _id: uid };
    const operation = { $set: data };
    await cartModel.updateOne(criterio, operation);
    console.log("Carrito actualizado");
  }
  static async deleteById(uid) {
    const cart = await cartModel.findById(uid);
    if (!cart) throw new Exception("El Carrito no existe", 404);
    const criterio = { _id: uid };
    await cartModel.deleteOne(criterio);
    console.log("Carrito eliminado");
  }
}
