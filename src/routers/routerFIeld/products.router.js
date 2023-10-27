import { Router } from "express";
import ProductManager from "../../classes/products.js";

const productManager = new ProductManager();

const router = Router();

router.get("/products", async (req, res) => {
  const limit = parseInt(req.query.limit);
  res.json(await productManager.getProducts(limit));
});

router.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  res.send(await productManager.getProductById(id));
});

router.post("/products", async (req, res) => {
  const body = req.body;

  const { title, description, price, thumbnail, code, status, stock, category } = body;

  if (!title || !description || !price || !category || !code || !stock) {
    console.log("All fields are necessary.");
    return res.status(400).json({ message: "All fields are necessary." });
  }

  const newProduct = {
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    stock,
    category
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
        newProduct.status ?? true,
        newProduct.stock,
        newProduct.category
      )
    );
});

router.delete("/products/delete/:id", async (req, res) => {
  const { id } = req.params;
  res.send(await productManager.daleteProductById(id));
});

router.put("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const newData = req.body;

  if(newData.id){
    console.log("Id can't by chenged.");
    return res.status(400).json({ message: "Id can't by chenged." });
  }

  res.status(201).json(await productManager.updateProduct(productId, newData));
});

export default router;