import http from "http";
import { Server } from "socket.io";
import ProductManager from "./classes/products.js";

import app from "./app.js";

const productManager = new ProductManager();

const product = await productManager.getProducts();

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
      const result = await productManager.addProduct(
        product.title,
        product.description,
        product.price,
        thumbnail,
        product.code,
        product.status,
        product.stock,
        product.category
      );
    } catch (error) {
      console.log(error);
    }
  });
});
