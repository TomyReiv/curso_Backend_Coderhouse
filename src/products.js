
import { promises as fs } from 'fs';

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

  async readJson() {
    try {
      const fileContent = await fs.readFile(this.path, "utf-8");
      this.products = JSON.parse(fileContent);
    } catch (error) {
      console.log("El archivo no existe", error);
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

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("All fields are necessary.");
      return "All fields are necessary.";
    }

    if (this.products.some((product) => product.code === code)) {
      console.log("Code already exists.");
      return "Code already exists.";
    }

    const newProduct = {
      id: this.productIdCounter++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);

    this.pushFile()
      .then(() => {
        console.log("Producto cargado exitosamente");
        return "Producto cargado exitosamente";
      })
      .catch(() => {
        console.log(error);
      });
  }

  //Metodo de obtener el contenido

  async getProducts(limit) {
    try {
      const fileExists = await this.existFile();
      const fileContent = await this.readJson();

      if (!fileExists) {
        console.log("El archivo no existe.");
        return [];
      }
      if (!isNaN(limit)) {
        const products = this.products.slice(0, limit);
         return products;
      } else {
        return this.products;
      }
    } catch (error) {
      console.log("El archivo no existe", error);
    }
  }

   //Metodo de obtener el contenido por id

  async getProductById(id) {
    try {

      const fileExists = await this.existFile();
      const fileContent = await this.readJson();

      if (!fileExists) {
        console.log("El archivo no existe.");
        return [];
      }

      const product = this.products.find((product) => product.id === id);
      if (product) {
        return product;
      } else {
        return "Not found";
      }
    } catch (error) {
      console.log("El archivo no existe", error);
    }
  }

   //Metodo de eliminar el contenido por id

  async daleteProductById(id) {
    try {
      const fileContent = await this.readJson()
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
}

 const productManager = new ProductManager();


 /*  for (let i = 0; i < 15; i++) {
  productManager.addProduct(
    "producto prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    `abc123${i}`,
    25
  );
}   */

// Ejemplo de uso

/* 



productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc124",
  25
);
productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc125",
  25
);
productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc126",
  25
);
productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc127",
  25
); */
/* 


productManager.getProductById(2);

productManager.daleteProductById(3); */
