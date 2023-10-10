import { promises as fs } from "fs";
import { v4 as uuidv4 } from 'uuid';
import { utilsManager } from "./utils.js";

uuidv4();

const utils = new utilsManager();


class ProductManager {
  constructor() {
    this.path = "src/productos.json";
    this.products = [];
  }

  removeNulls(array) {
    return array.filter((item) => item !== null);
  }

  async readJson() {
    try {
      const fileContent = await fs.readFile(this.path, "utf-8");
      const parsedProducts = JSON.parse(fileContent);

      // Elimina los elementos null de la matriz parsedProducts
      this.products = this.removeNulls(parsedProducts);
    } catch (error) {
      console.log("File not exist", error);
    }
  }

  //Metodo de agregar contenido

  async addProduct(title, description, price, thumbnail, code, status, stock, category) {
    await this.readJson();

    if (!title || !description || !price || !code || !stock || !category) {
      console.log("All fields are necessary.");
      return "All fields are necessary.";
    }

    if (utils.existFile(this.path) && this.products.some((product) => product.code === code)) {
      console.log("Code already exists.");
      return "Code already exists.";
    } else {

      const newProduct = {
        id: uuidv4(),
        title,
        description,
        price,
        thumbnail: Array.isArray(thumbnail) ? thumbnail : [thumbnail],
        code,
        status,
        stock,
        category
      };

      this.products.push(newProduct);

      await utils.pushFile(this.path, this.products)
        .then(() => {
          console.log("Product was upload");
          return "Product was upload";
        })
        .catch(() => {
          console.log(error);
        });
    }
  }

  //Metodo de obtener el contenido

  async getProducts(limit) {
    try {
      const fileExists = await utils.existFile(this.path);
      const fileContent = await this.readJson();

      if (!fileExists) {
        console.log("File not exist.");
        return [];
      }
      if (!isNaN(limit)) {
        const products = this.products.slice(0, limit);
        return products;
      } else {
        return this.products;
      }
    } catch (error) {
      console.log("File not exist.", error);
    }
  }

  //Metodo de obtener el contenido por id

  async getProductById(id) {
    try {
      const fileExists = await utils.existFile(this.path);
      const fileContent = await this.readJson();

      if (!fileExists) {
        console.log("File not exist.");
        return [];
      }

      const product = this.products.find((product) => product.id === id);
      if (product) {
        return product;
      } else {
        return "Not found";
      }
    } catch (error) {
      console.log("Not found", error);
    }
  }

  //Metodo de eliminar el contenido por id

  async daleteProductById(id) {
    try {
      const fileContent = await this.readJson();
      const productIndex = this.products.findIndex(
        (product) => product.id === id
      );

      if (productIndex === -1) {
        return `Product with id ${id} not found.`;
      }

      this.products.splice(productIndex, 1);

      await utils.pushFile(this.path, this.products)

      return `Product with id ${id} has been deleted.`;
    } catch (error) {
      console.log(error);
    }
  }

  // Método para actualizar un producto por ID
  async updateProduct(id, newData) {
    try {
      const fileExists = await utils.existFile(this.path);
      const fileContent = await this.readJson();

      const productIndex = this.products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      return "Product not found"; 
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...newData,
    };

    await utils.pushFile(this.path, this.products)

    return "Product upgrated";
    } catch (error) {
      console.log('Sistem error', error);
    }
    
  }

}

export default ProductManager;

