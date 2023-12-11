import cartManager from "../dao/cartManagers.js";
import Exception from "../utils.js";

export default class cartController {
  static async get(query) {
    try {
      const carts = await cartManager.get(query);
      if (!carts) throw new Exception("No existe el Carrito", 404);
      return carts;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async getOne(query) {
    try {
      const cart = await cartManager.getOne(query);
      if (!cart) throw new Exception("No existe el Carrito", 404);
      return cart;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async getById(cid) {
    try {
      const cart = await cartManager.getById(cid);
      if (!cart) {
        throw new Exception("No existe el Carrito", 404);
      }
      return cart;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async create(cartData) {
    try {
      const {
        userId,
        items: [{ pid, quantity }],
      } = cartData;
      const cartExist = await cartManager.getOne({ userId });

      if (!cartExist) throw new Exception("No existe el Carrito", 404);

      if (cartExist) {
        const existingItem = cartExist.items.find((item) => {
          const id = item.pid._id.toString();
          return id === pid;
        });

        if (existingItem) {
          await cartManager.findOneAndUpdate(pid, quantity);
          console.log("Cantidad actualizada en el carrito");
          return existingItem;
        } else {
          cartExist.items.push({ pid, quantity: quantity });
          await cartExist.save();
          console.log("Producto agregado al carrito");
          return cartExist;
        }
      } else {
        const cart = await cartManager.create(cartData);
        console.log("Carrito creado");
        return cart;
      }
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async updateById(uid, data) {
    try {
      const cart = await cartManager.getById(uid);
      if (!cart) throw new Exception("Carrito no encontrado", 401);
      console.log("Carrito actualizado");
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async findOneAndUpdate(pid, data) {
    try {
      const existingItem = await cartManager.findOneAndUpdate(pid, data);
      if (!existingItem) throw new Exception("Carrito no encontrado", 401);
      console.log("Cantidad actualizada en el carrito");
      return existingItem;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async deleteById(cid) {
    try {
      const cart = await cartManager.getById(cid);
      if (!cart) throw new Exception("Carrito no encontrado", 401);
      const criterio = { _id: cid };
      const response = await cartManager.deleteById(criterio);
      console.log("Carrito eliminado");
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
}
