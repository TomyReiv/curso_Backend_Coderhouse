import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import expressSession from "express-session";
import handlebars from "express-handlebars";
import MongoStore from "connect-mongo";
import passport from "passport";
import path from "path";

import cartRouter from "./routers/cartsDb.router.js";
import { config } from "./config.js";
import indexRouter from "./routers/index.router.js";
import { init as initPassport } from "./middleware/passport.config.js";
import messageRouter from "./routers/message.router.js";
import productRouter from "./routers/productsDb.router.js";
import userRouter from "./routers/user.router.js";
import { __dirname } from "./utils.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.SERVER_SECRET));
app.use(express.static(path.join(__dirname, "/public")));
app.use(
  expressSession({
    secret: config.SERVER_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: config.DB_HOST,
      mongoOptions: {},
      ttl: 172800,
    }),
  })
);

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/api", productRouter, cartRouter, userRouter, messageRouter);

/* app.use((error, req, res, next) => {
  const message = `Ah ocurrido un error inesperado: ${error.message}`;
  console.log(message);
  res.status(500).json({ status: "error", message });
}); */

export default app;
