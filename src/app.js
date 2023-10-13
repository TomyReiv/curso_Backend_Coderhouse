import express from "express";
import handlebars from 'express-handlebars';
import path from 'path';

import cartRouter from "./routers/carts.router.js";
import indexRouter from "./routers/index.router.js"
import productRouter from "./routers/products.router.js";
import { __dirname } from "./dirname.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set("view engine",'handlebars');


app.use('/', indexRouter);
app.use('/api', productRouter, cartRouter);


export default app;