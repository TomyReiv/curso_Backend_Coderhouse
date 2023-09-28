import express from "express";
import { ProductManager } from "./products.js";


const productManager = new ProductManager();

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  const limit = parseInt(req.query.limit);
  res.json(await productManager.getProducts(limit) )
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  res.send(await productManager.getProductById(parseInt(id)));
});

app.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  res.send(await productManager.daleteProductById(parseInt(id)));
});

app.listen(8080, () => {
  console.log("Server is running");
});
