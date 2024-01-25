// services/cart.service.js
import cartManager from "../dao/cartManagers.js";
import productManager from "../dao/productManager.js";
import userManager from "../dao/userManager.js";
import Exception from "../utils.js";

export default class cartService {
  static async getCarts(query) {
    try {
      return await cartManager.get(query);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async getOneCart(query) {
    try {
      const cart = await cartManager.getOne(query);
      if (!cart) throw new Exception("No existe el Carrito", 404);
      return cart;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async getCartById(cid) {
    try {
      const cart = await cartManager.getById(cid);
      if (!cart) throw new Exception("No existe el Carrito", 404);
      return cart;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async createCart(cartData) {
    try {
        const {
            userId,
            items: [{ pid, quantity }],
          } = cartData;

      const user = await userManager.getById(userId);
      const product = await productManager.getById(pid)

      if(user.email === product.owner) throw new Exception("El usuario no puede comprar sus propios productos", 404);

      const cartExist = await cartManager.getOne({ userId });

      if (!cartExist) throw new Exception("No existe el Carrito", 404);
          
      if (cartExist) {
        const existingItem = cartExist.items.find((item) => {
          const id = item.pid._id.toString();
          return id === pid;
        });

        if (existingItem) {
          await cartManager.findOneAndUpdate(userId, pid, quantity);
          console.log("Cantidad actualizada en el carrito");
          return { message: "Cantidad actualizada en el carrito" };
        } else {
          cartExist.items.push({ pid, quantity: quantity });
          await cartExist.save();
          console.log("Producto agregado al carrito");
          return { message: "Producto agregado al carrito" };
        }
      } else {
        return await cartManager.create(cartData);
      }
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async updateCartById(uid, data) {
    try {
      const cart = await cartManager.getById(uid);
      if (!cart) throw new Exception("Carrito no encontrado", 401);
      return await cartManager.updateById(uid, data);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async findOneAndUpdateCart(userId, pid, data) {
    try {
      return await cartManager.findOneAndUpdate(userId, pid, data);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async deleteCartById(cid) {
    try {
      const cart = await cartManager.getById(cid);
      if (!cart) throw new Exception("Carrito no encontrado", 401);
      return await cartManager.deleteById(cid);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async findByIdAndUpdateCart(cid, data) {
    try {
      return await cartManager.findByIdAndUpdate(cid, data);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async deleteOneCart(criterio) {
    try {
      return await cartManager.deleteOne(criterio);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
}
