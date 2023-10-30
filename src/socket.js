import { Server } from "socket.io";
import productModel from "./models/product.model.js";
import messageManager from "./dao/messageManager.js";

let io;

export const initSocket = async (httpServer) => {


  io = new Server(httpServer);

  let messagesGlobal = [];


  io.on("connection", async (socketClient) => {

    const messages = await messageManager.get();
    console.log(`Socket conectado: ${socketClient.id}`);

    socketClient.emit("notification", { messagesGlobal });
    socketClient.on("new-message", async (data) => {
      try {
        const { username, message } = data;
        const result = await messageManager.create(data);
        messagesGlobal.push({username, message});
        io.emit("notification", { messagesGlobal });
      } catch (error) {
        console.log(error);
      }
    });

    socketClient.broadcast.emit("new-client");
  });

  io.on("connection", async (socketClient) => {

    const product = await productModel.find();

    console.log(`cliente conectado: ${socketClient.id}`);

    socketClient.emit("products", product);

    socketClient.on("new-product", async (productJSON) => {
      try {
        const product = JSON.parse(productJSON);
        const thumbnail = [];
        const result = await productModel.create({
          title: product.title,
          description: product.description,
          price: product.price,
          thumbnail: thumbnail,
          code: product.code,
          status: product.status,
          stock: product.stock,
          category: product.category,
        });
      } catch (error) {
        console.log(error);
      }
    });
  });

  console.log("Server socket running");
};
