import { promises as fs } from "fs";

export class ProductManager {
  constructor() {
    this.path = "./info.json";
    this.products = [];
    this.productIdCounter = 1;
  }

  //Me aseguro que el archivo exista

  async existFile() {
    try {
      await fs.access(this.path);
      return true;
    } catch (error) {
      return false;
    }
  }

  //Leo el archivo
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

  //Agrego el contenido

  async pushFile() {
    try {
      const newContent = JSON.stringify(this.products, null, 2);
      await fs.writeFile(this.path, newContent, "utf-8");
    } catch (error) {
      console.log(error);
    }
  }

  //Metodo de agregar contenido

  async addProduct(title, description, price, thumbnail, code, stock) {
    await this.readJson();

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("All fields are necessary.");
      return "All fields are necessary.";
    }

    if (this.existFile() && this.products.some((product) => product.code === code)) {
      console.log("Code already exists.");
      return "Code already exists.";
    } else {

      const newProduct = {
        id: this.products.length++,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      this.products.push(newProduct);

      await this.pushFile()
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
      const fileExists = await this.existFile();
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
      const fileExists = await this.existFile();
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

      await this.pushFile();

      return `Product with id ${id} has been deleted.`;
    } catch (error) {
      console.log(error);
    }
  }

  // Método para actualizar un producto por ID
  async updateProduct(id, newData) {
    try {
      const fileExists = await this.existFile();
      const fileContent = await this.readJson();

      const productIndex = this.products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      return "Product not found"; 
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...newData,
    };

    await this.pushFile();

    return "Product upgrated";
    } catch (error) {
      console.log('Sistem error', error);
    }
    
  }

}

const productManager = new ProductManager();
