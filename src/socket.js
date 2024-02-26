import { Server } from "socket.io";

let io;

export const initSocket = async (httpServer) => {


  io = new Server(httpServer);

  let messagesGlobal = [];


  io.on("connection", async (socketClient) => {

    console.log(`Socket conectado: ${socketClient.id}`);

    socketClient.emit("notification", { messagesGlobal });
    socketClient.on("new-message", async (data) => {
      try {
        const { username, message } = data;
        messagesGlobal.push({username, message});
        io.emit("notification", { messagesGlobal });
      } catch (error) {
        console.log(error);
      }
    });

    socketClient.broadcast.emit("new-client");
  });

  io.on("connection", async (socketClient) => {

    console.log(`cliente conectado: ${socketClient.id}`);
  });

  console.log("Server socket running");
};
