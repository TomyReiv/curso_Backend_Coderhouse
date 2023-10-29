import { Router } from "express";
import messageManager from "../dao/messageManager.js";

const router = Router();

router.get("/message", async (req, res) => {
  const { query = {} } = req;
  const product = await messageManager.get(query);
  res.status(200).json(product);
});

router.get("/message/:mid", async (req, res) => {
  try {
    const { mid } = req.params;
    const message = await messageManager.getById({ _id: mid });
    if (!message) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post("/message", async (req, res) => {
  try {
    const { body } = req;
    const result = await messageManager.create(body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.put("/message/mid", async (req, res) => {
  try {
    const { mid } = req.params;
    const { body } = req;
    const result = await messageManager.updateById(mid, body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.delete("/message/:mid", async (req, res) => {
  try {
    const { mid } = req.params;
    const result = await messageManager.deleteById(mid);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

export default router;
