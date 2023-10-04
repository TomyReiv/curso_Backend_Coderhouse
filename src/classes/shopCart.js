import { promises as fs } from "fs";

class CartsManager {
  constructor() {
    this.path = "src/cart.json";
    this.cart = [];
  }

  async existFile() {
    try {
      await fs.access(this.path);
      return true;
    } catch (error) {
      return false;
    }
  }

  async readJson() {
    try {
      const fileContent = await fs.readFile(this.path, "utf-8");
      this.cart = JSON.parse(fileContent);
    } catch (error) {
      if (error.code === "ENOENT") {
        // El archivo no existe, se crea un archivo vacío
        await this.pushFile();
      } else {
        console.log("Error reading file:", error);
      }
    }
  }

  async pushFile() {
    try {
      const newContent = JSON.stringify(this.cart, null, 2);
      await fs.writeFile(this.path, newContent, "utf-8");
    } catch (error) {
      console.log("Error writing file:", error);
    }
  }

  //Agregar productos al carro
  async addProductToCart(cardId, product) {
    await this.readJson();

    if (!cardId || !product) {
      console.log("Card ID and product are required.");
      return "Card ID and product are required.";
    }

    let existingCart = this.cart.find((cart) => cart.id === cardId);

    if (!existingCart) {
      existingCart = {
        id: cardId,
        cart: [],
      };
      this.cart.push(existingCart);
    }


    let existingProduct = existingCart.cart.find(
      (item) => item.pid === product.pid
    );
  
    if (existingProduct) {
      // Si el producto ya existe en el carrito, aumenta la cantidad
      existingProduct.quantity += 1;
    } else {
      // Si el producto no existe en el carrito, agrégalo con cantidad 1
      product.quantity = 1;
      existingCart.cart.push(product);
    }

    // Actualizar el archivo JSON
    await this.pushFile();

    console.log("Product added to cart");
    return "Product added to cart";
  }

  //get by id
  async getCartById(id) {
    try {
      const fileExists = await this.existFile();
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
