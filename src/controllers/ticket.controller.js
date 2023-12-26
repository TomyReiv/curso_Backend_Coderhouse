import Exception from "../utils.js";
import ticketService from "../services/ticket.service.js";
import productService from "../services/product.service.js";
import cartService from "../services/cart.service.js";
import userService from "../services/user.service.js";

export default class ticketController {
  static async get() {
    try {
      return await ticketService.get();
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
  static async getById(id) {
    try {
      return await ticketService.getById(id);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
  static async create(cid, data) {
    try {
      const cart = await cartService.getCartById(cid);

      const uid = cart.userId;
      const user = await userService.getUserById(uid);
      const createdTickets = [];

      for (const item of cart.items) {
        const product = await productService.getProductById(item.pid._id);

        if (item.quantity <= product.stock)  {

          const stock = product.stock - item.quantity;
          await productService.updateProductById(item.pid._id, { stock });

          createdTickets.push({
            productId: item.pid._id,
            title: product.title,
            quantity: item.quantity,
            amoun: item.quantity * product.price,
          })

          const cart = await cartService.getCartById(cid);
          const productIndex = cart.items.findIndex((item) => {
            const id = item.pid._id.toString();
            return id === product._id;
          });
      
          cart.items.splice(productIndex, 1);
          await cart.save();

        } else {
          console.log( `No hay stock suficiente de ${product.title}`)
        }
      }

      if (createdTickets.length === 0) {
        return { message: "Todos los artículos tienen stock insuficiente" };
      }

      const totalAmount = createdTickets.reduce((total, ticket) => total + ticket.amoun, 0);

      const purchaser = user.email;
      const purchase_datetime = new Date();
      const code = `${Date.now()}-${cid}`;

      const ticketBody = {
        code,
        purchase_datetime,
        amoun: totalAmount,
        purchaser,
      };

      const ticket = await ticketService.create(ticketBody);
      return { message: "Compra realizada" };
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
  static async update(id, data) {
    try {
      const ticket = await ticketService.update(id, data);
      return ticket.message;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
}
