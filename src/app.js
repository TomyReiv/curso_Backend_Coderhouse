import express from "express";
import handlebars from 'express-handlebars';
import path from 'path';
import dotenv from "dotenv";

dotenv.config();

import cartRouter from "./routers/cartsDb.router.js";
import indexRouter from "./routers/index.router.js"
import userRouter from "./routers/user.router.js";
import productRouter from "./routers/productsDb.router.js";
import messageRouter from "./routers/message.router.js";
import { __dirname } from "./utils.js";
import expressSession from "express-session";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(expressSession({
    secret: process.env.secret,
    resave: true,
    saveUninitialized: true
}));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set("view engine",'handlebars');


app.use('/', indexRouter);
app.use('/api', productRouter, cartRouter, userRouter, messageRouter);


export default app;