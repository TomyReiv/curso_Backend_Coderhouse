import { Router } from "express";
import cartManager from "../dao/cartManagers.js";

const router = Router();

router.get("/cart", async (req, res) => {
  const { query = {} } = req;
  const product = await cartManager.get(query);
  res.status(200).json(product);
});

router.get("/cart/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getById({ _id: cid });
    if (!cart) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post("/cart", async (req, res) => {
  try {
    const { body } = req;
    const result = await cartManager.create(body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.put("/cart/cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { body } = req;
    const result = await cartManager.updateById(cid, body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.delete("/cart/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await cartManager.deleteById(cid);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

export default router;
