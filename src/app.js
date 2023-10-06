import express from "express";

import productRouter from "./routers/products.router.js";
import cartRouter from "./routers/carts.router.js";

const PORT = 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', productRouter, cartRouter);

app.listen(PORT, () => {
  console.log("Server is running");
});
