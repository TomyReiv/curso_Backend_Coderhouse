import express from "express";
import { ProductManager } from "./products.js";

const productManager = new ProductManager();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  const limit = parseInt(req.query.limit);
  res.json(await productManager.getProducts(limit));
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  res.send(await productManager.getProductById(parseInt(id)));
});

app.post("/products", async (req, res) => {
  const body = req.body;

  const { title, description, price, thumbnail, code, stock } = body;

  if (!title || !description || !price || !thumbnail || !code || !stock) {
    console.log("All fields are necessary.");
    return res.status(400).json({ message: "All fields are necessary." });
  }

  const newProduct = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
  };
  res
    .status(201)
    .json(
      await productManager.addProduct(
        newProduct.title,
        newProduct.description,
        newProduct.price,
        newProduct.thumbnail,
        newProduct.code,
        newProduct.stock
      )
    );
});

app.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  res.send(await productManager.daleteProductById(parseInt(id)));
});

app.listen(8080, () => {
  console.log("Server is running");
});
