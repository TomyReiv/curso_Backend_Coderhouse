import app from "./app.js";
import http from "http";
import { init } from "./db/mongodb.js";
import { initSocket } from "./socket.js";
import { config } from "./config/config.js";

await init ();

const serverHttp = http.createServer(app);

const PORT = config.PORT;

serverHttp.listen(PORT, () => {
  console.log(`Servidor corriendo en ${PORT}`);
});

initSocket(serverHttp);
