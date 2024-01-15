import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import expressSession from "express-session";
import handlebars from "express-handlebars";
import MongoStore from "connect-mongo";
import passport from "passport";
import path from "path";
import compression from "express-compression";
/* import authRouter from "./routers/auth.router.js"; */
import { addLogger } from "./config/logger.js";
import { config } from "./config/config.js";
import { init as initPassport } from "./config/passport.config.js";
import errorHandler from "./middleware/ErrorHandler.js"
import emailRouter from "./routers/email.router.js";
import cartRouter from "./routers/cartsDb.router.js";
import indexRouter from "./routers/index.router.js";
import messageRouter from "./routers/message.router.js";
import productRouter from "./routers/productsDb.router.js";
import userRouter from "./routers/user.router.js";
import { __dirname } from "./utils.js";

const app = express();

app.use(cors());

app.use(addLogger);
app.use(compression()); 
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

app.use("/", indexRouter, emailRouter);
app.use("/api", productRouter, cartRouter, userRouter, messageRouter);

app.use('/loggerTest', (req, res) => {
  req.logger.log('info', 'Este es un mensaje de información.');
  req.logger.log('warn', 'Este es un mensaje de advertencia.');
  req.logger.log('error', 'Este es un mensaje de error.');

  res.send('Logs generados. Revisa la consola y el archivo de registro.');
});

 app.use(errorHandler);

export default app;
