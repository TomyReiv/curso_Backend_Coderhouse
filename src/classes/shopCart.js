import { promises as fs } from "fs";
import { utilsManager } from "./utils.js";

const utils = new utilsManager();

class CartsManager {
  constructor() {
    this.path = "src/carrito.json";
    this.cart = [];
  }

  async readJson() {
    try {
      const fileContent = await fs.readFile(this.path, "utf-8");
      this.cart = JSON.parse(fileContent);
    } catch (error) {
      if (error.code === "ENOENT") {
        await this.pushFile();
      } else {
        console.log("Error reading file:", error);
      }
    }
  }

  async creatCart(id) {
    await this.readJson();

    const existingCart = {
      id: id,
      cart: [],
    };
    this.cart.push(existingCart);

    await utils.pushFile(this.path, this.cart);

    console.log("Cart created");
    return "Cart created";
  }

  //Agregar productos al carro
  async addProductToCart(cardId, product) {
    try {
      await this.readJson();

      if (!cardId || !product) {
        console.log("Card ID and product are required.");
        return "Card ID and product are required.";
      }

      let existingCart = this.cart.find((cart) => cart.id === cardId);

      let existingProduct = existingCart.cart.find(
        (item) => item.pid === product
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        const newProduct = { pid: product, quantity: 1 };
        existingCart.cart.push(newProduct);
      }

      await utils.pushFile(this.path, this.cart);

      console.log("Product added to cart");
      return "Product added to cart";
    } catch (error) {
      console.log(error);
    }
  }

  //get by id
  async getCartById(id) {
    try {
      const fileExists = await utils.existFile(this.path);
      const fileContent = await this.readJson();

      if (!fileExists) {
        console.log("File not exist.");
        return [];
      }

      const product = this.cart.find((product) => product.id === id);
      if (product) {
        return product;
      } else {
        return "Not found";
      }
    } catch (error) {
      console.log("Not found", error);
    }
  }
}

export default CartsManager;
