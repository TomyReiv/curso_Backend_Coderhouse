import http from "http";
import { Server } from "socket.io";
import ProductManager from "./classes/products.js";

import app from "./app.js";
import { init } from "./db/mongodb.js";
import productModel from "./models/product.model.js";

await init ();

const productManager = new ProductManager();

const product = await productModel.find();

const serverHttp = http.createServer(app);
const serverSocket = new Server(serverHttp);

const PORT = 8080;

serverHttp.listen(PORT, () => {
  console.log(`Servidor corriendo en ${PORT}`);
});

serverSocket.on("connection", (socketClient) => {
  console.log(`cliente conectado: ${socketClient.id}`);

  socketClient.emit("products", product);

  socketClient.on("new-product", async (productJSON) => {
    try {
      const product = JSON.parse(productJSON);
      const thumbnail = [];
      const result = await productModel.create({
        title:product.title,
        description:product.description,
        price:product.price,
        thumbnail:thumbnail,
        code:product.code,
        status:product.status,
        stock:product.stock,
        category:product.category,
      });
    } catch (error) {
      console.log(error);
    }
  });
});
